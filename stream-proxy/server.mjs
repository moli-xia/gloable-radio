import http from 'node:http'
import crypto from 'node:crypto'
import { URL } from 'node:url'
import { readUserData, writeUserData } from './user-data.mjs'
import { userExists, validateUserCredentials, changeUserPassword } from './users-config.mjs'

const PORT = Number(process.env.STREAM_PROXY_PORT || 3001)
const PROXY_PREFIX = '/stream-proxy/'
const AUTH_PREFIX = '/api/auth/'
const USER_PREFIX = '/api/user/'
const RADIO_PREFIX = '/api/radio/'

// Radio-Browser community API mirrors. The frontend talks to /api/radio/* on
// the user's own server so that mobile / desktop clients behind networks
// that cannot reach radio-browser.info directly still get data. The server
// (which usually has good upstream connectivity) acts as the bridge.
const RADIO_BROWSER_PROVIDERS = (process.env.RADIO_BROWSER_PROVIDERS || [
  'https://us1.api.radio-browser.info',
  'https://de1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
  'https://fr1.api.radio-browser.info',
  'https://at1.api.radio-browser.info',
  'https://all.api.radio-browser.info'
].join(',')).split(',').map((url) => url.trim()).filter(Boolean)

const RADIO_USER_AGENT = process.env.RADIO_USER_AGENT || 'GlobalRadio/2.0 (server-proxy)'
const RADIO_TIMEOUT_MS = Number(process.env.RADIO_TIMEOUT_MS || 8000)

let stickyRadioProviderIdx = 0

const AUTH_SECRET = process.env.AUTH_SECRET || 'global-radio-default-secret-change-me'
const TOKEN_TTL_MS = Number(process.env.AUTH_TOKEN_TTL_MS || 7 * 24 * 60 * 60 * 1000)

const M3U8_TYPES = new Set([
  'application/vnd.apple.mpegurl',
  'application/x-mpegurl',
  'audio/mpegurl',
  'audio/x-mpegurl'
])

const AUTH_COOKIE = 'global_radio_auth'
const AUTH_COOKIE_MAX_AGE = Math.floor(TOKEN_TTL_MS / 1000)

function corsHeaders(extra = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...extra
  }
}

function sendJson(res, status, payload, extraHeaders = {}) {
  res.writeHead(status, corsHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    ...extraHeaders
  }))
  res.end(JSON.stringify(payload))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function createToken(username) {
  const payload = {
    username,
    exp: Date.now() + TOKEN_TTL_MS
  }
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url')
  return `${data}.${signature}`
}

function verifyToken(token) {
  if (!token) return null

  const [data, signature] = token.split('.')
  if (!data || !signature) return null

  const expected = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url')
  if (signature !== expected) return null

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'))
    if (!payload.username || typeof payload.exp !== 'number' || payload.exp < Date.now()) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

function getBearerToken(req) {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return null
  return header.slice(7).trim()
}

function getTokenFromRequest(req) {
  const bearer = getBearerToken(req)
  if (bearer) return bearer

  const cookieHeader = req.headers.cookie || ''
  const match = cookieHeader.match(new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

function buildAuthCookie(token) {
  return `${AUTH_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${AUTH_COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax`
}

function clearAuthCookie() {
  return `${AUTH_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
}

function isPrivateHost(hostname) {
  const host = hostname.toLowerCase()
  if (host === 'localhost' || host.endsWith('.local')) return true
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    const [a, b] = host.split('.').map(Number)
    if (a === 10) return true
    if (a === 127) return true
    if (a === 169 && b === 254) return true
    if (a === 192 && b === 168) return true
    if (a === 172 && b >= 16 && b <= 31) return true
  }
  return false
}

function isAllowedUrl(targetUrl) {
  try {
    const parsed = new URL(targetUrl)
    if (!['http:', 'https:'].includes(parsed.protocol)) return false
    return !isPrivateHost(parsed.hostname)
  } catch {
    return false
  }
}

function normalizeTargetUrl(targetUrl) {
  const parsed = new URL(targetUrl)
  const path = decodeURIComponent(parsed.pathname)
  return `${parsed.protocol}//${parsed.host}${path}${parsed.search}`
}

function toProxyUrl(targetUrl) {
  return `${PROXY_PREFIX}?url=${encodeURIComponent(normalizeTargetUrl(targetUrl))}`
}

function rewritePlaylist(body, baseUrl) {
  const base = new URL(baseUrl)

  return body.split('\n').map((line) => {
    const trimmed = line.trim()
    if (!trimmed) return line

    if (trimmed.startsWith('#')) {
      return trimmed.replace(/URI="([^"]+)"/g, (_match, uri) => {
        const absolute = new URL(uri, base).href
        return `URI="${toProxyUrl(absolute)}"`
      })
    }

    const absolute = new URL(trimmed, base).href
    return toProxyUrl(absolute)
  }).join('\n')
}

async function proxyRequest(targetUrl, req, res) {
  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers: {
      'User-Agent': req.headers['user-agent'] || 'GlobalRadio-Stream-Proxy/1.0',
      Accept: req.headers.accept || '*/*'
    },
    redirect: 'follow'
  })

  const contentType = (upstream.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
  const isPlaylist = M3U8_TYPES.has(contentType) || targetUrl.toLowerCase().includes('.m3u8')

  const headers = corsHeaders({
    'Cache-Control': 'no-store'
  })

  if (contentType) {
    headers['Content-Type'] = upstream.headers.get('content-type')
  }

  if (req.method === 'HEAD') {
    res.writeHead(upstream.status, headers)
    res.end()
    return
  }

  if (!upstream.ok) {
    sendJson(res, upstream.status, { error: `Upstream request failed: ${upstream.status}` })
    return
  }

  if (isPlaylist) {
    const text = await upstream.text()
    const rewritten = rewritePlaylist(text, targetUrl)
    headers['Content-Type'] = contentType || 'application/vnd.apple.mpegurl'
    res.writeHead(200, headers)
    res.end(rewritten)
    return
  }

  const buffer = Buffer.from(await upstream.arrayBuffer())
  res.writeHead(200, headers)
  res.end(buffer)
}

async function handleAuth(req, res, pathname) {
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    let body = {}
    try {
      body = JSON.parse(await readBody(req))
    } catch {
      sendJson(res, 400, { error: 'Invalid JSON body' })
      return
    }

    const username = typeof body.username === 'string' ? body.username.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    const user = validateUserCredentials(username, password)
    if (!user) {
      sendJson(res, 401, { error: 'Invalid username or password' })
      return
    }

    const token = createToken(user.username)
    sendJson(res, 200, { user: { username: user.username } }, {
      'Set-Cookie': buildAuthCookie(token)
    })
    return
  }

  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const payload = verifyToken(getTokenFromRequest(req))
    if (!payload || !userExists(payload.username)) {
      sendJson(res, 401, { error: 'Unauthorized' })
      return
    }

    sendJson(res, 200, { user: { username: payload.username } })
    return
  }

  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    sendJson(res, 200, { ok: true }, {
      'Set-Cookie': clearAuthCookie()
    })
    return
  }

  if (pathname === '/api/auth/change-password' && req.method === 'POST') {
    const payload = verifyToken(getTokenFromRequest(req))
    if (!payload || !userExists(payload.username)) {
      sendJson(res, 401, { error: 'Unauthorized' })
      return
    }

    let body = {}
    try {
      body = JSON.parse(await readBody(req))
    } catch {
      sendJson(res, 400, { error: 'Invalid JSON body' })
      return
    }

    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : ''
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : ''
    const result = changeUserPassword(payload.username, currentPassword, newPassword)

    if (!result.ok) {
      const status = result.error === 'Invalid current password' ? 401 : 400
      sendJson(res, status, { error: result.error })
      return
    }

    sendJson(res, 200, { ok: true })
    return
  }

  sendJson(res, 404, { error: 'Not found' })
}

async function handleUserData(req, res, pathname) {
  const payload = verifyToken(getTokenFromRequest(req))
  if (!payload || !userExists(payload.username)) {
    sendJson(res, 401, { error: 'Unauthorized' })
    return
  }

  if (pathname === '/api/user/data' && req.method === 'GET') {
    const data = readUserData(payload.username)
    sendJson(res, 200, { data })
    return
  }

  if (pathname === '/api/user/data' && req.method === 'PUT') {
    let body = {}
    try {
      body = JSON.parse(await readBody(req))
    } catch {
      sendJson(res, 400, { error: 'Invalid JSON body' })
      return
    }

    const saved = writeUserData(payload.username, body)
    sendJson(res, 200, { data: saved })
    return
  }

  sendJson(res, 404, { error: 'Not found' })
}

async function handleRadioProxy(req, res, reqUrl) {
  // Forward GET (and HEAD) requests to /api/radio/<path> to one of the
  // configured radio-browser.info mirrors, with sticky round-robin failover.
  if (!['GET', 'HEAD'].includes(req.method)) {
    sendJson(res, 405, { error: 'Method not allowed' })
    return
  }

  if (RADIO_BROWSER_PROVIDERS.length === 0) {
    sendJson(res, 503, { error: 'No radio-browser providers configured' })
    return
  }

  const suffix = reqUrl.pathname.slice(RADIO_PREFIX.length) // e.g. "json/stations/topvote/1"
  if (!suffix || suffix.includes('..')) {
    sendJson(res, 400, { error: 'Invalid radio endpoint' })
    return
  }

  const search = reqUrl.search || ''
  const total = RADIO_BROWSER_PROVIDERS.length
  const tried = []

  for (let i = 0; i < total; i++) {
    const providerIdx = (stickyRadioProviderIdx + i) % total
    const base = RADIO_BROWSER_PROVIDERS[providerIdx]
    const target = `${base}/${suffix}${search}`

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), RADIO_TIMEOUT_MS)

    try {
      const upstream = await fetch(target, {
        method: req.method,
        headers: {
          'User-Agent': RADIO_USER_AGENT,
          Accept: req.headers.accept || 'application/json'
        },
        redirect: 'follow',
        signal: controller.signal
      })
      clearTimeout(timer)

      // 5xx counts as provider failure → try the next mirror.
      if (upstream.status >= 500) {
        tried.push(`${base}:${upstream.status}`)
        continue
      }

      stickyRadioProviderIdx = providerIdx

      const contentType = upstream.headers.get('content-type') || 'application/json; charset=utf-8'
      const headers = corsHeaders({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=120'
      })

      if (req.method === 'HEAD') {
        res.writeHead(upstream.status, headers)
        res.end()
        return
      }

      const buffer = Buffer.from(await upstream.arrayBuffer())
      res.writeHead(upstream.status, headers)
      res.end(buffer)
      return
    } catch (error) {
      clearTimeout(timer)
      tried.push(`${base}:${error instanceof Error ? error.message : String(error)}`)
    }
  }

  sendJson(res, 502, {
    error: 'All radio-browser providers failed',
    tried
  })
}

async function handleStreamProxy(req, res, reqUrl) {
  const payload = verifyToken(getTokenFromRequest(req))
  if (!payload || !userExists(payload.username)) {
    sendJson(res, 401, { error: 'Unauthorized' })
    return
  }

  const target = reqUrl.searchParams.get('url')
  if (!target || !isAllowedUrl(target)) {
    sendJson(res, 400, { error: 'Invalid or disallowed stream URL' })
    return
  }

  try {
    await proxyRequest(target, req, res)
  } catch (error) {
    sendJson(res, 502, {
      error: 'Stream proxy failed',
      detail: error instanceof Error ? error.message : String(error)
    })
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders())
    res.end()
    return
  }

  const reqUrl = new URL(req.url || '/', 'http://stream-proxy.local')
  const pathname = reqUrl.pathname

  if (pathname.startsWith(AUTH_PREFIX)) {
    await handleAuth(req, res, pathname)
    return
  }

  if (pathname.startsWith(USER_PREFIX)) {
    await handleUserData(req, res, pathname)
    return
  }

  if (pathname.startsWith(RADIO_PREFIX)) {
    await handleRadioProxy(req, res, reqUrl)
    return
  }

  if (pathname.startsWith(PROXY_PREFIX)) {
    await handleStreamProxy(req, res, reqUrl)
    return
  }

  sendJson(res, 404, { error: 'Not found' })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Global Radio backend listening on 127.0.0.1:${PORT}`)
})
