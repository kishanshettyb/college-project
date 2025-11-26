import { createStudent, updateStudent } from "@/services/api/student/student";
import { Student } from "@/types/studentTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export type ErrorResponse = {
	message: string;
};

export function useCreateStudent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Student) => createStudent(data),
		onMutate: () => {
			console.log("mutate!!!");
		},
		onError: () => {
			console.log("error!!!");
		},
		onSuccess: () => {
			console.log("success!!!");
			toast.success("Student has been created.");
			queryClient.invalidateQueries({ queryKey: ["students"] });
		},

		onSettled: async (_, error) => {
			console.log("settled");
			if (error) {
				console.log("Show Error: " + error);
				const axiosError = error as AxiosError<ErrorResponse>;
				const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error?.name || "An error occurred";
				toast.error("unable to create." + errorMessage);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["students"] });
			}
		}
	});
}

export function useUpdateStudent() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ data, documentId }: { data: Student; documentId: string }) => updateStudent(data, documentId),
		onMutate: () => {
			console.log("mutate!!!");
		},

		onError: () => {
			console.log("error!!!");
		},

		onSuccess: () => {
			console.log("success!!!");
			toast.success("successfull updated student.");
			queryClient.invalidateQueries({ queryKey: ["students"] });
		},

		onSettled: async (_, error) => {
			console.log("settled");
			if (error) {
				console.log("Show Error: " + error);
				const axiosError = error as AxiosError<ErrorResponse>;
				const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error?.name || "An error occurred";
				toast.error("unable to update student." + errorMessage);
			} else {
				await queryClient.invalidateQueries({ queryKey: ["students"] });
			}
		}
	});
}
