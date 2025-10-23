import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { deleteGoogleSheet } from "../api/googlesheeet/googlesheet";

export function useDeleteData() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ documentId }: { documentId: string }) => deleteGoogleSheet(documentId),
		onMutate: () => {
			console.log("mutate!!!");
		},

		onError: () => {
			console.log("error!!!");
		},

		onSuccess: () => {
			console.log("success!!!");
			toast.success("successfull deleted data.");
			queryClient.invalidateQueries({ queryKey: ["googlesheet"] });
		},

		onSettled: async (_, error) => {
			console.log("settled");
			if (error) {
				console.log("Show Error: " + error);
				const axiosError = error as AxiosError<ErrorResponse>;
				const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error?.name || "An error occurred";
				toast.error("unable to delete data." + errorMessage);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["googlesheet"] });
			}
		}
	});
}
