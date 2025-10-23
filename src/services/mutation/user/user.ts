"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { adminLogin, userRegister } from "@/services/api/user/user";
import { useAdminContext } from "@/lib/provider/adminContext";
import { toast } from "sonner";
interface LoginPayload {
	identifier: string;
	password: string;
}

interface RegisterPayload {
	username: string;
	email: string;
	password: string;
}

export const useAdminLogin = () => {
	const { login } = useAdminContext();

	return useMutation({
		mutationFn: (payload: LoginPayload) => adminLogin(payload),

		onError: (error) => {
			let apiMessage = "Something went wrong. Please try again.";
			if (error instanceof AxiosError) {
				apiMessage = error.response?.data?.message ?? error.message;
			} else if (error instanceof Error) {
				apiMessage = error.message;
			}
			toast.error("Login failed", {
				description: "Invalid Credentials",
				style: {
					backgroundColor: "#fee2e2",
					color: "#dc2626"
				}
			});
		},

		onSuccess: (data) => {
			const token = data?.jwt;
			const user = data?.user;
			console.log(JSON.stringify(data));

			if (token && user) {
				login(
					{
						id: user.id,
						firstname: user.firstname,
						lastname: user.lastname
					},
					token
				);

				toast.success("Admin Login successful!", {
					description: `Welcome back ${user.firstname}!`
				});

				window.location.replace("/dashboard");
			}
		}
	});
};

export const useCreateUser = () => {
	const { login } = useAdminContext();

	return useMutation({
		mutationFn: (payload: RegisterPayload) => userRegister(payload),

		onError: (error) => {
			let apiMessage = "Something went wrong. Please try again.";
			if (error instanceof AxiosError) {
				apiMessage = error.response?.data?.message ?? error.message;
			} else if (error instanceof Error) {
				apiMessage = error.message;
			}
			toast.error("Registration failed", {
				description: "Something went wrong",
				style: {
					backgroundColor: "#fee2e2",
					color: "#dc2626"
				}
			});
		},

		onSuccess: (data) => {
			const token = data?.jwt;
			const user = data?.user;
			console.log(JSON.stringify(data));
			console.log(JSON.stringify(data));

			if (token && user) {
				login(
					{
						id: user.id,
						firstname: user.firstname,
						lastname: user.lastname
					},
					token
				);

				toast.success("Login successful!", {
					description: `Welcome back ${user.firstname}!`
				});

				window.location.replace("/dashboard");
			}
		}
	});
};
