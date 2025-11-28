"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllBranches } from "@/services/queries/branch/branch";
import { useCreateSubject, useUpdateSubject } from "@/services/mutation/subject/subject";
import { useGetSubjectById } from "@/services/queries/subjects/branch";
import { z } from "zod";

// ✅ Define schema with proper error messages
const SubjectSchema = z.object({
	sub_code: z
		.string()
		.min(1, "Subject code is required")
		.max(20, "Subject code must be less than 20 characters")
		.regex(/^[A-Z0-9]+$/, "Subject code can only contain uppercase letters and numbers"),

	branch: z.string().min(1, "Please select a branch"),

	semister: z.string().min(1, "Please select a semester")
});

type SubjectSchemaType = z.infer<typeof SubjectSchema>;

type SubjectFormProps = {
	documentId?: string;
};

export function SubjectForm({ documentId }: SubjectFormProps) {
	const { data: branches } = useGetAllBranches();
	const { data: subjectData, isLoading: isSubjectLoading } = useGetSubjectById(documentId || "");

	const createMutation = useCreateSubject();
	const updateMutation = useUpdateSubject();

	const [isReady, setIsReady] = useState(false);

	// ✅ Initialize form with ZOD + RHF
	const form = useForm<SubjectSchemaType>({
		resolver: zodResolver(SubjectSchema),
		defaultValues: {
			sub_code: "",
			branch: "",
			semister: ""
		}
	});

	// ✅ SIMPLE FIX: Use a more direct approach
	useEffect(() => {
		if (documentId && subjectData?.data && !isSubjectLoading) {
			const sub = subjectData.data;

			// Direct individual setting - more reliable than reset
			form.setValue("sub_code", sub.sub_code || "");
			form.setValue("semister", sub.semister || "");
			form.setValue("branch", sub.branch?.documentId || "");

			setIsReady(true);
		}
	}, [documentId, subjectData, isSubjectLoading, form]);

	// ✅ ALTERNATIVE: Use a key to force re-render when data is ready
	const formKey = documentId && subjectData?.data ? `edit-${subjectData.data.documentId}` : "create";

	// ✅ Submit Handler
	const onSubmit = (values: SubjectSchemaType) => {
		const payload = {
			data: {
				...values,
				sub_code: values.sub_code.toUpperCase()
			}
		};

		if (documentId) {
			updateMutation.mutate({ documentId, data: payload });
		} else {
			createMutation.mutate(payload);
		}
	};

	// ✅ Handle uppercase for subject code
	const handleUppercase = (value: string) => {
		form.setValue("sub_code", value.toUpperCase());
	};

	if (documentId && isSubjectLoading) {
		return (
			<Card className="w-full">
				<CardContent className="flex justify-center items-center p-8">
					<p>Loading subject data...</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full">
			<CardContent>
				{/* ✅ Key forces re-render when data changes */}
				<form key={formKey} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
					{/* Subject Code */}
					<div>
						<Label htmlFor="sub_code" className="mb-2">
							Subject Code
						</Label>
						<Input id="sub_code" value={form.watch("sub_code")} onChange={(e) => handleUppercase(e.target.value)} placeholder="Enter subject code" />
						{form.formState.errors.sub_code && <p className="text-red-500 text-sm mt-1">{form.formState.errors.sub_code.message}</p>}
					</div>

					{/* Semester */}
					<div>
						<Label className="mb-2">Semester</Label>
						<Select value={form.watch("semister")} onValueChange={(value) => form.setValue("semister", value)}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select Semester">{form.watch("semister") ? form.watch("semister").toUpperCase() : "Select Semester"}</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{["sem1", "sem2", "sem3", "sem4", "sem5", "sem6", "sem7", "sem8"].map((s) => (
									<SelectItem key={s} value={s}>
										{s.toUpperCase()}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{form.formState.errors.semister && <p className="text-red-500 text-sm mt-1">{form.formState.errors.semister.message}</p>}
					</div>

					{/* Branch */}
					<div>
						<Label className="mb-2">Branch</Label>
						<Select value={form.watch("branch")} onValueChange={(value) => form.setValue("branch", value)}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select Branch">
									{form.watch("branch") ? branches?.data?.data?.find((b) => b.documentId === form.watch("branch"))?.branch_name : "Select Branch"}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{branches?.data?.data?.map((branch: any) => (
										<SelectItem key={branch.documentId} value={branch.documentId}>
											{branch.branch_name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						{form.formState.errors.branch && <p className="text-red-500 text-sm mt-1">{form.formState.errors.branch.message}</p>}
					</div>

					{/* Submit */}
					<Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full">
						{createMutation.isPending || updateMutation.isPending ? "Processing..." : documentId ? "Update Subject" : "Create Subject"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
