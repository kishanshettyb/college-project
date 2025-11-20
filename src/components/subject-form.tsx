// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useEffect, useState } from "react";
// import { Button } from "./ui/button";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useGetAllBranches } from "@/services/queries/branch/branch";
// import { useCreateSubject, useUpdateSubject } from "@/services/mutation/subject/subject";
// import { useGetSubjectById } from "@/services/queries/subjects/branch";

// type SubjectFormProps = React.ComponentProps<"div"> & {
// 	documentId?: string;
// };

// export function SubjectForm({ className, documentId, ...props }: SubjectFormProps) {
// 	const [formData, setFormData] = useState({
// 		sub_code: "",
// 		branch: "",
// 		semister: ""
// 	});

// 	const { data: branches } = useGetAllBranches();

// 	const { data: subjectData } = useGetSubjectById(documentId || "");

// 	const createMutation = useCreateSubject();
// 	const updateMutation = useUpdateSubject();

// 	useEffect(() => {
// 		if (documentId && subjectData?.data) {
// 			console.log(subjectData?.data);
// 			const sub = subjectData.data; // <-- FIXED ACCESS

// 			setFormData({
// 				sub_code: sub.sub_code ?? "",
// 				branch: sub.branch?.documentId ?? "",
// 				semister: sub.semister ?? ""
// 			});
// 		}
// 	}, [documentId, subjectData]);

// 	const handleSubmit = (e: React.FormEvent) => {
// 		e.preventDefault();

// 		const payload = {
// 			data: {
// 				sub_code: formData.sub_code,
// 				branch: formData.branch,
// 				semister: formData.semister
// 			}
// 		};

// 		if (documentId) {
// 			// 🔥 UPDATE (CORRECT FORMAT)
// 			updateMutation.mutate({ documentId, data: payload });
// 		} else {
// 			createMutation.mutate(payload);
// 		}
// 	};

// 	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const { name, value } = e.target;
// 		setFormData((prev) => ({ ...prev, [name]: value }));
// 	};

// 	return (
// 		<Card className="w-full">
// 			<CardContent>
// 				<form onSubmit={handleSubmit}>
// 					<div className="flex flex-col gap-3">
// 						{/* Subject Code */}
// 						<div className="grid gap-2">
// 							<Label htmlFor="sub_code">Subject Code</Label>
// 							<Input id="sub_code" name="sub_code" type="text" value={formData.sub_code} onChange={handleInputChange} required />
// 						</div>

// 						{/* Semester */}
// 						<div className="grid gap-2">
// 							<Label>Semester</Label>
// 							<Select value={formData.semister} onValueChange={(value) => setFormData((prev) => ({ ...prev, semister: value }))}>
// 								<SelectTrigger>
// 									<SelectValue placeholder="Select Semester" />
// 								</SelectTrigger>
// 								<SelectContent>
// 									{["sem1", "sem2", "sem3", "sem4", "sem5", "sem6", "sem7", "sem8"].map((s) => (
// 										<SelectItem key={s} value={s}>
// 											{s.toUpperCase()}
// 										</SelectItem>
// 									))}
// 								</SelectContent>
// 							</Select>
// 						</div>

// 						{/* Branch */}
// 						<div className="grid gap-2">
// 							<Label>Branch</Label>
// 							<Select value={formData.branch} onValueChange={(value) => setFormData((prev) => ({ ...prev, branch: value }))}>
// 								<SelectTrigger>
// 									<SelectValue placeholder="Select Branch" />
// 								</SelectTrigger>
// 								<SelectContent>
// 									<SelectGroup>
// 										{branches?.data?.data?.map((branch: any) => (
// 											<SelectItem key={branch.id} value={branch.documentId}>
// 												{branch.branch_name}
// 											</SelectItem>
// 										))}
// 									</SelectGroup>
// 								</SelectContent>
// 							</Select>
// 						</div>

// 						{/* Submit Button */}
// 						<div className="flex my-2 flex-col gap-2">
// 							<Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
// 								{documentId ? "Update Subject" : "Create Subject"}
// 							</Button>
// 						</div>
// 					</div>
// 				</form>
// 			</CardContent>
// 		</Card>
// 	);
// }
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllBranches } from "@/services/queries/branch/branch";
import { useCreateSubject, useUpdateSubject } from "@/services/mutation/subject/subject";
import { useGetSubjectById } from "@/services/queries/subjects/branch";

type SubjectFormProps = React.ComponentProps<"div"> & {
	documentId?: string;
};

export function SubjectForm({ className, documentId, ...props }: SubjectFormProps) {
	const [formData, setFormData] = useState({
		sub_code: "",
		branch: "",
		semister: ""
	});

	const [isLoading, setIsLoading] = useState(true);

	const { data: branches } = useGetAllBranches();
	const { data: subjectData, isLoading: subjectLoading } = useGetSubjectById(documentId || "");
	const createMutation = useCreateSubject();
	const updateMutation = useUpdateSubject();

	useEffect(() => {
		if (documentId) {
			if (subjectData?.data) {
				const subject = subjectData.data;
				console.log("Editing subject:", subject);

				setFormData({
					sub_code: subject.sub_code || "",
					branch: subject.branch?.documentId || "", // Access nested branch documentId
					semister: subject.semister || ""
				});
			}
			// Set loading to false regardless of whether data exists
			setIsLoading(false);
		} else {
			// For create mode, no need to load data
			setIsLoading(false);
		}
	}, [documentId, subjectData]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const payload = {
			data: {
				sub_code: formData.sub_code,
				branch: formData.branch,
				semister: formData.semister
			}
		};

		if (documentId) {
			updateMutation.mutate({ documentId, data: payload });
		} else {
			createMutation.mutate(payload);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Show loading state while fetching data for edit mode
	if (documentId && isLoading) {
		return (
			<Card className="w-full">
				<CardContent className="flex justify-center items-center py-8">
					<div>Loading subject data...</div>
				</CardContent>
			</Card>
		);
	}
	// Add this inside your component, before the return statement
	console.log("Current formData:", formData);
	console.log("Subject data from API:", subjectData?.data);
	console.log("Document ID:", documentId);
	console.log("Is loading:", isLoading);

	return (
		<Card className="w-full">
			<CardContent>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col gap-3">
						{/* Subject Code */}
						<div className="grid gap-2">
							<Label htmlFor="sub_code">Subject Code</Label>
							<Input id="sub_code" name="sub_code" type="text" value={formData.sub_code} onChange={handleInputChange} required />
						</div>

						{/* Semester */}
						<div className="grid gap-2">
							<Label>Semester</Label>
							<Select value={formData.semister} onValueChange={(value) => setFormData((prev) => ({ ...prev, semister: value }))}>
								<SelectTrigger>
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
						</div>

						{/* Branch */}
						<div className="grid gap-2">
							<Label>Branch</Label>
							<Select value={formData.branch} onValueChange={(value) => setFormData((prev) => ({ ...prev, branch: value }))}>
								<SelectTrigger>
									<SelectValue placeholder="Select Branch" />
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
						</div>

						{/* Submit Button */}
						<div className="flex my-2 flex-col gap-2">
							<Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
								{documentId ? "Update Subject" : "Create Subject"}
							</Button>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
