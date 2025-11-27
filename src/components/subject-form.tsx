"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useGetAllBranches } from "@/services/queries/branch/branch";
import { useCreateSubject, useUpdateSubject } from "@/services/mutation/subject/subject";
import { useGetSubjectById } from "@/services/queries/subjects/branch";
import { SubjectSchema, SubjectSchemaType } from "@/app/dashboard/subjects/subject-schema";

type SubjectFormProps = {
	documentId?: string;
};

export function SubjectForm({ documentId }: SubjectFormProps) {
	const { data: branches } = useGetAllBranches();
	const { data: subjectData } = useGetSubjectById(documentId || "");

	const createMutation = useCreateSubject();
	const updateMutation = useUpdateSubject();

	// 🔥 Initialize form with ZOD + RHF
	const form = useForm<SubjectSchemaType>({
		resolver: zodResolver(SubjectSchema),
		defaultValues: {
			sub_code: "",
			branch: "",
			semister: ""
		}
	});

	// 🔥 Auto-Fill form when editing
	useEffect(() => {
		if (documentId && subjectData?.data) {
			const sub = subjectData.data;
			form.reset({
				sub_code: sub.sub_code,
				branch: sub.branch?.documentId,
				semister: sub.semister
			});
		}
	}, [documentId, subjectData?.data, form]);

	// 🔥 Submit Handler
	const onSubmit = (values: SubjectSchemaType) => {
		const payload = { data: values };

		if (documentId) {
			updateMutation.mutate({ documentId, data: payload });
		} else {
			createMutation.mutate(payload);
		}
	};

	return (
		<Card className="w-full">
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
					{/* Subject Code */}
					<div>
						<Label className="mb-2">Subject Code</Label>
						<Input {...form.register("sub_code")} placeholder="Enter subject code" />
						<p className="text-red-500 text-sm">{form.formState.errors.sub_code?.message}</p>
					</div>

					{/* Semester */}
					<div>
						<Label className="mb-2">Semester</Label>
						<Select value={form.watch("semister")} onValueChange={(value) => form.setValue("semister", value)}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select Semester" />
							</SelectTrigger>
							<SelectContent>
								{["sem1", "sem2", "sem3", "sem4", "sem5", "sem6", "sem7", "sem8"].map((s) => (
									<SelectItem key={s} value={s}>
										{s.toUpperCase()}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-red-500 text-sm">{form.formState.errors.semister?.message}</p>
					</div>

					{/* Branch */}
					<div>
						<Label className="mb-2">Branch</Label>
						<Select value={form.watch("branch")} onValueChange={(value) => form.setValue("branch", value)}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select Branch">{branches?.data?.data?.find((b) => b.documentId === form.watch("branch"))?.branch_name}</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{branches?.data?.data?.map((branch: any) => (
										<SelectItem key={branch.id} value={branch.documentId}>
											{branch.branch_name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						<p className="text-red-500 text-sm">{form.formState.errors.branch?.message}</p>
					</div>

					{/* Submit */}
					<Button type="submit">{documentId ? "Update Subject" : "Create Subject"}</Button>
				</form>
			</CardContent>
		</Card>
	);
}
