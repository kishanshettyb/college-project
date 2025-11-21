// marks.ts
import { createMarks, updateMarks, createOrUpdateBulkMarks } from "@/services/api/marks/marksApi";
import { Marks } from "@/types/marksTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export type ErrorResponse = {
	message: string;
};

export function useCreateMarks() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Marks) => createMarks(data),
		onMutate: () => {
			console.log("mutate!!!");
		},
		onError: () => {
			console.log("error!!!");
		},
		onSuccess: () => {
			console.log("success!!!");
			toast.success("Marks has been created.");
			queryClient.invalidateQueries({ queryKey: ["marks"] });
		},
		onSettled: async (_, error) => {
			console.log("settled");
			if (error) {
				console.log("Show Error: " + error);
				const axiosError = error as AxiosError<ErrorResponse>;
				const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error?.name || "An error occurred";
				toast.error("unable to create." + errorMessage);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["marks"] });
			}
		}
	});
}

// Update the bulk marks mutation to handle create/update
export function useCreateOrUpdateBulkMarks() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ marks, studentId, semester }: { marks: Marks[]; studentId: string; semester: string }) => createOrUpdateBulkMarks(marks, studentId, semester),
		onMutate: () => {
			console.log("create/update bulk mutate!!!");
		},
		onError: (error) => {
			console.log("bulk error!!!", error);
			toast.error("Failed to save marks");
		},
		onSuccess: (data) => {
			console.log("bulk success!!!", data);

			// Count created vs updated
			const createdCount = data.filter((item) => item.action === "created").length;
			const updatedCount = data.filter((item) => item.action === "updated").length;

			let message = "";
			if (createdCount > 0 && updatedCount > 0) {
				message = `${createdCount} marks created, ${updatedCount} marks updated successfully.`;
			} else if (createdCount > 0) {
				message = `${createdCount} marks created successfully.`;
			} else if (updatedCount > 0) {
				message = `${updatedCount} marks updated successfully.`;
			} else {
				message = "No changes made.";
			}

			toast.success(message);
			queryClient.invalidateQueries({ queryKey: ["marks"] });
		},
		onSettled: async (data, error) => {
			console.log("bulk settled");
			if (error) {
				const axiosError = error as AxiosError<ErrorResponse>;
				const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error?.name || "An error occurred";
				toast.error("Unable to save marks: " + errorMessage);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["marks"] });
			}
		}
	});
}

export function useUpdateMarks() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ data, documentId }: { data: Marks; documentId: string }) => updateMarks(data, documentId),
		onMutate: () => {
			console.log("mutate!!!");
		},
		onError: () => {
			console.log("error!!!");
		},
		onSuccess: () => {
			console.log("success!!!");
			toast.success("successfull updated marks.");
			queryClient.invalidateQueries({ queryKey: ["marks"] });
		},
		onSettled: async (_, error) => {
			console.log("settled");
			if (error) {
				console.log("Show Error: " + error);
				const axiosError = error as AxiosError<ErrorResponse>;
				const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error?.name || "An error occurred";
				toast.error("unable to update categories." + errorMessage);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["marks"] });
			}
		}
	});
}
