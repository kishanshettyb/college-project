import { getAllSubjects } from "@/services/api/subjects/subjectsApi";
import { useQuery } from "@tanstack/react-query";

export function useGetAllSubjects() {
	return useQuery({
		queryKey: ["subjects"],
		queryFn: () => getAllSubjects(),
		refetchOnMount: false
	});
}
