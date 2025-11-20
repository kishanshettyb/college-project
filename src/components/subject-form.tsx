"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllBranches } from "@/services/queries/branch/branch";
import { useCreateSubject } from "@/services/mutation/subject/subject";
type SubjectFormProps = React.ComponentProps<"div"> & {
	documentId: string;
};
export function SubjectForm({ className, documentId, ...props }: SubjectFormProps) {
	console.log("Document ID →", documentId);
	const [formData, setFormData] = useState({
		sub_code: "",
		branch: "",
		semister: ""
	});
	const subjectMutation = useCreateSubject();
	const { data, isLoading, isError } = useGetAllBranches();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const payload = {
			data: {
				sub_code: formData.sub_code,
				branch: formData.branch,
				semister: formData.semister
			}
		};
		console.log("payload" + JSON.stringify(payload));
		subjectMutation.mutate(payload);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};

	return (
		<>
			<Card className="w-full">
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-3">
							<div className="grid gap-2">
								<Label htmlFor="sub_code">Subject Code</Label>
								<Input id="sub_code" name="sub_code" type="text" value={formData.sub_code} onChange={handleInputChange} required />
							</div>

							<div className="grid gap-2">
								<div className="flex flex-row justify-between items-center">
									<Label htmlFor="age">Semester</Label>
								</div>
								<Select onValueChange={(value) => setFormData((prev) => ({ ...prev, semister: value }))}>
									<SelectTrigger className=" w-full ">
										<SelectValue placeholder="Select a Semester" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Semester</SelectLabel>
											<SelectItem value="sem1">SEM1</SelectItem>
											<SelectItem value="sem2">SEM2</SelectItem>
											<SelectItem value="sem3">SEM3</SelectItem>
											<SelectItem value="sem4">SEM4</SelectItem>
											<SelectItem value="sem5">SEM5</SelectItem>
											<SelectItem value="sem6">SEM6</SelectItem>
											<SelectItem value="sem7">SEM7</SelectItem>
											<SelectItem value="sem8">SEM8</SelectItem>
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
								<Button type="submit" disabled={subjectMutation.isPending}>
									{subjectMutation.isPending ? "Please Wait..." : "Add Student"}
								</Button>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</>
	);
}
