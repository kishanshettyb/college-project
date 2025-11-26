// "use client";
// import ResultAdvanced from "@/components/result";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { useGetAllGoogleSheet } from "@/services/queries/googlesheet/googlesheet";
// import { Separator } from "@radix-ui/react-dropdown-menu";
// import React from "react";

// function page() {
// 	const { data, isLoading, isError } = useGetAllGoogleSheet();

// 	return (
// 		<div className="bg-slate-50 h-full">
// 			<header className="flex lg:mt-0  h-16 shrink-0 items-center gap-2 border-b px-4">
// 				<SidebarTrigger className="-ml-1" />
// 				<Separator className="mr-2 data-[orientation=vertical]:h-4" />
// 				<Breadcrumb>
// 					<BreadcrumbList>
// 						<BreadcrumbItem className="hidden md:block">
// 							<BreadcrumbLink href="#">Google Form Data List</BreadcrumbLink>
// 						</BreadcrumbItem>
// 						<BreadcrumbSeparator className="hidden md:block" />
// 						<BreadcrumbItem>
// 							<BreadcrumbPage>Result Analysis</BreadcrumbPage>
// 						</BreadcrumbItem>
// 					</BreadcrumbList>
// 				</Breadcrumb>
// 			</header>
// 			<div>
// 				<ResultAdvanced data={data} />
// 			</div>
// 		</div>
// 	);
// }

// export default page;
"use client";
import ResultAdvanced from "@/components/result";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetAllStudentsFull } from "@/services/queries/student/student";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";

function page() {
	const { data, isLoading } = useGetAllStudentsFull();
	if (isLoading) return "Loading...";

	console.log("FULL API RESPONSE:", data);

	// ✅ Extract correct fields (based on your response)
	const students = data?.data?.students ?? [];
	const marks = data?.data?.marks ?? [];
	console.log("students" + JSON.stringify(students));
	console.log("marks" + JSON.stringify(marks));

	// 🛑 If missing, show error
	if (!students.length) return "No students found";
	if (!marks.length) return "No marks found";

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
		<div className="bg-slate-50 h-full">
			<header className="flex lg:mt-0 h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator className="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="#">Google Form Data List</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Result Analysis</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>

			{/* ✔ Pass transformed data */}
			<div>
				<ResultAdvanced data={formatted} />
			</div>
		</div>
	);
}

export default page;
