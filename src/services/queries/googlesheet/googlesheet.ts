import { getAllGoogleSheet } from "@/services/api/googlesheeet/googlesheet";
import { useQuery } from "@tanstack/react-query";

export function useGetAllGoogleSheet() {
	return useQuery({
		queryKey: ["googlesheet"],
		queryFn: () => getAllGoogleSheet(),
		refetchOnMount: false
	});
}

// export function useGetGoogleSheetById(documentId: string) {
// 	return useQuery({
// 		queryKey: ["statuses", documentId],
// 		queryFn: () => getGoogleSheetById(documentId)
// 	});
// }
