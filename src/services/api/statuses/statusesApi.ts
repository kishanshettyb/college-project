import { Category } from '@/types/categoryTypes'
import axios from 'axios'

const token = process.env.NEXT_PUBLIC_TOKEN
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
})
export const getAllStatuses = async () => {
  return await axiosInstance.get<Category[]>(`statuses?populate=*`)
}

export const getStatusesById = async (documentId: string) => {
  return await axiosInstance.get(`statuses/${documentId}?populate=*`)
}

export const createStatuses = async (data: Category) => {
  const response = await axiosInstance.post('statuses', data)
  return response.data
}

export const updateStatuses = async (data: Category, documentId: string) => {
  return await axiosInstance.put(`statuses/${documentId}`, {
    data
  })
}
