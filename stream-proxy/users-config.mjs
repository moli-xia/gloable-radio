import fs from 'node:fs'
import path from 'node:path'

const USERS_CONFIG_PATH = process.env.USERS_CONFIG_PATH || '/data/config/users.json'

function normalizeUsers(raw) {
  if (!raw || !Array.isArray(raw.users)) {
    return []
  }

  const users = []
  const seen = new Set()

  for (const item of raw.users) {
    if (!item || typeof item.username !== 'string' || typeof item.password !== 'string') {
      continue
    }

    const username = item.username.trim()
    const password = item.password

    if (!username || seen.has(username)) {
      continue
    }

    seen.add(username)
    users.push({ username, password })
  }

  return users
}

export function loadUsersConfig() {
  try {
    if (!fs.existsSync(USERS_CONFIG_PATH)) {
      console.warn(`Users config not found: ${USERS_CONFIG_PATH}`)
      return []
    }

    const parsed = JSON.parse(fs.readFileSync(USERS_CONFIG_PATH, 'utf8'))
    return normalizeUsers(parsed)
  } catch (error) {
    console.error('Failed to load users config:', error)
    return []
  }
}

export function validateUserCredentials(username, password) {
  const normalizedUsername = typeof username === 'string' ? username.trim() : ''
  if (!normalizedUsername || typeof password !== 'string') {
    return null
  }

  const users = loadUsersConfig()
  const matched = users.find((user) => user.username === normalizedUsername && user.password === password)
  return matched ? { username: matched.username } : null
}

export function userExists(username) {
  const normalizedUsername = typeof username === 'string' ? username.trim() : ''
  if (!normalizedUsername) {
    return false
  }

  return loadUsersConfig().some((user) => user.username === normalizedUsername)
}

export function getUsersConfigPath() {
  return path.resolve(USERS_CONFIG_PATH)
}

export function changeUserPassword(username, currentPassword, newPassword) {
  const normalizedUsername = typeof username === 'string' ? username.trim() : ''
  if (!normalizedUsername) {
    return { ok: false, error: 'Invalid username' }
  }

  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
    return { ok: false, error: 'Invalid password' }
  }

  if (newPassword.length < 6) {
    return { ok: false, error: 'New password must be at least 6 characters' }
  }

  if (newPassword === currentPassword) {
    return { ok: false, error: 'New password must be different from current password' }
  }

  if (!fs.existsSync(USERS_CONFIG_PATH)) {
    return { ok: false, error: 'Users config not found' }
  }

  let raw
  try {
    raw = JSON.parse(fs.readFileSync(USERS_CONFIG_PATH, 'utf8'))
  } catch {
    return { ok: false, error: 'Failed to read users config' }
  }

  const users = normalizeUsers(raw)
  const matched = users.find((user) => user.username === normalizedUsername)
  if (!matched || matched.password !== currentPassword) {
    return { ok: false, error: 'Invalid current password' }
  }

  const target = raw.users.find((user) => typeof user?.username === 'string' && user.username.trim() === normalizedUsername)
  if (!target) {
    return { ok: false, error: 'User not found' }
  }

  target.password = newPassword

  try {
    fs.writeFileSync(USERS_CONFIG_PATH, `${JSON.stringify(raw, null, 2)}\n`, 'utf8')
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to save users config'
    }
  }
}
