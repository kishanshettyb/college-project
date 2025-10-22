"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAdminLogin } from "@/services/mutation/user/user";
import Image from "next/image";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
	const [formData, setFormData] = useState({
		email: "",
		password: ""
	});
	const loginMutation = useAdminLogin();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		loginMutation.mutate({
			email: formData.email,
			password: formData.password
		});
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Image
				width="100"
				height="100"
				className="w-[100px] flex justify-center items-center mx-auto border border-slate-100 h-[100px] object-cover rounded-full"
				alt=""
				src="/adaptive-icon.png"
			/>
			<h2 className="text-center text-3xl font-semibold">GEC-CHamarajanagar</h2>
			<Card>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<Label htmlFor="email">Email</Label>
								<Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
							</div>
							<div className="grid gap-3">
								<div className="flex flex-row justify-between items-center">
									<Label htmlFor="password">Password</Label>
								</div>
								<Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required />
							</div>
							<div className="flex flex-col gap-3">
								<Button type="submit" disabled={loginMutation.isPending}>
									{loginMutation.isPending ? "Logging in..." : "Login"}
								</Button>
							</div>
						</div>
						<div className="mt-4 text-center text-xs">
							Don&apos;t have an account?{" "}
							<Link href="/register" className="underline underline-offset-4">
								Sign up
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
