import axios from 'axios'

const authClient = axios.create({
  baseURL: '/api/auth',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export interface AuthUser {
  username: string
}

export async function login(username: string, password: string): Promise<{ user: AuthUser }> {
  const { data } = await authClient.post<{ user: AuthUser }>('/login', {
    username,
    password
  })
  return data
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await authClient.get<{ user: AuthUser }>('/me')
  return data.user
}

export async function logout(): Promise<void> {
  try {
    await authClient.post('/logout')
  } catch {
    // ignore network errors during logout
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await authClient.post('/change-password', {
    currentPassword,
    newPassword
  })
}
