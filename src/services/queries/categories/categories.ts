import { getAllCategories, getCategoriesById } from '@/services/api/categories/categoriesApi'
import { useQuery } from '@tanstack/react-query'

export function useGetAllCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getAllCategories(),
    refetchOnMount: false
  })
}

export function useGetCategoriesById(documentId: string) {
  return useQuery({
    queryKey: ['categories', documentId],
    queryFn: () => getCategoriesById(documentId)
  })
}
