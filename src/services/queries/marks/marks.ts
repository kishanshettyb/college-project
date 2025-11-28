import { getMarksByStudentAndSemester } from "@/services/api/marks/marksApi";
import { useQuery } from "@tanstack/react-query";

export function useGetAllMarksByStudent(studentId: string, semester: string) {
	return useQuery({
		queryKey: ["marks", studentId, semester],
		queryFn: () => getMarksByStudentAndSemester(studentId, semester),
		refetchOnMount: true
	});
}
