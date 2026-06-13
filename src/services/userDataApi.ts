import axios from 'axios'
import type { UserData } from '@/types/userData'

const userDataClient = axios.create({
  baseURL: '/api/user',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export async function fetchUserData(): Promise<UserData> {
  const { data } = await userDataClient.get<{ data: UserData }>('/data')
  return data.data
}

export async function saveUserData(payload: UserData): Promise<UserData> {
  const { data } = await userDataClient.put<{ data: UserData }>('/data', payload)
  return data.data
}
