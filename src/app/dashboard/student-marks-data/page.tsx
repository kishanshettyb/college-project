"use client";

import * as React from "react";
import { StudentDataTable } from "@/components/studentDataTable";
import { useGetAllStudentsFull } from "@/services/queries/student/student";
import { Student } from "./column";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Page() {
	const { data, isLoading } = useGetAllStudentsFull();
	if (isLoading)
		return (
			<div className="flex justify-center items-center w-full h-full">
				<Loader2 className="animate-spin" />
			</div>
		);

	// Extract API structure
	const students = data?.data?.students ?? [];
	const marks = data?.data?.marks ?? [];

	if (!students.length)
		return (
			<div className="flex flex-col justify-center w-full h-full items-center ">
				<Image src="/images/nodata.jpg" alt="No Data found" width={500} height={500} className="w-[400px] h-[400px] object-cover" />
				<h2 className="text-2xl font-semibold">Sorry No Data Found</h2>
			</div>
		);
	if (!marks.length)
		return (
			<div className="flex flex-col justify-center w-full h-full items-center ">
				<Image src="/images/nodata.jpg" alt="No Data found" width={500} height={500} className="w-[400px] h-[400px] object-cover" />
				<h2 className="text-2xl font-semibold">Sorry No Data Found</h2>
			</div>
		);

	// const finalData: Student[] = students.map((student: any) => {
	// 	const stuMarks = marks.filter((m: any) => m.student.id === student.id);

	// 	const subjectMarkMap: Record<string, string | number> = {};

	// 	stuMarks.forEach((m: any) => {
	// 		// const code = m.subject.sub_code.toLowerCase();
	// 		const sem = m.semister?.toLowerCase(); // sem1 / sem2
	// 		const code = `${sem}_${m.subject.sub_code.toLowerCase()}`;

	// 		const internal = Number(m.internal_mark || 0);
	// 		const external = Number(m.external_mark || 0);
	// 		const total = internal + external;

	// 		subjectMarkMap[`${code}_internal`] = internal;
	// 		subjectMarkMap[`${code}_external`] = external;
	// 		subjectMarkMap[`${code}_total`] = total;
	// 	});

	// 	return {
	// 		id: student.id,
	// 		documentId: student.documentId,
	// 		name: student.name,
	// 		usn: student.usn,
	// 		sem: Number(student.result?.semister?.replace("sem", "")) || 0,
	// 		SGPA: Number(student.result?.SGPA || 0),
	// 		CGPA: Number(student.result?.CGPA || 0),
	// 		percentage: Number(student.result?.percentage || 0),
	// 		category: student.category,
	// 		gender: student.gender,
	// 		result: student.result?.result || "",
	// 		grade: student.result?.grade || "",
	// 		branch: student.branch?.branch_name || "",
	// 		batch: student.batch || "",
	// 		...subjectMarkMap
	// 	};
	// });
	const finalData: Student[] = students.flatMap((student: any) => {
		const stuMarks = marks.filter((m: any) => m.student.id === student.id);

		// group marks by sem
		const marksBySem: Record<string, any[]> = {};
		stuMarks.forEach((m: any) => {
			const sem = String(m.semister || "").toLowerCase(); // sem1 / sem2 / sem3...
			if (!marksBySem[sem]) marksBySem[sem] = [];
			marksBySem[sem].push(m);
		});

		// create one row per sem
		return Object.entries(marksBySem).map(([sem, semMarks]) => {
			const subjectMarkMap: Record<string, number> = {};

			// Build subject fields (ECSUB01_INTERNAL etc.)
			semMarks.forEach((m: any) => {
				const code = String(m.subject.sub_code || "").toUpperCase(); // keep uppercase
				const internal = Number(m.internal_mark || 0);
				const external = Number(m.external_mark || 0);
				const total = internal + external;

				subjectMarkMap[`${code}_INTERNAL`] = internal;
				subjectMarkMap[`${code}_EXTERNAL`] = external;
				subjectMarkMap[`${code}_TOTAL`] = total;
			});

			// Try to find a matching sem result from student.results (if backend provides it)
			const semKey = sem; // 'sem1', 'sem2', ...
			const semResult = Array.isArray(student.results) ? student.results.find((r: any) => String(r.semister || "").toLowerCase() === semKey) : undefined;

			// If semResult exists use it, otherwise compute from marks
			const semTotalFromMarks = semMarks.reduce((s, m) => s + Number(m.internal_mark || 0) + Number(m.external_mark || 0), 0);
			const subjectCount = semMarks.length || 0;
			const maxMarks = subjectCount * 100; // assuming each subject total = 100
			const computedPercentage = maxMarks > 0 ? (semTotalFromMarks / maxMarks) * 100 : 0;

			let percentage: number;
			let resultstatus: string;
			let grade: string;
			let SGPA: number | string = 0;
			let CGPA: number | string = 0;
			let totalMarks: number;

			if (semResult) {
				percentage = Number(semResult.percentage || 0);
				resultstatus = String(semResult.resultstatus || semResult.result || ""); // keep existing naming
				grade = String(semResult.grade || "");
				SGPA = semResult.SGPA ?? semResult.SGPA ?? 0;
				CGPA = semResult.CGPA ?? semResult.CGPA ?? 0;
				totalMarks = Number(semResult.total || semTotalFromMarks || 0);
			} else {
				percentage = Math.round((computedPercentage + Number.EPSILON) * 100) / 100; // round to 2 decimals
				// pass/fail logic — basic: require external_mark >= 35 for all subjects (adjust as needed)
				const allExternalPass = semMarks.length ? semMarks.every((m: any) => Number(m.external_mark || 0) >= 35) : false;
				resultstatus = allExternalPass ? "pass" : "fail";

				// grade logic (adjust thresholds as your institute uses)
				if (percentage >= 70) grade = "first class with distinction";
				else if (percentage >= 60) grade = "first class";
				else if (percentage >= 50) grade = "second class";
				else if (percentage >= 35) grade = "pass";
				else grade = "fail";

				SGPA = 0;
				CGPA = 0;
				totalMarks = semTotalFromMarks;
			}

			return {
				id: `${student.id}-${sem}`, // unique row id
				documentId: student.documentId,
				name: student.name,
				usn: student.usn,
				sem: Number(sem.replace("sem", "")),
				SGPA,
				CGPA,
				percentage, // number
				category: student.category,
				gender: student.gender,
				resultstatus, // matches your column accessorKey "resultstatus"
				grade,
				branch: student.branch?.branch_name || "",
				batch: student.batch || "",
				total: totalMarks, // optional: available if you want to show it later
				...subjectMarkMap
			};
		});
	});

	return (
		<div className="mb-50">
			<div className="w-full px-2 lg:px-10">
				{/* Pass valid Student[] */}
				<StudentDataTable data={finalData} isLoading={isLoading} isError={false} />
			</div>
		</div>
	);
}
