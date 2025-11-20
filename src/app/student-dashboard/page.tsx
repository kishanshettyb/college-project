"use client";
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useGetStudentsSemwiseById } from "@/services/queries/student/student";
import Cookies from "js-cookie";
function page() {
	const documentId = Cookies.get("username");
	// const clean = "4jn13mca25";
	const clean = decodeURIComponent(documentId).replace(/"/g, "");
	const { data, isLoading, isError } = useGetStudentsSemwiseById(clean);
	const student = data?.data?.data[0]; // extract student

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error fetching student</p>;
	console.log("data=" + JSON.stringify("student" + student));
	return (
		<div>
			<h2 className="mb-5 font-semibold text-lg">Student Basic Details</h2>
			<div className="w-1/2 bg-white p-6 border rounded-2xl">
				<div className="border rounded-lg bg-slate-50">
					<Table>
						<TableBody>
							<TableRow>
								<TableCell className="font-medium">USN :</TableCell>
								<TableCell className="uppercase">{student?.usn || clean}</TableCell>
							</TableRow>

							<TableRow>
								<TableCell className="font-medium">Name :</TableCell>
								<TableCell>{student?.name}</TableCell>
							</TableRow>

							<TableRow>
								<TableCell className="font-medium">Age :</TableCell>
								<TableCell>{student?.age}</TableCell>
							</TableRow>

							<TableRow>
								<TableCell className="font-medium">Gender :</TableCell>
								<TableCell>{student?.gender}</TableCell>
							</TableRow>

							<TableRow>
								<TableCell className="font-medium">Branch :</TableCell>
								<TableCell>{student?.branch?.branch_name}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}

export default page;
