import { getAllSubjects, getSubjectById } from "@/services/api/subjects/subjectsApi";
import { useQuery } from "@tanstack/react-query";

export function useGetAllSubjects() {
	return useQuery({
		queryKey: ["subjects"],
		queryFn: () => getAllSubjects(),
		refetchOnMount: false
	});
}

export function useGetSubjectById(documentId: string) {
	return useQuery({
		queryKey: ["subjects", documentId],
		queryFn: () => getSubjectById(documentId)
	});
}
