"use client";
import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";

export default function Result({ data }: any) {
	// ✅ handle nested structure safely
	const resultData = data?.data?.data || [];

	const [selectedSem, setSelectedSem] = useState("All");

	const filteredData = useMemo(() => {
		if (!Array.isArray(resultData)) return [];
		if (selectedSem === "All") return resultData;
		return resultData.filter((d: any) => d.sem === selectedSem);
	}, [selectedSem, resultData]);

	const sgpaData = filteredData.map((d: any) => ({
		name: d.name,
		SGPA: parseFloat(d.SGPA),
		CGPA: parseFloat(d.CGPA)
	}));

	const passFail = [
		{ name: "Pass", value: filteredData.filter((d: any) => d.result === "Pass").length },
		{ name: "Fail", value: filteredData.filter((d: any) => d.result === "Fail").length }
	];

	const COLORS = ["#4ade80", "#f87171"];

	return (
		<div className="p-4 space-y-6">
			<div className="flex flex-col lg:flex-row justify-start lg:justify-between items-start lg:items-center">
				<div>
					<h1 className="text-2xl font-semibold mb-2">Student Reports</h1>
				</div>
				<div>
					<Label htmlFor="semester">Select Semester</Label>
					<Select onValueChange={setSelectedSem} defaultValue="All">
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select Semester" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="All">All</SelectItem>
							{Array.from(new Set(resultData.map((d: any) => d.sem))).map((sem: string) => (
								<SelectItem key={sem} value={sem}>
									Sem {sem}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{filteredData.length === 0 ? (
				<p className="text-center text-gray-500">No data available</p>
			) : (
				<div className="flex flex-col lg:flex-row w-full gap-5">
					<div className="w-full lg:w-1/2">
						{/* SGPA vs CGPA */}
						<Card className="w-full">
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
					</div>
					<div className="w-full lg:w-1/2">
						{/* Pass vs Fail */}
						<Card>
							<CardHeader>
								<CardTitle>Result Summary</CardTitle>
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
				</div>
			)}
		</div>
	);
}
