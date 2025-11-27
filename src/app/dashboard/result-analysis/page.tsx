"use client";
import ResultAdvanced from "@/components/result";

import { useGetAllStudentsFull } from "@/services/queries/student/student";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";

function page() {
	const { data, isLoading } = useGetAllStudentsFull();
	if (isLoading)
		return (
			<div className="flex justify-center items-center w-full h-full">
				<Loader2 className="animate-spin" />
			</div>
		);

	console.log("FULL API RESPONSE:", data);

	// ✅ Extract correct fields (based on your response)
	const students = data?.data?.students ?? [];
	const marks = data?.data?.marks ?? [];
	console.log("students" + JSON.stringify(students));
	console.log("marks" + JSON.stringify(marks));

	// 🛑 If missing, show error
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

	// --------------------------------------------------------
	// 🔥 Transform into your desired final structure
	// --------------------------------------------------------
	function transformStudentsData(students: any[], marks: any[]) {
		return students.map((student) => {
			const stuMarks = marks.filter((m) => m.student.id === student.id);
			const subjectMarkMap: Record<string, string> = {};

			stuMarks.forEach((m) => {
				const code = m.subject.sub_code.toLowerCase(); // ecs001 etc.
				const total = Number(m.internal_mark || 0) + Number(m.external_mark || 0);
				subjectMarkMap[code] = total.toString();
			});

			return {
				id: student.id,
				documentId: student.documentId,
				name: student.name,
				usn: student.usn,
				sem: student.result?.semister?.replace("sem", "") || "",
				SGPA: student.result?.SGPA || "",
				CGPA: student.result?.CGPA || "",
				percentage: student.result?.percentage || "",
				category: student.category,
				gender: student.gender,
				result: student.result?.result || "",
				grade: student.result?.grade || "",
				branch: student.branch?.branch_name || "",
				createdAt: student.createdAt,
				updatedAt: student.updatedAt,
				publishedAt: student.publishedAt,
				...subjectMarkMap
			};
		});
	}

	const finalData = transformStudentsData(students, marks);

	const formatted = {
		data: finalData,
		meta: {
			pagination: {
				start: 0,
				limit: finalData.length,
				total: finalData.length
			}
		}
	};
	console.log("finalData" + JSON.stringify(finalData));
	console.log("formatted" + JSON.stringify(formatted));
	// --------------------------------------------------------

	return (
		<div className="bg-slate-50 h-full mb-50">
			{/* ✔ Pass transformed data */}
			<div>
				<ResultAdvanced data={formatted} />
			</div>
		</div>
	);
}

export default page;
