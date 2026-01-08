// "use client";
// import ResultAdvanced from "@/components/result";

// import { useGetAllStudentsFull } from "@/services/queries/student/student";
// import { Loader2 } from "lucide-react";
// import Image from "next/image";
// import React from "react";

// function page() {
// 	const { data, isLoading } = useGetAllStudentsFull();
// 	if (isLoading)
// 		return (
// 			<div className="flex justify-center items-center w-full h-full">
// 				<Loader2 className="animate-spin" />
// 			</div>
// 		);

// 	// ✅ Extract correct fields (based on your response)
// 	const students = data?.data?.students ?? [];
// 	const marks = data?.data?.marks ?? [];

// 	// 🛑 If missing, show error
// 	if (!students.length)
// 		return (
// 			<div className="flex flex-col justify-center w-full h-full items-center ">
// 				<Image src="/images/nodata.jpg" alt="No Data found" width={500} height={500} className="w-[400px] h-[400px] object-cover" />
// 				<h2 className="text-2xl font-semibold">Sorry No Data Found</h2>
// 			</div>
// 		);
// 	if (!marks.length)
// 		return (
// 			<div className="flex flex-col justify-center w-full h-full items-center ">
// 				<Image src="/images/nodata.jpg" alt="No Data found" width={500} height={500} className="w-[400px] h-[400px] object-cover" />
// 				<h2 className="text-2xl font-semibold">Sorry No Data Found</h2>
// 			</div>
// 		);

// 	// --------------------------------------------------------
// 	// 🔥 Transform into your desired final structure
// 	// --------------------------------------------------------
// 	// function transformStudentsData(students: any[], marks: any[]) {
// 	// 	return students.map((student) => {
// 	// 		const stuMarks = marks.filter((m) => m.student.id === student.id);
// 	// 		const subjectMarkMap: Record<string, string> = {};

// 	// 		stuMarks.forEach((m) => {
// 	// 			const code = m.subject.sub_code.toLowerCase(); // ecs001 etc.
// 	// 			const total = Number(m.internal_mark || 0) + Number(m.external_mark || 0);
// 	// 			subjectMarkMap[code] = total.toString();
// 	// 		});

// 	// 		return {
// 	// 			id: student.id,
// 	// 			documentId: student.documentId,
// 	// 			name: student.name,
// 	// 			usn: student.usn,
// 	// 			sem: student.result?.semister?.replace("sem", "") || "",
// 	// 			SGPA: student.result?.SGPA || "",
// 	// 			CGPA: student.result?.CGPA || "",
// 	// 			percentage: student.result?.percentage || "",
// 	// 			category: student.category,
// 	// 			gender: student.gender,
// 	// 			result: student.result?.result || "",
// 	// 			grade: student.result?.grade || "",
// 	// 			branch: student.branch?.branch_name || "",
// 	// 			createdAt: student.createdAt,
// 	// 			updatedAt: student.updatedAt,
// 	// 			publishedAt: student.publishedAt,
// 	// 			...subjectMarkMap
// 	// 		};
// 	// 	});
// 	// }
// 	function transformStudentsData(students: any[], marks: any[]) {
// 		return students.map((student) => {
// 			// Choose latest semester result
// 			const latestResult = Array.isArray(student.results) && student.results.length > 0 ? student.results[student.results.length - 1] : null;

// 			// All marks for this student
// 			const stuMarks = marks.filter((m) => m.student.id === student.id);

// 			const subjectMarkMap: Record<string, string> = {};

// 			stuMarks.forEach((m) => {
// 				const code = m.subject?.sub_code?.toLowerCase() || "";
// 				const total = Number(m.internal_mark || 0) + Number(m.external_mark || 0);

// 				subjectMarkMap[code] = total.toString();
// 			});

// 			return {
// 				id: student.id,
// 				documentId: student.documentId,
// 				name: student.name,
// 				usn: student.usn,

// 				// ✔ Correct: semester
// 				sem: latestResult?.semister?.replace("sem", "") ?? "",

// 				// ✔ Correct: SGPA/CGPA
// 				SGPA: latestResult?.SGPA ?? "",
// 				CGPA: latestResult?.CGPA ?? "",
// 				percentage: latestResult?.percentage ?? "",

// 				// ✔ Correct: academic grade (not pass/fail)
// 				grade: latestResult?.grade ?? "",

// 				// ✔ Correct: result = pass/fail
// 				result: latestResult?.resultstatus ?? "",

// 				category: student.category,
// 				gender: student.gender,
// 				branch: student.branch?.branch_name,
// 				createdAt: student.createdAt,
// 				updatedAt: student.updatedAt,
// 				publishedAt: student.publishedAt,

// 				...subjectMarkMap
// 			};
// 		});
// 	}

// 	// const finalData = transformStudentsData(students, marks);
// 	const finalData = transformStudentsData(students, marks);

// 	// ⭐ Sort for Top 5 ranking
// 	finalData.sort((a: any, b: any) => {
// 		const p1 = Number(a.percentage) || 0;
// 		const p2 = Number(b.percentage) || 0;

// 		if (p2 !== p1) return p2 - p1;

// 		const s1 = Number(a.SGPA) || 0;
// 		const s2 = Number(b.SGPA) || 0;

// 		if (s2 !== s1) return s2 - s1;

// 		const c1 = Number(a.CGPA) || 0;
// 		const c2 = Number(b.CGPA) || 0;

// 		return c2 - c1;
// 	});

// 	const formatted = {
// 		data: finalData,
// 		meta: {
// 			pagination: {
// 				start: 0,
// 				limit: finalData.length,
// 				total: finalData.length
// 			}
// 		}
// 	};
// 	// --------------------------------------------------------

// 	return (
// 		<div className="bg-slate-50 h-full mb-50">
// 			{/* ✔ Pass transformed data */}
// 			<div>
// 				<ResultAdvanced data={formatted} />
// 			</div>
// 		</div>
// 	);
// }

// export default page;
"use client";
import ResultAdvanced from "@/components/result";
import { useGetAllStudentsFull } from "@/services/queries/student/student";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";

function Page() {
	const { data, isLoading } = useGetAllStudentsFull();

	if (isLoading)
		return (
			<div className="flex justify-center items-center w-full h-full">
				<Loader2 className="animate-spin" />
			</div>
		);

	// ✅ Extract correct fields
	const students = data?.data?.students ?? [];
	const marks = data?.data?.marks ?? [];

	// 🛑 If missing, show error
	if (!students.length)
		return (
			<div className="flex flex-col justify-center w-full h-full items-center ">
				<Image src="/images/nodata.jpg" alt="No Data found" width={500} height={500} className="w-[400px] h-[400px] object-cover" />
				<h2 className="text-2xl font-semibold">Sorry No Data Found</h2>
			</div>
		);

	function transformStudentsData(students: any[], marks: any[]) {
		return students.map((student) => {
			// Get all results for this student
			const studentResults = Array.isArray(student.results) ? student.results : [];

			// Group results by semester
			const resultsBySemester: Record<string, any[]> = {};
			studentResults.forEach((result) => {
				const sem = result.semister;
				if (!resultsBySemester[sem]) {
					resultsBySemester[sem] = [];
				}
				resultsBySemester[sem].push(result);
			});

			// Get latest result for each semester (most recent created date)
			const latestResults: Record<string, any> = {};
			Object.keys(resultsBySemester).forEach((sem) => {
				const semesterResults = resultsBySemester[sem];
				// Sort by createdAt descending and take the first one
				const sorted = [...semesterResults].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
				latestResults[sem] = sorted[0];
			});

			// Get marks for this student
			const stuMarks = marks.filter((m) => m.student.id === student.id);
			const subjectMarkMap: Record<string, string> = {};

			stuMarks.forEach((m) => {
				const code = m.subject?.sub_code?.toLowerCase() || "";
				const total = Number(m.internal_mark || 0) + Number(m.external_mark || 0);
				subjectMarkMap[code] = total.toString();
			});

			// For charts, we need results for each semester
			const semesterResults = Object.keys(latestResults).map((sem) => {
				const result = latestResults[sem];
				return {
					semester: sem.replace("sem", ""),
					percentage: parseFloat(result?.percentage || "0"),
					SGPA: parseFloat(result?.SGPA || "0"),
					CGPA: parseFloat(result?.CGPA || "0"),
					result: result?.resultstatus || "fail",
					grade: result?.grade || "fail"
				};
			});

			// Sort semester results by semester number
			semesterResults.sort((a, b) => parseInt(a.semester) - parseInt(b.semester));

			// Get overall latest result (for summary)
			const allResults = studentResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			const latestOverallResult = allResults[0];

			return {
				id: student.id,
				documentId: student.documentId,
				name: student.name,
				usn: student.usn,

				// For latest semester data
				sem: latestOverallResult?.semister?.replace("sem", "") || "",
				SGPA: latestOverallResult?.SGPA || "0",
				CGPA: latestOverallResult?.CGPA || "0",
				percentage: latestOverallResult?.percentage || "0",

				// Correct grade and result fields
				grade: latestOverallResult?.grade || "fail",
				result: latestOverallResult?.resultstatus || "fail", // Fixed: use resultstatus

				category: student.category,
				gender: student.gender,
				branch: student.branch?.branch_name || "",

				// Add semester results array for charts
				semesterResults: semesterResults,

				// Subject marks
				...subjectMarkMap,

				createdAt: student.createdAt,
				updatedAt: student.updatedAt,
				publishedAt: student.publishedAt
			};
		});
	}

	const finalData = transformStudentsData(students, marks);

	// ⭐ Sort for Top 5 ranking - include only passing students
	const passingStudents = finalData.filter((student) => student.result?.toLowerCase() === "pass");

	const sortedData = [...passingStudents].sort((a: any, b: any) => {
		const p1 = Number(a.percentage) || 0;
		const p2 = Number(b.percentage) || 0;

		if (p2 !== p1) return p2 - p1;

		const s1 = Number(a.SGPA) || 0;
		const s2 = Number(b.SGPA) || 0;

		if (s2 !== s1) return s2 - s1;

		const c1 = Number(a.CGPA) || 0;
		const c2 = Number(b.CGPA) || 0;

		return c2 - c1;
	});

	const top5 = sortedData.slice(0, 5);

	// For charts, we need overall statistics
	const totalStudents = finalData.length;
	const passingCount = finalData.filter((s) => s.result?.toLowerCase() === "pass").length;
	const failingCount = totalStudents - passingCount;

	// Calculate average percentages by category
	const categories = [...new Set(finalData.map((s) => s.category))];
	const categoryAverages = categories.map((cat) => {
		const categoryStudents = finalData.filter((s) => s.category === cat);
		const avgPercentage = categoryStudents.reduce((sum, s) => sum + (parseFloat(s.percentage) || 0), 0) / categoryStudents.length || 0;
		return {
			category: cat,
			average: avgPercentage
		};
	});

	const formatted = {
		data: finalData,
		top5: top5, // Add top 5 for ranking chart
		stats: {
			total: totalStudents,
			passing: passingCount,
			failing: failingCount,
			passRate: totalStudents > 0 ? (passingCount / totalStudents) * 100 : 0
		},
		categoryAverages: categoryAverages, // For category comparison chart
		meta: {
			pagination: {
				start: 0,
				limit: finalData.length,
				total: finalData.length
			}
		}
	};

	return (
		<div className="bg-slate-50 h-full mb-50">
			<div>
				{/* Pass the enhanced data structure */}
				<ResultAdvanced data={formatted} />
			</div>
		</div>
	);
}

export default Page;