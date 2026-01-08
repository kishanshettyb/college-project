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

// Define interfaces
interface SemesterResult {
	semester: string;
	percentage: number;
	SGPA: number;
	CGPA: number;
	result: string;
	grade: string;
}

interface Student {
	id: number;
	documentId: string;
	name: string;
	usn: string;
	sem: string;
	SGPA: string;
	CGPA: string;
	percentage: string;
	grade: string;
	result: string;
	category: string;
	gender: string;
	branch: string;
	batch?: string;
	semesterResults?: SemesterResult[];
	createdAt: string;
	updatedAt: string;
	publishedAt: string | null;
	[key: string]: any;
}

interface ChartData {
	topStudents: Array<{
		name: string;
		percentage: number;
		rank: number;
		branch: string;
	}>;
	passFailDistribution: Array<{
		status: string;
		count: number;
		percentage: number;
	}>;
	categoryPerformance: Array<{
		category: string;
		averagePercentage: number;
		passRate: number;
	}>;
	branchPerformance: Array<{
		branch: string;
		averagePercentage: number;
		passRate: number;
	}>;
	semesterTrends: Array<{
		semester: string;
		averagePercentage: number;
		passRate: number;
	}>;
	gradeDistribution: Array<{
		grade: string;
		count: number;
		percentage: number;
	}>;
	genderPerformance: Array<{
		gender: string;
		averagePercentage: number;
		count: number;
	}>;
	subjectPerformance?: Array<{
		subject: string;
		averageMarks: number;
		maxMarks: number;
		minMarks: number;
	}>;
}

interface OverallStats {
	totalStudents: number;
	passingStudents: number;
	failingStudents: number;
	overallPassRate: number;
	overallAveragePercentage: number;
	overallAverageSGPA: number;
	overallAverageCGPA: number;
	totalSubjects: number;
	highestPercentage: number;
	lowestPercentage: number;
}

function Page() {
	const { data, isLoading } = useGetAllStudentsFull();

	if (isLoading)
		return (
			<div className="flex justify-center items-center w-full h-full">
				<Loader2 className="animate-spin" />
			</div>
		);

	const students = data?.data?.students ?? [];
	const marks = data?.data?.marks ?? [];

	if (!students.length)
		return (
			<div className="flex flex-col justify-center w-full h-full items-center">
				<Image src="/images/nodata.jpg" alt="No Data found" width={500} height={500} className="w-[400px] h-[400px] object-cover" />
				<h2 className="text-2xl font-semibold">Sorry No Data Found</h2>
			</div>
		);

	// Transform data function
	function transformStudentsData(students: any[], marks: any[]): Student[] {
		return students.map((student) => {
			const studentResults = Array.isArray(student.results) ? student.results : [];

			// Group results by semester and get latest for each
			const resultsBySemester: Record<string, any[]> = {};
			studentResults.forEach((result) => {
				const sem = result.semister;
				if (!resultsBySemester[sem]) resultsBySemester[sem] = [];
				resultsBySemester[sem].push(result);
			});

			// Get latest result for each semester
			const latestResults: Record<string, any> = {};
			Object.keys(resultsBySemester).forEach((sem) => {
				const sorted = [...resultsBySemester[sem]].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
				latestResults[sem] = sorted[0];
			});

			// Get student marks
			const stuMarks = marks.filter((m) => m.student?.id === student.id);
			const subjectMarkMap: Record<string, string> = {};

			stuMarks.forEach((m) => {
				const code = m.subject?.sub_code?.toLowerCase() || "";
				const total = Number(m.internal_mark || 0) + Number(m.external_mark || 0);
				subjectMarkMap[code] = total.toString();
			});

			// Create semester results array
			const semesterResults: SemesterResult[] = Object.keys(latestResults).map((sem) => {
				const result = latestResults[sem];
				return {
					semester: sem.replace("sem", ""),
					percentage: parseFloat(result?.percentage || "0"),
					SGPA: parseFloat(result?.SGPA || "0"),
					CGPA: parseFloat(result?.CGPA || "0"),
					result: (result?.resultstatus || "fail").toLowerCase(),
					grade: (result?.grade || "fail").toLowerCase()
				};
			});

			semesterResults.sort((a, b) => parseInt(a.semester) - parseInt(b.semester));

			// Get overall latest result
			const allResults = [...studentResults].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			const latestOverallResult = allResults[0];

			return {
				id: student.id,
				documentId: student.documentId,
				name: student.name,
				usn: student.usn,
				batch: student.batch || "",
				sem: latestOverallResult?.semister?.replace("sem", "") || "",
				SGPA: latestOverallResult?.SGPA || "0",
				CGPA: latestOverallResult?.CGPA || "0",
				percentage: latestOverallResult?.percentage || "0",
				grade: (latestOverallResult?.grade || "fail").toLowerCase(),
				result: (latestOverallResult?.resultstatus || "fail").toLowerCase(),
				category: student.category || "Unknown",
				gender: student.gender || "Unknown",
				branch: student.branch?.branch_name || "Unknown",
				semesterResults,
				...subjectMarkMap,
				createdAt: student.createdAt,
				updatedAt: student.updatedAt,
				publishedAt: student.publishedAt
			};
		});
	}

	const finalData = transformStudentsData(students, marks);

	// Calculate overall statistics
	function calculateOverallStats(students: Student[]): OverallStats {
		const totalStudents = students.length;
		const passingStudents = students.filter((s) => s.result === "pass").length;
		const failingStudents = totalStudents - passingStudents;

		const percentages = students.map((s) => parseFloat(s.percentage) || 0);
		const sgpValues = students.map((s) => parseFloat(s.SGPA) || 0);
		const cgpValues = students.map((s) => parseFloat(s.CGPA) || 0);

		return {
			totalStudents,
			passingStudents,
			failingStudents,
			overallPassRate: totalStudents > 0 ? parseFloat(((passingStudents / totalStudents) * 100).toFixed(2)) : 0,
			overallAveragePercentage: percentages.length > 0 ? parseFloat((percentages.reduce((a, b) => a + b, 0) / percentages.length).toFixed(2)) : 0,
			overallAverageSGPA: sgpValues.length > 0 ? parseFloat((sgpValues.reduce((a, b) => a + b, 0) / sgpValues.length).toFixed(2)) : 0,
			overallAverageCGPA: cgpValues.length > 0 ? parseFloat((cgpValues.reduce((a, b) => a + b, 0) / cgpValues.length).toFixed(2)) : 0,
			totalSubjects: marks.length,
			highestPercentage: Math.max(...percentages, 0),
			lowestPercentage: Math.min(...percentages.filter((p) => p > 0), 0)
		};
	}

	// Generate chart data
	function generateChartData(students: Student[]): ChartData {
		// Top 10 Students
		const topStudents = [...students]
			.filter((s) => s.result === "pass")
			.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
			.slice(0, 10)
			.map((student, index) => ({
				name: student.name,
				percentage: parseFloat(student.percentage),
				rank: index + 1,
				branch: student.branch
			}));

		// Pass/Fail Distribution
		const passCount = students.filter((s) => s.result === "pass").length;
		const failCount = students.length - passCount;
		const passFailDistribution = [
			{
				status: "Pass",
				count: passCount,
				percentage: parseFloat(((passCount / students.length) * 100).toFixed(2))
			},
			{
				status: "Fail",
				count: failCount,
				percentage: parseFloat(((failCount / students.length) * 100).toFixed(2))
			}
		];

		// Category Performance
		const categories = [...new Set(students.map((s) => s.category).filter(Boolean))];
		const categoryPerformance = categories.map((category) => {
			const categoryStudents = students.filter((s) => s.category === category);
			const passCount = categoryStudents.filter((s) => s.result === "pass").length;
			const avgPercentage = categoryStudents.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / categoryStudents.length;

			return {
				category,
				averagePercentage: parseFloat(avgPercentage.toFixed(2)),
				passRate: parseFloat(((passCount / categoryStudents.length) * 100).toFixed(2))
			};
		});

		// Branch Performance
		const branches = [...new Set(students.map((s) => s.branch).filter(Boolean))];
		const branchPerformance = branches.map((branch) => {
			const branchStudents = students.filter((s) => s.branch === branch);
			const passCount = branchStudents.filter((s) => s.result === "pass").length;
			const avgPercentage = branchStudents.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / branchStudents.length;

			return {
				branch,
				averagePercentage: parseFloat(avgPercentage.toFixed(2)),
				passRate: parseFloat(((passCount / branchStudents.length) * 100).toFixed(2))
			};
		});

		// Semester Trends (aggregate from semesterResults)
		const allSemesterResults = students.flatMap((s) => s.semesterResults || []);
		const semesters = [...new Set(allSemesterResults.map((r) => r.semester).filter(Boolean))];
		const semesterTrends = semesters
			.map((sem) => {
				const semResults = allSemesterResults.filter((r) => r.semester === sem);
				const passCount = semResults.filter((r) => r.result === "pass").length;
				const avgPercentage = semResults.reduce((sum, r) => sum + r.percentage, 0) / semResults.length;

				return {
					semester: `Sem ${sem}`,
					averagePercentage: parseFloat(avgPercentage.toFixed(2)),
					passRate: parseFloat(((passCount / semResults.length) * 100).toFixed(2))
				};
			})
			.sort((a, b) => parseInt(a.semester.split(" ")[1]) - parseInt(b.semester.split(" ")[1]));

		// Grade Distribution
		const grades = ["first class with distinction", "first class", "second class", "pass", "fail"];
		const gradeDistribution = grades
			.map((grade) => {
				const count = students.filter((s) => s.grade.toLowerCase() === grade.toLowerCase()).length;
				return {
					grade: grade.charAt(0).toUpperCase() + grade.slice(1),
					count,
					percentage: parseFloat(((count / students.length) * 100).toFixed(2))
				};
			})
			.filter((g) => g.count > 0);

		// Gender Performance
		const genders = [...new Set(students.map((s) => s.gender).filter(Boolean))];
		const genderPerformance = genders.map((gender) => {
			const genderStudents = students.filter((s) => s.gender === gender);
			const avgPercentage = genderStudents.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / genderStudents.length;

			return {
				gender,
				averagePercentage: parseFloat(avgPercentage.toFixed(2)),
				count: genderStudents.length
			};
		});

		// Subject Performance (if marks available)
		let subjectPerformance: any[] = [];
		if (marks.length > 0) {
			const subjectGroups: Record<string, number[]> = {};
			marks.forEach((mark) => {
				const subject = mark.subject?.sub_code || "Unknown";
				const total = Number(mark.internal_mark || 0) + Number(mark.external_mark || 0);
				if (!subjectGroups[subject]) subjectGroups[subject] = [];
				subjectGroups[subject].push(total);
			});

			subjectPerformance = Object.entries(subjectGroups).map(([subject, marks]) => ({
				subject,
				averageMarks: parseFloat((marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(2)),
				maxMarks: Math.max(...marks),
				minMarks: Math.min(...marks)
			}));
		}

		return {
			topStudents,
			passFailDistribution,
			categoryPerformance,
			branchPerformance,
			semesterTrends,
			gradeDistribution,
			genderPerformance,
			subjectPerformance: subjectPerformance.length > 0 ? subjectPerformance : undefined
		};
	}

	// Generate insights
	function generateInsights(stats: OverallStats, chartData: ChartData): string[] {
		const insights: string[] = [];

		if (stats.overallPassRate >= 75) {
			insights.push("Excellent overall pass rate indicates good academic performance.");
		} else if (stats.overallPassRate >= 50) {
			insights.push("Moderate pass rate - consider analyzing weak areas.");
		} else {
			insights.push("Low pass rate requires immediate attention and intervention.");
		}

		const topBranch = chartData.branchPerformance.sort((a, b) => b.averagePercentage - a.averagePercentage)[0];
		if (topBranch) {
			insights.push(`${topBranch.branch} branch has the highest average percentage (${topBranch.averagePercentage}%).`);
		}

		const topCategory = chartData.categoryPerformance.sort((a, b) => b.averagePercentage - a.averagePercentage)[0];
		if (topCategory) {
			insights.push(`${topCategory.category} category students are performing best with ${topCategory.averagePercentage}% average.`);
		}

		if (chartData.semesterTrends.length > 1) {
			const firstSem = chartData.semesterTrends[0];
			const lastSem = chartData.semesterTrends[chartData.semesterTrends.length - 1];
			if (lastSem.averagePercentage > firstSem.averagePercentage) {
				insights.push("Performance is improving across semesters.");
			} else if (lastSem.averagePercentage < firstSem.averagePercentage) {
				insights.push("Performance is declining across semesters - needs investigation.");
			}
		}

		if (stats.highestPercentage - stats.lowestPercentage > 50) {
			insights.push("Large performance gap between top and bottom performers identified.");
		}

		const failCount = chartData.passFailDistribution.find((d) => d.status === "Fail")?.count || 0;
		if (failCount > stats.totalStudents * 0.3) {
			insights.push("High failure rate detected - consider remedial measures.");
		}

		return insights;
	}

	// Calculate everything
	const overallStats = calculateOverallStats(finalData);
	const chartData = generateChartData(finalData);
	const insights = generateInsights(overallStats, chartData);

	// Prepare final data structure
	const formatted = {
		data: finalData,
		stats: overallStats,
		charts: chartData,
		insights: insights,
		meta: {
			lastUpdated: new Date().toISOString(),
			totalRecords: finalData.length,
			analysisPeriod: "Current Academic Year"
		}
	};

	return (
		<div className="bg-slate-50 min-h-screen p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-800 mb-2">Student Performance Analytics Dashboard</h1>
				<p className="text-gray-600">
					Comprehensive analysis of {finalData.length} students across {chartData.branchPerformance.length} branches
				</p>
			</div>

			{/* Summary Cards */}
			{/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div className="bg-white rounded-xl shadow p-6">
					<h3 className="text-gray-500 text-sm font-medium mb-2">Total Students</h3>
					<p className="text-3xl font-bold text-gray-800">{overallStats.totalStudents}</p>
					<div className="mt-2 flex items-center text-sm text-green-600">
						<span>Complete dataset</span>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow p-6">
					<h3 className="text-gray-500 text-sm font-medium mb-2">Pass Rate</h3>
					<p className="text-3xl font-bold text-blue-600">{overallStats.overallPassRate}%</p>
					<div className="mt-2 flex items-center text-sm">
						<span>
							{overallStats.passingStudents} passed, {overallStats.failingStudents} failed
						</span>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow p-6">
					<h3 className="text-gray-500 text-sm font-medium mb-2">Average Percentage</h3>
					<p className="text-3xl font-bold text-purple-600">{overallStats.overallAveragePercentage}%</p>
					<div className="mt-2 text-sm text-gray-600">
						Highest: {overallStats.highestPercentage}%, Lowest: {overallStats.lowestPercentage}%
					</div>
				</div>

				<div className="bg-white rounded-xl shadow p-6">
					<h3 className="text-gray-500 text-sm font-medium mb-2">Average SGPA/CGPA</h3>
					<p className="text-3xl font-bold text-teal-600">
						{overallStats.overallAverageSGPA}/{overallStats.overallAverageCGPA}
					</p>
					<div className="mt-2 text-sm text-gray-600">Based on latest semester results</div>
				</div>
			</div> */}

			{/* Main Analysis Component */}
			<div className="bg-white rounded-xl shadow p-6">
				<ResultAdvanced data={formatted} />
			</div>

			{/* Data Summary */}
			<div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-xl shadow p-6">
					<h3 className="text-lg font-semibold mb-4">Branch Performance Summary</h3>
					<div className="space-y-3">
						{chartData.branchPerformance.map((branch, index) => (
							<div key={index} className="flex justify-between items-center border-b pb-2">
								<span className="font-medium">{branch.branch}</span>
								<div className="text-right">
									<div className="font-semibold">{branch.averagePercentage}% avg</div>
									<div className="text-sm text-gray-500">{branch.passRate}% pass rate</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white rounded-xl shadow p-6">
					<h3 className="text-lg font-semibold mb-4">Category Performance Summary</h3>
					<div className="space-y-3">
						{chartData.categoryPerformance.map((category, index) => (
							<div key={index} className="flex justify-between items-center border-b pb-2">
								<span className="font-medium">{category.category}</span>
								<div className="text-right">
									<div className="font-semibold">{category.averagePercentage}% avg</div>
									<div className="text-sm text-gray-500">{category.passRate}% pass rate</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Top Performers */}
			<div className="mt-8 bg-white rounded-xl shadow p-6">
				<h3 className="text-lg font-semibold mb-4">Top 5 Performers</h3>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead>
							<tr>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">USN</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SGPA</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{chartData.topStudents.slice(0, 5).map((student, index) => {
								const fullStudent = finalData.find((s) => s.name === student.name);
								return (
									<tr key={index}>
										<td className="px-4 py-3">
											<div className={`flex items-center justify-center w-8 h-8 rounded-full ${index < 3 ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
												{student.rank}
											</div>
										</td>
										<td className="px-4 py-3 font-medium">{student.name}</td>
										<td className="px-4 py-3 text-gray-600">{fullStudent?.usn || "N/A"}</td>
										<td className="px-4 py-3">
											<span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{student.branch}</span>
										</td>
										<td className="px-4 py-3 font-semibold">{student.percentage}%</td>
										<td className="px-4 py-3">{fullStudent?.SGPA || "N/A"}</td>
										<td className="px-4 py-3">
											<span
												className={`px-2 py-1 text-xs rounded-full ${
													fullStudent?.grade?.includes("distinction")
														? "bg-green-100 text-green-800"
														: fullStudent?.grade === "first class"
														? "bg-blue-100 text-blue-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{fullStudent?.grade || "N/A"}
											</span>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			{/* Insights Section */}
			// <div className="bg-white rounded-xl shadow p-6 mt-6 mb-8">
			// 	<h2 className="text-xl font-bold text-gray-800 mb-4">Key Insights</h2>
			// 	<div className="space-y-3">
			// 		{insights.map((insight, index) => (
			// 			<div key={index} className="flex items-start">
			// 				<div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
			// 				<p className="text-gray-700">{insight}</p>
			// 			</div>
			// 		))}
			// 	</div>
			// </div>
		</div>
	);
}

export default Page;
