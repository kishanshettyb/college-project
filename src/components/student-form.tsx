"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGetAllBranches } from "@/services/queries/branch/branch";
import { useCreateStudent, useUpdateStudent } from "@/services/mutation/student/student";
import { useGetStudentsById } from "@/services/queries/student/student";

const studentSchema = z.object({
	usn: z.string().min(3),
	name: z.string().min(2),
	dob: z.string().min(4),
	category: z.string().min(1),
	gender: z.string(),
	branch: z.string()
});

type StudentSchema = z.infer<typeof studentSchema>;

interface StudentFormProps {
	docId?: string;
	usn?: string;
}

export function StudentForm({ docId, usn }: StudentFormProps) {
	const createMutation = useCreateStudent();
	const updateMutation = useUpdateStudent();

	const { data: branchData } = useGetAllBranches();
	const { data: studentDataRes } = useGetStudentsById(docId);

	const form = useForm<StudentSchema>({
		resolver: zodResolver(studentSchema),
		defaultValues: {
			usn: "",
			name: "",
			dob: "",
			category: "",
			gender: "",
			branch: ""
		}
	});

	/** 🔥 If "usn" is passed from parent, prefill it */
	useEffect(() => {
		if (usn) {
			form.setValue("usn", usn.replace(/"/g, "").toUpperCase());
		}
	}, [usn, form]);

	/** 🔥 Load edit data from API */
	useEffect(() => {
		if (docId && studentDataRes?.data?.data) {
			const s = studentDataRes.data.data;

			form.setValue("usn", s.usn?.replace(/"/g, ""));
			form.setValue("name", s.name);
			form.setValue("dob", s.dob);
			form.setValue("category", s.category);
			form.setValue("gender", s.gender);
			form.setValue("branch", s.branch?.documentId);
		}
	}, [studentDataRes, docId, form]);

	/** 🔠 Uppercase fields */
	const handleUppercase = (field: "usn" | "category", value: string) => {
		form.setValue(field, value.replace(/"/g, "").toUpperCase());
	};

	/** 🚀 Submit */
	const onSubmit = (values: StudentSchema) => {
		const payload = {
			data: {
				usn: values.usn.toUpperCase(),
				name: values.name,
				dob: values.dob,
				category: values.category.toUpperCase(),
				gender: values.gender,
				branch: values.branch
			}
		};

		if (docId) {
			updateMutation.mutate({ data: payload.data, documentId: docId });
		} else {
			createMutation.mutate(payload);
		}
	};

	return (
		<Card>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					{/* USN */}
					<div className="grid gap-1">
						<Label>USN</Label>
						<Input
							{...form.register("usn")}
							disabled={true} // disable editing in edit mode
							className={docId ? "pointer-events-none bg-muted text-gray-700" : ""}
							onChange={(e) => handleUppercase("usn", e.target.value)}
						/>
					</div>

					{/* Name */}
					<div className="grid gap-1">
						<Label>Name</Label>
						<Input {...form.register("name")} />
					</div>

					{/* DOB */}
					<div className="grid gap-1">
						<Label>
							DOB <span className="text-xs opacity-50">(DD/MM/YYYY)</span>
						</Label>
						<Input {...form.register("dob")} />
					</div>

					{/* Category */}
					<div className="grid gap-1">
						<Label>Category</Label>
						<Input {...form.register("category")} onChange={(e) => handleUppercase("category", e.target.value)} />
					</div>

					{/* Gender */}
					<div className="grid gap-1">
						<Label>Gender</Label>
						<Select value={form.watch("gender") || ""} onValueChange={(v) => form.setValue("gender", v)}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select gender" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="male">Male</SelectItem>
									<SelectItem value="female">Female</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					{/* Branch */}
					<div className="grid gap-1">
						<Label>Branch</Label>
						<Select value={form.watch("branch") || ""} onValueChange={(v) => form.setValue("branch", v)}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select branch" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{branchData?.data?.data?.map((b) => (
										<SelectItem key={b.id} value={b.documentId}>
											{b.branch_name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					{/* Submit */}
					<Button type="submit" className="w-full">
						{docId ? "Update Student" : "Add Student"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
