import { createCategories, updateCategories } from '@/services/api/categories/categoriesApi'
import { Category } from '@/types/categoryTypes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

export type ErrorResponse = {
  message: string
}

export function useCreateCategories() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Category) => createCategories(data),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: () => {
      console.log('error!!!')
    },
    onSuccess: () => {
      console.log('success!!!')
      toast.success('Categories has been created.')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },

    onSettled: async (_, error) => {
      console.log('settled')
      if (error) {
        console.log('Show Error: ' + error)
        const axiosError = error as AxiosError<ErrorResponse>
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error?.name ||
          'An error occurred'
        toast.error('unable to create.' + errorMessage)
      } else {
        await queryClient.invalidateQueries({ queryKey: ['categories'] })
      }
    }
  })
}

export function useUpdateCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, documentId }: { data: Category; documentId: string }) =>
      updateCategories(data, documentId),
    onMutate: () => {
      console.log('mutate!!!')
    },

    onError: () => {
      console.log('error!!!')
    },

    onSuccess: () => {
      console.log('success!!!')
      toast.success('successfull updated categories.')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },

    onSettled: async (_, error) => {
      console.log('settled')
      if (error) {
        console.log('Show Error: ' + error)
        const axiosError = error as AxiosError<ErrorResponse>
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error?.name ||
          'An error occurred'
        toast.error('unable to update categories.' + errorMessage)
      } else {
        await queryClient.invalidateQueries({ queryKey: ['categories'] })
      }
    }
  })
}
