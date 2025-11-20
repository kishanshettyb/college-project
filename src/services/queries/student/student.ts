import { getAllStudentsSemwise } from "@/services/api/student/student";
import { useQuery } from "@tanstack/react-query";

export function useGetAllStudentsSemwise() {
	return useQuery({
		queryKey: ["students"],
		queryFn: () => getAllStudentsSemwise(),
		refetchOnMount: false
	});
}
