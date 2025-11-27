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
import { useCreateResult } from "@/services/mutation/result/result";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import MarksTable from "@/components/marksTable";

function Page() {
	// Computed results
	const [computed, setComputed] = useState({
		totalMarks: 0,
		sgpa: "0.00",
		percentage: "0.00",
		result: "-",
		grade: "-"
	});

	const username = Cookies.get("username");
	const clean = decodeURIComponent(username).replace(/"/g, "");

	// Fetch Student
	const { data: studentData } = useGetStudentsSemwiseById(clean);
	const student = studentData?.data?.data?.[0];
	const studentDocumentId = student?.documentId;
	const branchId = student?.branch?.id;

	const [selectedSem, setSelectedSem] = useState<string | null>(null);
	const [subjects, setSubjects] = useState([]);
	const [marks, setMarks] = useState({});

	const sem = selectedSem ? `sem${selectedSem}` : null;

	const { data: subjectsData } = useGetAllSubjects();

	const { data: marksData } = useGetAllMarksByStudent(studentDocumentId, sem, {
		enabled: !!(studentDocumentId && sem)
	});

	const marksMutation = useCreateOrUpdateBulkMarks();
	const summaryMutation = useCreateResult();

	/** ---------------- Handle marks input ---------------- */
	const handleInput = (subId, type, value) => {
		setMarks((prev) => ({
			...prev,
			[subId]: {
				...prev[subId],
				[type]: value
			}
		}));
	};

	/** ---------------- Fetch subjects ---------------- */
	const handleSemesterChange = (value) => {
		setSelectedSem(value);

		if (!subjectsData) return;

		const filtered = subjectsData?.data?.data?.filter((s) => s.semister === `sem${Number(value)}` && s.branch?.id === branchId);

		setSubjects(filtered || []);
		setMarks({});
	};

	/** ---------------- Preload existing marks ---------------- */
	const preloadMarks = () => {
		if (!marksData?.data) return;

		const prefilled = {};
		marksData.data.forEach((record) => {
			const subjectId = record.subject.id;
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

	/** ---------------- ENUM LOGIC ---------------- */
	const getGrade = (percentage, hasFailed) => {
		const percent = Number(percentage);

		if (hasFailed) return "fail";
		if (percent >= 70) return "first class with distinction";
		if (percent >= 60) return "first class";
		if (percent >= 40) return "pass";
		return "fail";
	};

	const getResult = (percentage) => {
		return Number(percentage) < 40 ? "fail" : "pass";
	};

	/** ---------------- CALCULATE ---------------- */
	const calculateResults = () => {
		if (subjects.length === 0) return;

		let totalMarks = 0;
		let totalCredits = 0;
		let creditGradePoints = 0;
		let hasFailed = false;

		subjects.forEach((sub) => {
			const internal = Number(marks[sub.id]?.internal ?? 0);
			const external = Number(marks[sub.id]?.external ?? 0);
			const total = internal + external;

			let gradePoint = 0;

			if (total >= 90) gradePoint = 10;
			else if (total >= 80) gradePoint = 9;
			else if (total >= 70) gradePoint = 8;
			else if (total >= 60) gradePoint = 7;
			else if (total >= 50) gradePoint = 6;
			else if (total >= 45) gradePoint = 5;
			else if (total >= 40) gradePoint = 4;
			else gradePoint = 0;

			if (gradePoint === 0) hasFailed = true;

			const credit = sub.credit || 3;

			totalMarks += total;
			totalCredits += credit;
			creditGradePoints += credit * gradePoint;
		});

		const sgpa = (creditGradePoints / totalCredits).toFixed(2);
		const percentage = ((totalMarks / (subjects.length * 100)) * 100).toFixed(2);

		const grade = getGrade(percentage, hasFailed);
		const result = getResult(percentage);

		setComputed({
			totalMarks,
			sgpa,
			percentage,
			grade,
			result
		});
	};

	useEffect(() => {
		calculateResults();
	}, [marks, subjects]);

	/** ---------------- SUBMIT HANDLER ---------------- */
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
					toast.error(`Enter valid marks for ${subject?.sub_code}`);
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

		marksMutation.mutate(
			{
				marks: payload,
				studentId: studentDocumentId,
				semester: semesterValue
			},
			{
				onSuccess: () => {
					const summaryPayload = {
						data: {
							CGPA: computed.sgpa,
							SGPA: computed.sgpa,
							total: computed.totalMarks,
							percentage: computed.percentage,
							grade: computed.grade,
							result: computed.result,
							semister: `sem${selectedSem}`,
							students: studentDocumentId
						}
					};

					summaryMutation.mutate(summaryPayload);
				}
			}
		);
	};

	// Check if all marks are filled for every subject
	const isAllMarksFilled =
		subjects.length > 0 &&
		subjects.every((sub) => {
			const m = marks[sub.id];
			return m && m.internal !== undefined && m.internal !== "" && m.external !== undefined && m.external !== "" && !isNaN(Number(m.internal)) && !isNaN(Number(m.external));
		});

	return (
		<div className="mb-60">
			<h2 className="text-2xl font-semibold mb-5">Exam marks entry</h2>

			<div className="flex flex-col lg:flex-row gap-10 p-3 lg:p-6 border rounded-2xl">
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
								<b>DOB:</b> {student?.dob}
							</div>
							<div className="border-b py-2 text-sm px-4">
								<b>Category:</b> {student?.category}
							</div>
						</div>
					</div>

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
											Semester {sem}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Each Subject */}
						<div>
							{subjects?.map((sub) => (
								<div key={sub.id} className="flex flex-col lg:flex-row items-center p-4 gap-4 border-b border-b-slate-200 w-full my-2">
									<p className="w-20 text-base font-semibold">{sub.sub_code}</p>

									<div className="flex gap-2 flex-row">
										<Input type="number" placeholder="Internal" onChange={(e) => handleInput(sub.id, "internal", e.target.value)} value={marks[sub.id]?.internal ?? ""} />

										<Input type="number" placeholder="External" onChange={(e) => handleInput(sub.id, "external", e.target.value)} value={marks[sub.id]?.external ?? ""} />
									</div>
								</div>
							))}

							{/* Computed Results */}
							{subjects.length > 0 && (
								<div className="border flex flex-col   bg-slate-50 my-10">
									<h2 className="px-4 py-2 border border-x-0 border-t-0 text-sm">
										<span className="font-semibold">CGPA:</span> {computed.sgpa}
									</h2>
									<h2 className="px-4 py-2 border border-x-0 border-t-0 text-sm">
										<span className="font-semibold">SGPA:</span> {computed.sgpa}
									</h2>
									<h2 className="px-4 py-2 border border-x-0 border-t-0 text-sm">
										<span className="font-semibold text-xl">Total:</span> <span className="font-bold text-xl">{computed.totalMarks}</span>
									</h2>
									<h2 className="px-4 py-2 border border-x-0 border-t-0 text-sm">
										<span className="font-semibold">Percentage:</span>{" "}
										<span className={Number(computed.percentage) < 40 ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>{computed.percentage}%</span>
									</h2>
									<h2 className="px-4 py-2 border border-x-0 border-t-0 text-sm">
										<span className="font-semibold">Grade:</span>{" "}
										<span className={computed.grade === "fail" ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>{computed.grade}</span>
									</h2>
									<h2 className="px-4 py-2 border border-x-0 border-t-0 text-sm">
										<span className="font-semibold">Result:</span>{" "}
										<span className={computed.result === "fail" ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>{computed.result}</span>
									</h2>
								</div>
							)}

							{/* ❗ Confirmation Dialog — SAVE MARKS ❗ */}

							<div className="flex bg-slate-50 flex-col lg:flex-row rounded-b-2xl justify-end gap-4 p-4">
								{marksData?.data?.length > 0 ? (
									" "
								) : (
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
								)}
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button disabled={marksMutation.isPending || !selectedSem || subjects.length === 0 || !isAllMarksFilled} className="w-full lg:w-[200px]">
											<CheckCheck />
											{marksMutation.isPending ? "Saving..." : "Save Marks"}
										</Button>
									</AlertDialogTrigger>

									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you sure?</AlertDialogTitle>
											<AlertDialogDescription>
												Once submitted, marks <b>cannot be edited</b>. This action is permanent.
											</AlertDialogDescription>
										</AlertDialogHeader>

										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction onClick={handleSubmit} className="bg-red-600 text-white hover:bg-red-700">
												Submit Marks
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
					</div>
				</div>

				{/* {marksData?.data?.length > 0 ? (
					<div className="w-full lg:w-1/2 bg-slate-50 p-4 border rounded-2xl">
						<MarksTable data={marksData?.data} />
					</div>
				) : (
					""
				)} */}
				{/* Marks Section */}
			</div>
		</div>
	);
}

export default Page;
