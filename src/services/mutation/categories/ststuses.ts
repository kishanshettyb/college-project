import { createStatuses, updateStatuses } from '@/services/api/statuses/statusesApi'
import { Status } from '@/types/statusesTypes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

export type ErrorResponse = {
  message: string
}

export function useCreateStatuses() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Status) => createStatuses(data),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: () => {
      console.log('error!!!')
    },
    onSuccess: () => {
      console.log('success!!!')
      toast.success('Statuses has been created.')
      queryClient.invalidateQueries({ queryKey: ['statuses'] })
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
        await queryClient.invalidateQueries({ queryKey: ['statuses'] })
      }
    }
  })
}

export function useUpdateStatuses() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, documentId }: { data: Status; documentId: string }) =>
      updateStatuses(data, documentId),
    onMutate: () => {
      console.log('mutate!!!')
    },

    onError: () => {
      console.log('error!!!')
    },

    onSuccess: () => {
      console.log('success!!!')
      toast.success('successfull updated statuses.')
      queryClient.invalidateQueries({ queryKey: ['statuses'] })
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
        toast.error('unable to update statuses.' + errorMessage)
      } else {
        await queryClient.invalidateQueries({ queryKey: ['statuses'] })
      }
    }
  })
}
