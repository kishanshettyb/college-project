"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAdminLogin } from "@/services/mutation/user/user";
import { User, Users } from "lucide-react";

interface LoginFormProps extends React.ComponentProps<"div"> {
	title: string;
	signup?: boolean;
}
export function StudentLoginForm({ title, signup, className, ...props }: LoginFormProps) {
	const [formData, setFormData] = useState({
		identifier: "",
		password: ""
	});
	const loginMutation = useAdminLogin();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const isStudent = formData.identifier.startsWith("4GE");
		if (isStudent) {
			loginMutation.mutate({
				identifier: formData.identifier,
				password: formData.password
			});
		} else {
			alert("USN should start with 4GE");
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "identifier" ? value.toUpperCase() : value
		}));
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div>
				<div className="pb-2">
					<h2 className="text-center text-base font-semibold">{title}</h2>
				</div>
				<form onSubmit={handleSubmit} className="mt-0 p-4 border rounded-2xl">
					<div className="flex flex-col gap-6">
						<div className="grid gap-3">
							<Label htmlFor="email">USN</Label>
							<Input id="identifier" name="identifier" type="text" value={formData.identifier} onChange={handleInputChange} required />
						</div>
						<div className="grid gap-3">
							<div className="flex flex-row justify-between items-center">
								<Label htmlFor="password">Password</Label>
							</div>
							<Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required />
						</div>
						<div className="flex flex-col gap-3">
							<Button type="submit" disabled={loginMutation.isPending}>
								<User />
								{loginMutation.isPending ? "Logging in..." : "Login as student"}
							</Button>
						</div>
					</div>
					{signup && (
						<div className="mt-4 text-center text-xs">
							Don&apos;t have an account?{" "}
							<Link href="/register" className="underline underline-offset-4">
								Sign up
							</Link>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
