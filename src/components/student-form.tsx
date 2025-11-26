"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useGetAllBranches } from "@/services/queries/branch/branch";
import { useCreateStudent, useUpdateStudent } from "@/services/mutation/student/student";

interface StudentFormProps extends React.ComponentProps<"div"> {
	className?: string;
	usn?: string;
	docId?: string;
}

export function StudentForm({ className, usn, docId, ...props }: StudentFormProps) {
	const [formData, setFormData] = useState({
		usn: "",
		name: "",
		dob: "",
		category: "",
		gender: "",
		branch: ""
	});

	useEffect(() => {
		// Autofill USN when editing
		if (usn) {
			setFormData((prev) => ({
				...prev,
				usn: usn.replace(/"/g, "")
			}));
		}
	}, [usn]);

	const studentMutation = useCreateStudent();
	const updateStudentMutation = useUpdateStudent();
	const { data, isLoading, isError } = useGetAllBranches();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const cleanUSN = formData.usn.replace(/"/g, "");

		const payload = {
			data: {
				usn: cleanUSN,
				name: formData.name,
				gender: formData.gender,
				dob: formData.dob,
				category: formData.category,
				branch: formData.branch
			}
		};

		console.log("payload => " + JSON.stringify(payload));

		if (docId) {
			updateStudentMutation.mutate({ data: payload.data, documentId: docId });
		} else {
			studentMutation.mutate(payload);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const upperCaseFields = ["usn", "category"]; // add your fields here

		setFormData((prev) => ({
			...prev,
			[name]: upperCaseFields.includes(name) ? value.toUpperCase() : value
		}));
	};

	return (
		<Card className="w-full">
			<CardContent>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col gap-3">
						{/* USN */}
						<div className="grid gap-2">
							<Label htmlFor="usn">USN</Label>
							<Input id="usn" name="usn" type="text" value={formData.usn} onChange={handleInputChange} required />
						</div>

						{/* Name */}
						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required />
						</div>

						{/* Age */}
						<div className="grid gap-2">
							<Label htmlFor="dob">
								DOB : <span className="text-xs opacity-50">DD/MM/YYYY</span>
							</Label>
							<Input id="dob" name="dob" type="text" value={formData.dob} onChange={handleInputChange} required />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="category">Category</Label>
							<Input id="category" name="category" type="text" value={formData.category} onChange={handleInputChange} required />
						</div>

						{/* Gender */}
						<div className="grid gap-2">
							<Label>Gender</Label>
							<Select onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}>
								<SelectTrigger className="w-full">
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

						{/* Branch */}
						<div className="grid gap-2">
							<Label>Branch</Label>

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
											data.data.data.map((branch: any) => (
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

						{/* Submit */}
						<div className="flex my-2 flex-col gap-2">
							<Button type="submit" disabled={studentMutation.isPending || updateStudentMutation.isPending}>
								{docId ? "Edit Details" : "Add Details"}
							</Button>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
