import { getAllStatuses, getStatusesById } from '@/services/api/statuses/statusesApi'
import { useQuery } from '@tanstack/react-query'

export function useGetAllStatuses() {
  return useQuery({
    queryKey: ['statuses'],
    queryFn: () => getAllStatuses(),
    refetchOnMount: false
  })
}

export function useGetStatusesById(documentId: string) {
  return useQuery({
    queryKey: ['statuses', documentId],
    queryFn: () => getStatusesById(documentId)
  })
}
