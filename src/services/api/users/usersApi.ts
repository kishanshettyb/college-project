import { Users } from '@/types/usersTypes'
import axios from 'axios'

const token = process.env.NEXT_PUBLIC_TOKEN
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
})
export const getAllUsers = async () => {
  return await axiosInstance.get<Users[]>(`users?populate=*`)
}

export const getUsersById = async (documentId: string) => {
  return await axiosInstance.get(`users/${documentId}?populate=*`)
}
