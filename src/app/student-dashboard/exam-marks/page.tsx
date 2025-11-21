"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useGetStudentsSemwiseById } from "@/services/queries/student/student";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllSubjects } from "@/services/queries/subjects/branch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCheck, X } from "lucide-react";
import { useCreateOrUpdateBulkMarks } from "@/services/mutation/marks/marks";
import { useGetAllMarksByStudent } from "@/services/queries/marks/marks";
import { toast } from "sonner";

function Page() {
	const username = Cookies.get("username");
	const clean = decodeURIComponent(username).replace(/"/g, "");

	// Fetch Student
	const { data: studentData } = useGetStudentsSemwiseById(clean);
	const student = studentData?.data?.data?.[0];
	const studentDocumentId = student?.documentId;
	const branchId = student?.branch?.id;

	// UI States
	const [selectedSem, setSelectedSem] = useState<string | null>(null);
	const [subjects, setSubjects] = useState([]);
	const [marks, setMarks] = useState({});

	// Dynamic semester like "sem1"
	const sem = selectedSem ? `sem${selectedSem}` : null;

	// Fetch Subjects
	const { data: subjectsData } = useGetAllSubjects();

	// Fetch marks based on selected sem
	const { data: marksData } = useGetAllMarksByStudent(studentDocumentId, sem, {
		enabled: !!(studentDocumentId && sem)
	});

	const marksMutation = useCreateOrUpdateBulkMarks();

	/** Handle Input Changes */
	const handleInput = (subId, type, value) => {
		setMarks((prev) => ({
			...prev,
			[subId]: {
				...prev[subId],
				[type]: value
			}
		}));
	};

	/** Handle Semester Change */
	const handleSemesterChange = (value) => {
		setSelectedSem(value);

		if (!subjectsData) return;

		const filtered = subjectsData?.data?.data?.filter((s) => s.semister === `sem${Number(value)}` && s.branch?.id === branchId);

		setSubjects(filtered || []);
		setMarks({});
	};

	/** PRE-FILL MARKS FROM DB */
	const preloadMarks = () => {
		if (!marksData?.data) return;

		const prefilled = {};

		marksData.data.forEach((record) => {
			const subjectId = record.subject.id; // numeric subject id
			prefilled[subjectId] = {
				internal: record.internal_mark,
				external: record.external_mark
			};
		});

		setMarks(prefilled);
	};

	useEffect(() => {
		preloadMarks();
	}, [marksData]);

	/** Submit Handler */
	const handleSubmit = async () => {
		if (!Object.keys(marks).length || !selectedSem) {
			toast.error("Please select semester and enter marks");
			return;
		}

		const semesterValue = `sem${selectedSem}`;

		const payload = Object.entries(marks)
			.map(([subId, values]) => {
				const subject = subjects.find((s) => s.id === Number(subId));
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
			.filter(Boolean);

		console.log("Final Payload:", JSON.stringify(payload, null, 2));

		marksMutation.mutate({
			marks: payload,
			studentId: studentDocumentId,
			semester: semesterValue
		});
	};

	return (
		<div>
			<h2 className="text-2xl font-semibold mb-5">Exam marks entry</h2>
			<div className="flex flex-col gap-y-2 p-3 lg:p-6 border rounded-2xl">
				{/* Student Details */}
				<div className="w-full lg:w-1/2">
					<h2 className="font-semibold text-lg mb-3">Student Basic details:</h2>
					<div className="flex w-full flex-col lg:flex-row border bg-white shadow-2xl shadow-blue-100 rounded-lg">
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

				{/* Marks Section */}
				<div className="w-full lg:w-1/2">
					<div className="border rounded-2xl shadow-2xl my-10 shadow-blue-100">
						{/* Select Semester */}
						<div className="flex border bg-slate-50 px-4 py-2 rounded-t-2xl gap-x-4 items-center">
							<h2 className="font-semibold text-base my-1">Select Semester:</h2>

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

						{/* Each Subject Input */}
						<div>
							{subjects?.map((sub) => (
								<div key={sub.id} className="flex flex-col lg:flex-row items-center p-4 gap-4 border-b border-b-slate-200 w-full my-2">
									<p className="w-20 text-base font-semibold">{sub.sub_code}</p>

									<div className="flex gap-2 flex-row">
										<Input
											type="number"
											placeholder="Internal"
											onChange={(e) => handleInput(sub.id, "internal", e.target.value)}
											className="w-full"
											value={marks[sub.id]?.internal ?? ""}
										/>

										<Input
											type="number"
											placeholder="External"
											onChange={(e) => handleInput(sub.id, "external", e.target.value)}
											className="w-full"
											value={marks[sub.id]?.external ?? ""}
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
									<X /> Cancel
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
