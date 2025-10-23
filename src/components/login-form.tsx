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
		identifier: "",
		password: ""
	});
	const loginMutation = useAdminLogin();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		loginMutation.mutate({
			identifier: formData.identifier,
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
				src="/images/new.jpg"
				width="1024"
				height="1024"
				className="w-[100px] flex justify-center items-center mx-auto border border-slate-100 h-[100px] object-cover rounded-full"
				alt=""
			/>
			<h2 className="text-center text-3xl font-semibold">GEC-Chamarajanagara</h2>
			<Card>
				<CardContent>
					<div className="border border-x-0 border-t-0 pb-3">
						<h2 className="text-center text-xl  font-semibold">Login</h2>
					</div>

					<form onSubmit={handleSubmit} className="mt-5">
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<Label htmlFor="email">Email or Username</Label>
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
