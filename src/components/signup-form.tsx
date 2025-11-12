"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { useCreateUser } from "@/services/mutation/user/user";
import Image from "next/image";
export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		password: ""
	});
	const loginMutation = useCreateUser();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		loginMutation.mutate({
			username: formData.username,
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
		<div className="grid items-center grid-cols-1 lg:grid-cols-2">
			<div>
				<Image alt="" src="/images/college.jpg" width="1000" height="1000" className="w-full h-[20vh] lg:h-[100vh] object-cover" />
			</div>
			<div className={cn("flex p-4 mb-40 lg:mb-0 justify-center items-center flex-col gap-6", className)} {...props}>
				<div className="w-full lg:w-1/2">
					<Image
						width="1024"
						height="1024"
						className="w-[100px] flex justify-center items-center mx-auto border border-slate-100 h-[100px] object-cover rounded-full"
						alt=""
						src="/images/new-logo-gec.png"
					/>
					<h2 className="text-center text-3xl font-semibold mb-5">GEC-Chamarajanagara</h2>
					<Card className="w-full ">
						<CardContent>
							<div className="border border-x-0 border-t-0 pb-3">
								<h2 className="text-center text-xl  font-semibold">Students Registration</h2>
							</div>
							<form onSubmit={handleSubmit} className="mt-5">
								<div className="flex flex-col gap-3">
									<div className="grid gap-2">
										<Label htmlFor="username">Username</Label>
										<Input id="username" name="username" type="text" value={formData.username} onChange={handleInputChange} required />
									</div>
									<div className="grid gap-2">
										<Label htmlFor="email">Email</Label>
										<Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
									</div>
									<div className="grid gap-2">
										<div className="flex flex-row justify-between items-center">
											<Label htmlFor="password">Password</Label>
										</div>
										<Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required />
									</div>
									<div className="flex flex-col gap-2">
										<Button type="submit" disabled={loginMutation.isPending}>
											{loginMutation.isPending ? "Registering..." : "Register"}
										</Button>
									</div>
								</div>
								<div className="mt-4 text-center text-xs">
									Already have an account?{" "}
									<Link href="/" className="underline underline-offset-4">
										Login
									</Link>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
