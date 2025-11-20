import { getAllStudentsSemwise, getAllStudentsSemwiseById } from "@/services/api/student/student";
import { useQuery } from "@tanstack/react-query";

export function useGetAllStudentsSemwise() {
	return useQuery({
		queryKey: ["students"],
		queryFn: () => getAllStudentsSemwise(),
		refetchOnMount: false
	});
}
export function useGetStudentsSemwiseById(documentId: string) {
	return useQuery({
		queryKey: ["students", documentId],
		queryFn: () => getAllStudentsSemwiseById(documentId)
	});
}
