"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import { useGetStudentsSemwiseById } from "@/services/queries/student/student";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllSubjects } from "@/services/queries/subjects/branch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCheck, X } from "lucide-react";

function Page() {
	const username = Cookies.get("username");
	const documentId = Cookies.get("documentId");
	const clean = decodeURIComponent(username).replace(/"/g, "");
	const cleanDocumentId = decodeURIComponent(documentId).replace(/"/g, "");
	console.log(cleanDocumentId);

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

	const handleSubmit = async () => {
		if (!Object.keys(marks).length) return;

		const semesterValue = `sem${selectedSem}`; // 🔥 format "sem1"

		const payload = Object.entries(marks).map(([subId, values]) => {
			const subject = subjects.find((s) => s.id === Number(subId));

			return {
				subject: subject?.documentId,
				internal_mark: Number(values.internal),
				external_mark: Number(values.external),
				student: cleanDocumentId,
				semister: semesterValue // 🔥 Add semester to each entry
			};
		});

		console.log("Payload to Strapi:", JSON.stringify(payload, null, 2));
	};

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
					<div className="border rounded-2xl shadow-2xl  shadow-blue-100 my-10">
						<div className="flex flex-col border border-b-slate-200 border-x-0 lg:flex-row justify-start  gap-x-4 bg-slate-50  px-4 py-2 rounded-t-2xl items-center">
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
								<div key={sub.id} className="flex flex-col lg:flex-row justify-self-start items-start p-4 gap-4 border-x-0 border-b border-b-slate-200  w-full my-2">
									<p className="w-32 textlg font-semibold">{sub.sub_code}</p>
									<div className="flex gap-2 flex-row">
										<Input type="number" placeholder="Internal" onChange={(e) => handleInput(sub.id, "internal", e.target.value)} className="w-full" />
										<Input type="number" placeholder="External" onChange={(e) => handleInput(sub.id, "external", e.target.value)} className="w-full" />
									</div>
								</div>
							))}
							<div className="flex bg-slate-50 flex-col lg:flex-row rounded-b-2xl justify-end gap-4 p-4">
								<Button variant="outline" className="w-full lg:w-[200px]">
									<X />
									Cancel
								</Button>
								<Button onClick={handleSubmit} className="w-full lg:w-[200px]">
									<CheckCheck />
									Submit
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
