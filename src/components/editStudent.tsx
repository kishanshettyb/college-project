"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCheck, X } from "lucide-react";
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
import { useGetStudentsSemwiseById } from "@/services/queries/student/student";
import { useGetAllSubjects } from "@/services/queries/subjects/branch";
import { useGetAllMarksByStudent } from "@/services/queries/marks/marks";
import { useCreateOrUpdateBulkMarks } from "@/services/mutation/marks/marks";
import { useCreateResult } from "@/services/mutation/result/result";
import { toast } from "sonner";

type StudentProps = {
	studentId: string;
	semister: string;
	usn: string;
};

export function EditStudent({ studentId, semister, usn }: StudentProps) {
	// Load Student Basic Info
	const { data: studentData } = useGetStudentsSemwiseById(usn);
	const student = studentData?.data?.data?.[0];
	const studentDocumentId = student?.documentId;
	const branchId = student?.branch?.id;

	// Local States
	const [subjects, setSubjects] = useState([]);
	const [marks, setMarks] = useState({});
	const [computed, setComputed] = useState({
		totalMarks: 0,
		sgpa: "0.00",
		percentage: "0.00",
		result: "-",
		grade: "-"
	});

	// Subjects From API
	const { data: subjectsData } = useGetAllSubjects();

	// Marks From API (Only When Student & Sem Available)
	const { data: marksData } = useGetAllMarksByStudent(studentDocumentId, semister, {
		enabled: !!studentDocumentId && !!semister
	});

	const marksMutation = useCreateOrUpdateBulkMarks();
	const summaryMutation = useCreateResult();

	/** ---------------- Load Subjects for This Semester ---------------- */
	useEffect(() => {
		if (!subjectsData || !branchId) return;

		const filtered = subjectsData?.data?.data?.filter((s) => s.semister === semister && s.branch?.id === branchId);

		setSubjects(filtered || []);
		setMarks({});
	}, [subjectsData, branchId, semister]);

	/** ---------------- Preload Existing Marks ---------------- */
	useEffect(() => {
		if (!marksData?.data) return;

		const prefilled = {};
		marksData.data.forEach((record) => {
			prefilled[record.subject.id] = {
				internal: record.internal_mark,
				external: record.external_mark
			};
		});

		setMarks(prefilled);
	}, [marksData]);

	/** ---------------- Handle Input Change ---------------- */
	const handleInput = (subId, type, value) => {
		setMarks((prev) => ({
			...prev,
			[subId]: {
				...prev[subId],
				[type]: value
			}
		}));
	};

	/** ---------------- Calculate Results ---------------- */
	const getGrade = (percentage, hasFailed) => {
		const percent = Number(percentage);

		if (hasFailed) return "fail";
		if (percent >= 70) return "first class with distinction";
		if (percent >= 60) return "first class";
		if (percent >= 40) return "pass";
		return "fail";
	};

	const getResult = (percentage) => (Number(percentage) < 40 ? "fail" : "pass");

	useEffect(() => {
		if (subjects.length === 0) return;

		let totalMarks = 0;
		let totalCredits = 0;
		let creditGradePoints = 0;
		let hasFailed = false;

		subjects.forEach((sub) => {
			const internal = Number(marks[sub.id]?.internal ?? 0);
			const external = Number(marks[sub.id]?.external ?? 0);
			const total = internal + external;

			let gradePoint = total >= 90 ? 10 : total >= 80 ? 9 : total >= 70 ? 8 : total >= 60 ? 7 : total >= 50 ? 6 : total >= 45 ? 5 : total >= 40 ? 4 : 0;

			if (gradePoint === 0) hasFailed = true;

			const credit = sub.credit || 3;

			totalMarks += total;
			totalCredits += credit;
			creditGradePoints += credit * gradePoint;
		});

		const sgpa = (creditGradePoints / totalCredits).toFixed(2);
		const percentage = ((totalMarks / (subjects.length * 100)) * 100).toFixed(2);

		setComputed({
			totalMarks,
			sgpa,
			percentage,
			grade: getGrade(percentage, hasFailed),
			result: getResult(percentage)
		});
	}, [marks, subjects]);

	/** ---------------- Submit Handler ---------------- */
	const handleSubmit = () => {
		if (!Object.keys(marks).length) {
			toast.error("Please enter marks");
			return;
		}

		const payload = Object.entries(marks)
			.map(([subId, values]) => {
				const subject = subjects.find((s) => s.id === Number(subId));
				const internal = Number(values.internal);
				const external = Number(values.external);

				if (isNaN(internal) || isNaN(external)) {
					toast.error(`Enter valid marks for ${subject?.sub_code}`);
					return null;
				}

				return {
					subject: subject?.documentId,
					internal_mark: internal,
					external_mark: external,
					student: studentDocumentId,
					semister
				};
			})
			.filter(Boolean);

		marksMutation.mutate(
			{
				marks: payload,
				studentId: studentDocumentId,
				semester: semister
			},
			{
				onSuccess: () => {
					summaryMutation.mutate({
						data: {
							CGPA: computed.sgpa,
							SGPA: computed.sgpa,
							total: computed.totalMarks,
							percentage: computed.percentage,
							grade: computed.grade,
							resultstatus: computed.result,
							semister,
							student: studentDocumentId
						}
					});
				}
			}
		);
	};

	/** ---------------- Check if all marks filled ---------------- */
	const isAllMarksFilled =
		subjects.length > 0 &&
		subjects.every((s) => {
			const m = marks[s.id];
			return m && m.internal !== "" && m.external !== "";
		});

	return (
		<div>
			<h2 className="text-xl font-semibold mb-5">Edit Student Marks</h2>
			<div className="h-[500px] overflow-scroll">
				{/* Student Basic Info */}
				<div className="flex border bg-white shadow rounded-lg mb-5">
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

				{/* Marks Input */}
				{subjects.map((sub) => (
					<div key={sub.id} className="flex items-center p-4 gap-4 border-b">
						<p className="w-20 font-semibold">{sub.sub_code}</p>

						<div className="flex gap-2">
							<Input type="number" placeholder="Internal" value={marks[sub.id]?.internal ?? ""} onChange={(e) => handleInput(sub.id, "internal", e.target.value)} />
							<Input type="number" placeholder="External" value={marks[sub.id]?.external ?? ""} onChange={(e) => handleInput(sub.id, "external", e.target.value)} />
						</div>
					</div>
				))}

				{/* Calculated Results */}
				{subjects.length > 0 && (
					<div className="border bg-slate-50 p-4 mt-5">
						<div>
							<b>SGPA:</b> {computed.sgpa}
						</div>
						<div>
							<b>CGPA:</b> {computed.sgpa}
						</div>
						<div>
							<b>Total:</b> {computed.totalMarks}
						</div>
						<div>
							<b>Percentage:</b> {computed.percentage}%
						</div>
						<div>
							<b>Grade:</b> {computed.grade}
						</div>
						<div>
							<b>Result:</b> {computed.result}
						</div>
					</div>
				)}
			</div>
			{/* Submit */}
			<div className="flex justify-end mt-5">
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button disabled={!isAllMarksFilled} className="w-[200px]">
							<CheckCheck /> Save Marks
						</Button>
					</AlertDialogTrigger>

					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Confirm Save?</AlertDialogTitle>
							<AlertDialogDescription>
								Once saved, marks <b>cannot be edited</b>.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleSubmit} className="bg-red-600 text-white">
								Submit Marks
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
