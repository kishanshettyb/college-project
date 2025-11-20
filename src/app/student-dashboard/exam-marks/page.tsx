"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import { useGetStudentsSemwiseById } from "@/services/queries/student/student";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllSubjects } from "@/services/queries/subjects/branch";
import { Button } from "@/components/ui/button";

function Page() {
	const documentId = Cookies.get("username");
	const clean = decodeURIComponent(documentId).replace(/"/g, "");

	// Fetch Student
	const { data: studentData } = useGetStudentsSemwiseById(clean);
	const student = studentData?.data?.data?.[0];

	// Branch ID (Your response has branch.id, not documentId)
	const branchId = student?.branch?.id;

	// Fetch All Subjects
	const { data: subjectsData } = useGetAllSubjects();
	console.log("Subjects Data ===>", subjectsData);

	const [selectedSem, setSelectedSem] = useState(null);
	const [subjects, setSubjects] = useState([]);
	const [marks, setMarks] = useState({});

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

		// Filtering based on your actual API fields
		const filtered = subjectsData?.data?.data?.filter((s) => s.semister === `sem${Number(sem)}` && s.branch?.id === branchId);

		console.log("Filtered Subjects:", filtered);

		setSubjects(filtered || []);
	};

	return (
		<div>
			<h2 className="text-2xl font-semibold mb-5">Exam marks entry</h2>

			<div className="bg-white border rounded-xl p-4">
				<h2 className="font-semibold text-lg mb-5">Student Basic details:</h2>

				<div className="border opacity-80 rounded-lg bg-slate-50">
					<div className="border-b p-2">
						<b>Name:</b> {student?.name}
					</div>
					<div className="border-b p-2">
						<b>USN:</b> {student?.usn}
					</div>
					<div className="p-2">
						<b>Branch:</b> {student?.branch?.branch_name}
					</div>
				</div>
				<div className="border rounded-2xl my-10">
					<div className="flex justify-start gap-x-4 bg-slate-50 px-4 py-2 rounded-xl items-center">
						<div>
							<h2 className="font-semibold text-lg my-5">Select Semester:</h2>
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
					{/* Subject Entry */}
					{subjects?.map((sub) => (
						<div key={sub.id} className="flex  p-4  gap-4 border-x-0 border-b-slate-200 border items-center my-2">
							<p className="w-32">{sub.sub_code}</p>

							<input placeholder="Internal" className="border p-2" onChange={(e) => handleInput(sub.id, "internal", e.target.value)} />

							<input placeholder="External" className="border p-2" onChange={(e) => handleInput(sub.id, "external", e.target.value)} />
						</div>
					))}
					<div className="flex w-1/2 justify-start p-2">
						<Button className="w-[200px]">Submit</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Page;
