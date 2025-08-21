import { Category } from '@/types/categoryTypes'
import axios from 'axios'

const token = process.env.NEXT_PUBLIC_TOKEN
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const getAllCategories = async () => {
  return await axiosInstance.get<Category[]>(
    `categories/?sort[0]=trending:desc&sort[1]=favorite:desc`
  )
}

export const getCategoriesById = async (documentId: string) => {
  return await axiosInstance.get(`categories/${documentId}`)
}

export const createCategories = async (data: Category) => {
  const response = await axiosInstance.post('categories', data)
  return response.data
}

export const updateCategories = async (data: Category, documentId: string) => {
  return await axiosInstance.put(`categories/${documentId}`, {
    data
  })
}
