"use client";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
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

	// ------------------------------
	// TRANSFORM DATA
	// ------------------------------
	const finalData: Student[] = students.map((student: any) => {
		const stuMarks = marks.filter((m: any) => m.student.id === student.id);

		const subjectMarkMap: Record<string, string> = {};
		stuMarks.forEach((m: any) => {
			const code = m.subject.sub_code.toLowerCase();
			const total = Number(m.internal_mark || 0) + Number(m.external_mark || 0);
			subjectMarkMap[code] = total.toString();
		});

		return {
			id: student.id,
			documentId: student.documentId,
			name: student.name,
			usn: student.usn,
			sem: Number(student.result?.semister?.replace("sem", "")) || 0,
			SGPA: Number(student.result?.SGPA || 0),
			CGPA: Number(student.result?.CGPA || 0),
			percentage: Number(student.result?.percentage || 0),
			category: student.category,
			gender: student.gender,
			result: student.result?.result || "",
			grade: student.result?.grade || "",
			branch: student.branch?.branch_name || "",
			...subjectMarkMap
		};
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
