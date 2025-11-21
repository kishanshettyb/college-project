// "use client";

// import React, { useState } from "react";
// import Cookies from "js-cookie";
// import { useGetStudentsSemwiseById } from "@/services/queries/student/student";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useGetAllSubjects } from "@/services/queries/subjects/branch";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { CheckCheck, X } from "lucide-react";
// import { useCreateMarks } from "@/services/mutation/marks/marks";

// function Page() {
// 	const username = Cookies.get("username");
// 	const clean = decodeURIComponent(username).replace(/"/g, "");

// 	// Fetch Student
// 	const { data: studentData } = useGetStudentsSemwiseById(clean);
// 	const student = studentData?.data?.data?.[0];

// 	// Branch ID (Your response has branch.id, not documentId)
// 	const branchId = student?.branch?.id;

// 	// Fetch All Subjects
// 	const { data: subjectsData } = useGetAllSubjects();
// 	console.log("Subjects Data ===>", subjectsData);
// 	console.log("Student data Data ===>", JSON.stringify(student));
// 	const studentDocumentId = student?.documentId;

// 	const [selectedSem, setSelectedSem] = useState(null);
// 	const [subjects, setSubjects] = useState([]);
// 	const [marks, setMarks] = useState({});
// 	const marksMutation = useCreateMarks();

// 	const handleInput = (subId, type, value) => {
// 		setMarks((prev) => ({
// 			...prev,
// 			[subId]: {
// 				...prev[subId],
// 				[type]: value
// 			}
// 		}));
// 	};

// 	const handleSemesterChange = (sem) => {
// 		setSelectedSem(sem);
// 		if (!subjectsData) return;
// 		// Filtering based on your actual API fields
// 		const filtered = subjectsData?.data?.data?.filter((s) => s.semister === `sem${Number(sem)}` && s.branch?.id === branchId);
// 		console.log("Filtered Subjects:", filtered);
// 		setSubjects(filtered || []);
// 	};

// 	const handleSubmit = async () => {
// 		if (!Object.keys(marks).length) return;

// 		const semesterValue = `sem${selectedSem}`;

// 		const payload = Object.entries(marks).map(([subId, values]) => {
// 			const subject = subjects.find((s) => s.id === Number(subId));

// 			return {
// 				subject: subject?.documentId?.replace(/"/g, ""), // remove quotes
// 				internal_mark: Number(values.internal),
// 				external_mark: Number(values.external),
// 				student: studentDocumentId,
// 				semister: semesterValue
// 			};
// 		});

// 		const body = { data: payload }; // 🔥 Strapi expects object with `data`

// 		console.log("Final Payload:", JSON.stringify(body, null, 2));

// 		// Example fetch
// 		marksMutation.mutate(body);
// 	};

// 	return (
// 		<div>
// 			<h2 className="text-2xl font-semibold mb-5">Exam marks entry</h2>
// 			<div className="flex flex-col gap-y-2 p-3 lg:p-6 border rounded-2xl lg:flex-col">
// 				<div className="w-full lg:w-1/2">
// 					<h2 className="font-semibold text-lg mb-3">Student Basic details:</h2>
// 					<div className="flex w-full flex-col lg:flex-row border opacity-80 rounded-lg bg-white shadow-2xl shadow-blue-100">
// 						<div className="w-full">
// 							<div className="border-b py-2 text-sm px-4">
// 								<b>Name:</b> {student?.name}
// 							</div>
// 							<div className="border-b py-2 text-sm px-4">
// 								<b>USN:</b> {student?.usn}
// 							</div>
// 							<div className="py-2 px-4 text-sm">
// 								<b>Branch:</b> {student?.branch?.branch_name}
// 							</div>
// 						</div>
// 						<div className="w-full">
// 							<div className="border-b py-2 text-sm px-4">
// 								<b>Gender:</b> {student?.gender}
// 							</div>
// 							<div className="border-b py-2 text-sm px-4">
// 								<b>Age:</b> {student?.age}
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 				<div className="w-full lg:w-1/2">
// 					<div className="border rounded-2xl shadow-2xl  shadow-blue-100 my-10">
// 						<div className="flex flex-col border border-b-slate-200 border-x-0 lg:flex-row justify-start  gap-x-4 bg-slate-50  px-4 py-2 rounded-t-2xl items-center">
// 							<div>
// 								<h2 className="font-semibold text-base my-1 lg:my-5">Select Semester:</h2>
// 							</div>
// 							<div>
// 								<Select onValueChange={handleSemesterChange}>
// 									<SelectTrigger className="w-[180px]">
// 										<SelectValue placeholder="Select Semester" />
// 									</SelectTrigger>
// 									<SelectContent>
// 										{[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
// 											<SelectItem key={sem} value={sem.toString()}>
// 												{`Semester ${sem}`}
// 											</SelectItem>
// 										))}
// 									</SelectContent>
// 								</Select>
// 							</div>
// 						</div>
// 						<div>
// 							{/* Subject Entry */}
// 							{subjects?.map((sub) => (
// 								<div
// 									key={sub.id}
// 									className="flex flex-col lg:flex-row justify-items-start justify-self-start items-center	 p-4 gap-4 border-x-0 border-b border-b-slate-200  w-full my-2"
// 								>
// 									<p className="w-20 text-base font-semibold">{sub.sub_code}</p>
// 									<div className="flex gap-2 flex-row">
// 										<Input type="number" placeholder="Internal" onChange={(e) => handleInput(sub.id, "internal", e.target.value)} className="w-full" />
// 										<Input type="number" placeholder="External" onChange={(e) => handleInput(sub.id, "external", e.target.value)} className="w-full" />
// 									</div>
// 								</div>
// 							))}
// 							<div className="flex bg-slate-50 flex-col lg:flex-row rounded-b-2xl justify-end gap-4 p-4">
// 								<Button variant="outline" className="w-full lg:w-[200px]">
// 									<X />
// 									Cancel
// 								</Button>
// 								<Button onClick={handleSubmit} className="w-full lg:w-[200px]">
// 									<CheckCheck />
// 									Submit
// 								</Button>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default Page;
// page.tsx
// page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useGetStudentsSemwiseById } from "@/services/queries/student/student";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllSubjects } from "@/services/queries/subjects/branch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCheck, X } from "lucide-react";
import { useCreateOrUpdateBulkMarks } from "@/services/mutation/marks/marks"; // Import the new hook
import { toast } from "sonner";

function Page() {
	const username = Cookies.get("username");
	const clean = decodeURIComponent(username).replace(/"/g, "");

	// Fetch Student
	const { data: studentData } = useGetStudentsSemwiseById(clean);
	const student = studentData?.data?.data?.[0];
	const studentDocumentId = student?.documentId;

	// Branch ID
	const branchId = student?.branch?.id;

	// Fetch All Subjects
	const { data: subjectsData } = useGetAllSubjects();
	console.log("Subjects Data ===>", subjectsData);

	const [selectedSem, setSelectedSem] = useState(null);
	const [subjects, setSubjects] = useState([]);
	const [marks, setMarks] = useState({});
	const marksMutation = useCreateOrUpdateBulkMarks(); // Use the new mutation

	const handleInput = (subId, type, value) => {
		setMarks((prev) => ({
			...prev,
			[subId]: {
				...prev[subId],
				[type]: value
			}
		}));
	};

	const handleSemesterChange = (sem) => {
		setSelectedSem(sem);
		if (!subjectsData) return;
		const filtered = subjectsData?.data?.data?.filter((s) => s.semister === `sem${Number(sem)}` && s.branch?.id === branchId);
		console.log("Filtered Subjects:", filtered);
		setSubjects(filtered || []);
		// Clear marks when semester changes
		setMarks({});
	};

	const handleSubmit = async () => {
		if (!Object.keys(marks).length || !selectedSem) {
			toast.error("Please select semester and enter marks");
			return;
		}

		const semesterValue = `sem${selectedSem}`;

		// Create payload array
		const payload = Object.entries(marks)
			.map(([subId, values]) => {
				const subject = subjects.find((s) => s.id === Number(subId));

				// Validate that marks are entered
				const internalMark = Number(values.internal);
				const externalMark = Number(values.external);

				if (isNaN(internalMark) || isNaN(externalMark)) {
					toast.error(`Please enter valid marks for ${subject?.sub_code}`);
					return null;
				}

				return {
					subject: subject?.documentId?.replace(/"/g, ""),
					internal_mark: internalMark,
					external_mark: externalMark,
					student: studentDocumentId,
					semister: semesterValue
				};
			})
			.filter(Boolean); // Remove null entries

		if (payload.length === 0) {
			toast.error("Please enter valid marks for at least one subject");
			return;
		}

		console.log("Final Payload:", JSON.stringify(payload, null, 2));

		// Send with studentId and semester for checking existing marks
		marksMutation.mutate({
			marks: payload,
			studentId: studentDocumentId,
			semester: semesterValue
		});
	};

	// Reset marks when subjects change
	useEffect(() => {
		setMarks({});
	}, [subjects]);

	return (
		<div>
			<h2 className="text-2xl font-semibold mb-5">Exam marks entry</h2>
			<div className="flex flex-col gap-y-2 p-3 lg:p-6 border rounded-2xl lg:flex-col">
				<div className="w-full lg:w-1/2">
					<h2 className="font-semibold text-lg mb-3">Student Basic details:</h2>
					<div className="flex w-full flex-col lg:flex-row border opacity-80 rounded-lg bg-white shadow-2xl shadow-blue-100">
						<div className="w-full">
							<div className="border-b py-2 text-sm px-4">
								<b>Name:</b> {student?.name}
							</div>
							<div className="border-b py-2 text-sm px-4">
								<b>USN:</b> {student?.usn}
							</div>
							<div className="py-2 px-4 text-sm">
								<b>Branch:</b> {student?.branch?.branch_name}
							</div>
						</div>
						<div className="w-full">
							<div className="border-b py-2 text-sm px-4">
								<b>Gender:</b> {student?.gender}
							</div>
							<div className="border-b py-2 text-sm px-4">
								<b>Age:</b> {student?.age}
							</div>
						</div>
					</div>
				</div>
				<div className="w-full lg:w-1/2">
					<div className="border rounded-2xl shadow-2xl shadow-blue-100 my-10">
						<div className="flex flex-col border border-b-slate-200 border-x-0 lg:flex-row justify-start gap-x-4 bg-slate-50 px-4 py-2 rounded-t-2xl items-center">
							<div>
								<h2 className="font-semibold text-base my-1 lg:my-5">Select Semester:</h2>
							</div>
							<div>
								<Select onValueChange={handleSemesterChange}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Select Semester" />
									</SelectTrigger>
									<SelectContent>
										{[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
											<SelectItem key={sem} value={sem.toString()}>
												{`Semester ${sem}`}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div>
							{/* Subject Entry */}
							{subjects?.map((sub) => (
								<div
									key={sub.id}
									className="flex flex-col lg:flex-row justify-items-start justify-self-start items-center p-4 gap-4 border-x-0 border-b border-b-slate-200 w-full my-2"
								>
									<p className="w-20 text-base font-semibold">{sub.sub_code}</p>
									<div className="flex gap-2 flex-row">
										<Input
											type="number"
											placeholder="Internal"
											onChange={(e) => handleInput(sub.id, "internal", e.target.value)}
											className="w-full"
											value={marks[sub.id]?.internal || ""}
										/>
										<Input
											type="number"
											placeholder="External"
											onChange={(e) => handleInput(sub.id, "external", e.target.value)}
											className="w-full"
											value={marks[sub.id]?.external || ""}
										/>
									</div>
								</div>
							))}
							<div className="flex bg-slate-50 flex-col lg:flex-row rounded-b-2xl justify-end gap-4 p-4">
								<Button
									variant="outline"
									className="w-full lg:w-[200px]"
									onClick={() => {
										setMarks({});
										setSelectedSem(null);
									}}
								>
									<X />
									Cancel
								</Button>
								<Button onClick={handleSubmit} disabled={marksMutation.isPending || !selectedSem || subjects.length === 0} className="w-full lg:w-[200px]">
									<CheckCheck />
									{marksMutation.isPending ? "Saving..." : "Save Marks"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Page;
