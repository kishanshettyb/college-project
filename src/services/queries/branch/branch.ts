import { getAllBranches } from "@/services/api/branch/branchApi";
import { useQuery } from "@tanstack/react-query";

export function useGetAllBranches() {
	return useQuery({
		queryKey: ["branches"],
		queryFn: () => getAllBranches(),
		refetchOnMount: false
	});
}
