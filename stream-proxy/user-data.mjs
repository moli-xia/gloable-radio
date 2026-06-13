import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const USER_DATA_DIR = process.env.USER_DATA_DIR || '/data/users'

function ensureDataDir() {
  fs.mkdirSync(USER_DATA_DIR, { recursive: true })
}

function getUserFilePath(username) {
  const safeName = crypto.createHash('sha256').update(username).digest('hex')
  return path.join(USER_DATA_DIR, `${safeName}.json`)
}

function defaultUserData() {
  return {
    version: 1,
    updatedAt: null,
    favorites: [],
    history: [],
    searchHistory: [],
    settings: {
      volume: 0.8,
      muted: false,
      themeMode: 'light',
      language: 'zh'
    }
  }
}

export function readUserData(username) {
  ensureDataDir()
  const filePath = getUserFilePath(username)

  if (!fs.existsSync(filePath)) {
    return defaultUserData()
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    return {
      ...defaultUserData(),
      ...parsed,
      settings: {
        ...defaultUserData().settings,
        ...(parsed.settings || {})
      }
    }
  } catch {
    return defaultUserData()
  }
}

export function writeUserData(username, data) {
  ensureDataDir()
  const filePath = getUserFilePath(username)
  const payload = {
    version: 1,
    updatedAt: new Date().toISOString(),
    favorites: Array.isArray(data.favorites) ? data.favorites : [],
    history: Array.isArray(data.history) ? data.history : [],
    searchHistory: Array.isArray(data.searchHistory) ? data.searchHistory : [],
    settings: {
      ...defaultUserData().settings,
      ...(data.settings || {})
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8')
  return payload
}
