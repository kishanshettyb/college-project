"use client";

import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";

export default function Result({ data }: any) {
	const resultData = data?.data || [];

	console.log("resultData--" + JSON.stringify(resultData));

	// --- Filters ---
	const [selectedSem, setSelectedSem] = useState("All");
	const [selectedResult, setSelectedResult] = useState("All");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedBranch, setSelectedBranch] = useState("All");
	const [selectedGrade, setSelectedGrade] = useState("All");

	// --- Unique values for filters ---
	const semesters = Array.from(new Set(resultData.map((d) => d.sem)));
	const categories = Array.from(new Set(resultData.map((d) => d.category)));
	const branches = Array.from(new Set(resultData.map((d) => d.branch)));
	const grades = Array.from(new Set(resultData.map((d) => d.grade)));

	// --- Filtered Data ---
	const filteredData = useMemo(() => {
		if (!Array.isArray(resultData)) return [];
		return resultData.filter((d: any) => {
			const semMatch = selectedSem === "All" || d.sem === selectedSem;
			const resultMatch = selectedResult === "All" || d.result?.toLowerCase() === selectedResult.toLowerCase();
			const categoryMatch = selectedCategory === "All" || d.category === selectedCategory;
			const branchMatch = selectedBranch === "All" || d.branch === selectedBranch;
			const gradeMatch = selectedGrade === "All" || d.grade === selectedGrade;

			return semMatch && resultMatch && categoryMatch && branchMatch && gradeMatch;
		});
	}, [selectedSem, selectedResult, selectedCategory, selectedBranch, selectedGrade, resultData]);

	// --- SGPA vs CGPA Chart ---
	const sgpaData = filteredData.map((d: any) => ({
		name: d.name,
		SGPA: parseFloat(d.SGPA),
		CGPA: parseFloat(d.CGPA)
	}));

	// --- Average per Semester ---
	const averageData = useMemo(() => {
		const semesters = Array.from(new Set(filteredData.map((d) => d.sem)));

		return semesters.map((sem) => {
			const semData = filteredData.filter((d) => d.sem === sem);
			const avgSGPA = semData.reduce((sum, s) => sum + parseFloat(s.SGPA), 0) / semData.length || 0;
			const avgCGPA = semData.reduce((sum, s) => sum + parseFloat(s.CGPA), 0) / semData.length || 0;

			return { sem, avgSGPA: parseFloat(avgSGPA.toFixed(2)), avgCGPA: parseFloat(avgCGPA.toFixed(2)) };
		});
	}, [filteredData]);

	// --- Pass/Fail Pie ---
	const passFail = [
		{ name: "Pass", value: filteredData.filter((d: any) => d.result === "pass" || d.result === "Pass").length },
		{ name: "Fail", value: filteredData.filter((d: any) => d.result === "fail" || d.result === "Fail").length }
	];
	const COLORS = ["#4ade80", "#f87171"];

	// --- CGPA Distribution ---
	const cgpaRanges = [
		{ name: "0-5", value: filteredData.filter((d) => d.CGPA <= 5).length },
		{ name: "5-7", value: filteredData.filter((d) => d.CGPA > 5 && d.CGPA <= 7).length },
		{ name: "7-10", value: filteredData.filter((d) => d.CGPA > 7).length }
	];

	// --- Top / Bottom Students ---
	const topStudents = [...filteredData].sort((a, b) => parseFloat(b.SGPA) - parseFloat(a.SGPA)).slice(0, 5);
	const bottomStudents = [...filteredData].sort((a, b) => parseFloat(a.SGPA) - parseFloat(b.SGPA)).slice(0, 5);

	// --- CSV Export ---
	const exportCSV = () => {
		const headers = ["Name", "Sem", "SGPA", "CGPA", "Result", "Category", "Branch", "Grade"];
		const rows = filteredData.map((d) => [d.name, d.sem, d.SGPA, d.CGPA, d.result, d.category, d.branch, d.grade]);
		const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
		const blob = new Blob([csvContent], { type: "text/csv" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "student_report.csv";
		link.click();
	};

	return (
		<div className="p-4 space-y-6">
			{/* Header & Filters */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
				<h1 className="text-2xl font-semibold">Student Reports</h1>
				<div className="flex flex-wrap gap-4">
					{/* Semester */}
					<div>
						<Label>Semester</Label>
						<Select onValueChange={setSelectedSem} defaultValue="All">
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Select Semester" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="All">All</SelectItem>
								{semesters.map((sem) => (
									<SelectItem key={sem} value={sem}>
										Sem {sem}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Result */}
					<div>
						<Label>Result</Label>
						<Select onValueChange={setSelectedResult} defaultValue="All">
							<SelectTrigger className="w-[120px]">
								<SelectValue placeholder="Select Result" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="All">All</SelectItem>
								<SelectItem value="Pass">Pass</SelectItem>
								<SelectItem value="Fail">Fail</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Category */}
					<div>
						<Label>Category</Label>
						<Select onValueChange={setSelectedCategory} defaultValue="All">
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Select Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="All">All</SelectItem>
								{categories.map((cat) => (
									<SelectItem key={cat} value={cat}>
										{cat}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Branch */}
					<div>
						<Label>Branch</Label>
						<Select onValueChange={setSelectedBranch} defaultValue="All">
							<SelectTrigger className="w-[220px]">
								<SelectValue placeholder="Select Branch" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="All">All</SelectItem>
								{branches.map((br) => (
									<SelectItem key={br} value={br}>
										{br}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Grade */}
					<div>
						<Label>Grade</Label>
						<Select onValueChange={setSelectedGrade} defaultValue="All">
							<SelectTrigger className="w-[220px]">
								<SelectValue placeholder="Select Grade" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="All">All</SelectItem>
								{grades.map((gr) => (
									<SelectItem key={gr} value={gr}>
										{gr}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* CSV Export */}
					<div className="flex items-end">
						<Button onClick={exportCSV} className="px-3 py-1">
							Export CSV
						</Button>
					</div>
				</div>
			</div>

			{/* No Data */}
			{filteredData.length === 0 ? (
				<p className="text-center text-gray-500">No data available</p>
			) : (
				<>
					{/* Charts */}
					<div className="flex flex-col lg:flex-row gap-5 w-full">
						<Card className="w-full lg:w-1/2">
							<CardHeader>
								<CardTitle>SGPA vs CGPA</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={sgpaData}>
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Bar dataKey="SGPA" fill="#8884d8" />
										<Bar dataKey="CGPA" fill="#82ca9d" />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						<Card className="w-full lg:w-1/2">
							<CardHeader>
								<CardTitle>Average SGPA / CGPA per Semester</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<LineChart data={averageData}>
										<XAxis dataKey="sem" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Line type="monotone" dataKey="avgSGPA" stroke="#8884d8" />
										<Line type="monotone" dataKey="avgCGPA" stroke="#82ca9d" />
									</LineChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>

					{/* More Charts */}
					<div className="flex gap-5 flex-col lg:flex-row">
						<Card className="w-full lg:w-1/2">
							<CardHeader>
								<CardTitle>CGPA Distribution</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={cgpaRanges}>
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Bar dataKey="value" fill="#facc15" />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						<Card className="w-full lg:w-1/2">
							<CardHeader>
								<CardTitle>Result Summary (Pass / Fail)</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie data={passFail} dataKey="value" nameKey="name" outerRadius={120} label>
											{passFail.map((entry, i) => (
												<Cell key={i} fill={COLORS[i % COLORS.length]} />
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>

					{/* Top & Bottom */}
					<div className="flex gap-5 flex-col lg:flex-row">
						<Card className="w-full lg:w-1/2">
							<CardHeader>
								<CardTitle>Top 5 Students (SGPA)</CardTitle>
							</CardHeader>
							<CardContent>
								<table className="w-full border-collapse">
									<thead>
										<tr>
											<th className="border px-2 py-1">Name</th>
											<th className="border px-2 py-1">Sem</th>
											<th className="border px-2 py-1">SGPA</th>
											<th className="border px-2 py-1">CGPA</th>
											<th className="border px-2 py-1">Result</th>
										</tr>
									</thead>
									<tbody>
										{topStudents.map((s, i) => (
											<tr key={i}>
												<td className="border px-2 py-1">{s.name}</td>
												<td className="border px-2 py-1">{s.sem}</td>
												<td className="border px-2 py-1">{s.SGPA}</td>
												<td className="border px-2 py-1">{s.CGPA}</td>
												<td className="border px-2 py-1">{s.result}</td>
											</tr>
										))}
									</tbody>
								</table>
							</CardContent>
						</Card>

						<Card className="w-full lg:w-1/2">
							<CardHeader>
								<CardTitle>Bottom 5 Students (SGPA)</CardTitle>
							</CardHeader>
							<CardContent>
								<table className="w-full border-collapse">
									<thead>
										<tr>
											<th className="border px-2 py-1">Name</th>
											<th className="border px-2 py-1">Sem</th>
											<th className="border px-2 py-1">SGPA</th>
											<th className="border px-2 py-1">CGPA</th>
											<th className="border px-2 py-1">Result</th>
										</tr>
									</thead>
									<tbody>
										{bottomStudents.map((s, i) => (
											<tr key={i}>
												<td className="border px-2 py-1">{s.name}</td>
												<td className="border px-2 py-1">{s.sem}</td>
												<td className="border px-2 py-1">{s.SGPA}</td>
												<td className="border px-2 py-1">{s.CGPA}</td>
												<td className="border px-2 py-1">{s.result}</td>
											</tr>
										))}
									</tbody>
								</table>
							</CardContent>
						</Card>
					</div>
				</>
			)}
		</div>
	);
}
