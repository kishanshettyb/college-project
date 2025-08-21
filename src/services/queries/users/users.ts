import { getAllUsers, getUsersById } from '@/services/api/users/usersApi'
import { useQuery } from '@tanstack/react-query'

export function useGetAllUsers() {
  return useQuery({
    queryKey: ['statuses'],
    queryFn: () => getAllUsers(),
    refetchOnMount: false
  })
}

export function useGetUsersById(documentId: string) {
  return useQuery({
    queryKey: ['statuses', documentId],
    queryFn: () => getUsersById(documentId)
  })
}
