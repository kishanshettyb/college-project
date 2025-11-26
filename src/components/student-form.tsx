"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllBranches } from "@/services/queries/branch/branch";
import { useCreateStudent } from "@/services/mutation/student/student";
interface StudentFormProps extends React.ComponentProps<"div"> {
	className?: string;
	usn?: string;
}
export function StudentForm({ className, usn, ...props }: StudentFormProps) {
	const [formData, setFormData] = useState({
		usn: "",
		name: "",
		age: "",
		gender: "",
		branch: ""
	});
	const studentMutation = useCreateStudent();
	const { data, isLoading, isError } = useGetAllBranches();
	const value = usn;
	const clean = value?.replace(/"/g, "");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const payload = {
			data: {
				usn: clean,
				name: formData.name,
				gender: formData.gender,
				age: formData.age,
				branch: formData.branch
			}
		};
		console.log("payload" + JSON.stringify(payload));
		studentMutation.mutate(payload);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "usn" ? value.toUpperCase() : value
		}));
	};

	return (
		<>
			<Card className="w-full">
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-3">
							<div className="grid gap-2">
								<Label htmlFor="usn">USN</Label>
								<Input id="usn" name="usn" type="text" value={clean} onChange={handleInputChange} required />
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
								<Select onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}>
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
							<div className="grid gap-2">
								<div className="flex flex-row justify-between items-center">
									<Label htmlFor="age">Branch</Label>
								</div>
								<Select onValueChange={(value) => setFormData((prev) => ({ ...prev, branch: value }))}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Branch" />
									</SelectTrigger>

									<SelectContent>
										<SelectGroup>
											<SelectLabel>Select Branch</SelectLabel>
											{isLoading && <p className="px-2 text-sm">Loading...</p>}
											{isError && <p className="px-2 text-sm text-red-500">Failed to load branches</p>}

											{data?.data?.data?.length > 0 ? (
												data?.data?.data.map((branch: any) => (
													<SelectItem key={branch.id} value={branch.documentId}>
														{branch.branch_name}
													</SelectItem>
												))
											) : (
												<p className="px-2 text-sm text-muted-foreground">No branches available</p>
											)}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
							<div className="flex my-2 flex-col gap-2">
								<Button type="submit" disabled={studentMutation.isPending}>
									{studentMutation.isPending ? "Please Wait..." : "Add Student"}
								</Button>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</>
	);
}
