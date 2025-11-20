import { createSubject, updateSubject } from "@/services/api/subjects/subjectsApi";
import { Category } from "@/types/categoryTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export type ErrorResponse = {
	message: string;
};

export function useCreateSubject() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Category) => createSubject(data),
		onMutate: () => {
			console.log("mutate!!!");
		},
		onError: () => {
			console.log("error!!!");
		},
		onSuccess: () => {
			console.log("success!!!");
			toast.success("Subject has been created.");
			queryClient.invalidateQueries({ queryKey: ["subjects"] });
		},

		onSettled: async (_, error) => {
			console.log("settled");
			if (error) {
				console.log("Show Error: " + error);
				const axiosError = error as AxiosError<ErrorResponse>;
				const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error?.name || "An error occurred";
				toast.error("unable to create." + errorMessage);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["subjects"] });
			}
		}
	});
}

export function useUpdateSubject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ data, documentId }: { data: Category; documentId: string }) => updateSubject(data, documentId),
		onMutate: () => {
			console.log("mutate!!!");
		},

		onError: () => {
			console.log("error!!!");
		},

		onSuccess: () => {
			console.log("success!!!");
			toast.success("successfull updated subjects.");
			queryClient.invalidateQueries({ queryKey: ["subjects"] });
		},

		onSettled: async (_, error) => {
			console.log("settled");
			if (error) {
				console.log("Show Error: " + error);
				const axiosError = error as AxiosError<ErrorResponse>;
				const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error?.name || "An error occurred";
				toast.error("unable to update subjects." + errorMessage);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["subjects"] });
			}
		}
	});
}
