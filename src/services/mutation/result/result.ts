import { createResult, updateResult } from "@/services/api/result/result";
import { Result } from "@/types/resultsType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export type ErrorResponse = {
	message: string;
};

export function useCreateResult() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Result) => createResult(data),
		onMutate: () => {
			console.log("mutate!!!");
		},
		onError: () => {
			console.log("error!!!");
		},
		onSuccess: () => {
			console.log("success!!!");
			toast.success("Result has been created.");
			queryClient.invalidateQueries({ queryKey: ["results"] });
		},
		onSettled: async (_, error) => {
			console.log("settled");
			if (error) {
				console.log("Show Error: " + error);
				const axiosError = error as AxiosError<ErrorResponse>;
				const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error?.name || "An error occurred";
				toast.error("unable to create." + errorMessage);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["results"] });
			}
		}
	});
}

export function useUpdateResult() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ data, documentId }: { data: Result; documentId: string }) => updateResult(data, documentId),
		onMutate: () => {
			console.log("mutate!!!");
		},
		onError: () => {
			console.log("error!!!");
		},
		onSuccess: () => {
			console.log("success!!!");
			toast.success("successfull updated result.");
			queryClient.invalidateQueries({ queryKey: ["results"] });
		},
		onSettled: async (_, error) => {
			console.log("settled");
			if (error) {
				console.log("Show Error: " + error);
				const axiosError = error as AxiosError<ErrorResponse>;
				const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error?.name || "An error occurred";
				toast.error("unable to update categories." + errorMessage);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["results"] });
			}
		}
	});
}
