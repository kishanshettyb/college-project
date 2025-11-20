"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "./ui/button";
import { useCreateUser } from "@/services/mutation/user/user";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StudentForm({ className, ...props }: React.ComponentProps<"div">) {
	const [formData, setFormData] = useState({
		username: "",
		age: "",
		gender: "",
		name: ""
	});
	const loginMutation = useCreateUser();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		loginMutation.mutate({
			username: formData.username,
			age: formData.age,
			gender: formData.gender,
			name: formData.name
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
			<div className={cn("flex p-4 mb-40 lg:mb-0 justify-center items-center flex-col gap-6", className)} {...props}>
				<Card className="w-1/2 ">
					<CardContent>
						<form onSubmit={handleSubmit} className="mt-5">
							<div className="flex flex-col gap-3">
								<div className="grid gap-2">
									<Label htmlFor="username">USN</Label>
									<Input id="username" name="username" type="text" value={formData.username} onChange={handleInputChange} required />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="name">Name</Label>
									<Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required />
								</div>
								<div className="grid gap-2">
									<div className="flex flex-row justify-between items-center">
										<Label htmlFor="age">Age</Label>
									</div>
									<Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} required />
								</div>
								<div className="grid gap-2">
									<div className="flex flex-row justify-between items-center">
										<Label htmlFor="age">Gender</Label>
									</div>
									<Select>
										<SelectTrigger className=" w-full ">
											<SelectValue placeholder="Select a gender" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Gender</SelectLabel>
												<SelectItem value="male">Male</SelectItem>
												<SelectItem value="female">Female</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
								<div className="flex flex-col gap-2">
									<Button type="submit" disabled={loginMutation.isPending}>
										{loginMutation.isPending ? "Please Wait..." : "Add Details"}
									</Button>
								</div>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
