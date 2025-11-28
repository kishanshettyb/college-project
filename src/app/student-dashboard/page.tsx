"use client";
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import { useGetStudentsSemwiseById } from "@/services/queries/student/student";
import Cookies from "js-cookie";
import { AddStudentModal } from "@/components/addStudentModal";
function page() {
	const documentId = Cookies.get("username");
	// const clean = "4jn13mca25";
	const clean = decodeURIComponent(documentId).replace(/"/g, "");
	const { data, isLoading, isError } = useGetStudentsSemwiseById(clean);
	const student = data?.data?.data[0]; // extract student

	if (isLoading)
		return (
			<div className="flex justify-center items-center w-full h-full">
				<Loader2 className="animate-spin" />
			</div>
		);
	if (isError) return <p>Error fetching student</p>;
	return (
		<div>
			<h2 className="mb-5 font-semibold text-lg">Student Basic Details</h2>
			<div className="w-full lg:w-1/2 bg-white p-6 border rounded-2xl">
				<div className="border rounded-lg bg-slate-50">
					<Table>
						<TableBody>
							<TableRow>
								<TableCell className="font-medium">DocId :</TableCell>
								<TableCell className="uppercase">{student?.documentId}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className="font-medium">USN :</TableCell>
								<TableCell className="uppercase">{student?.usn || clean}</TableCell>
							</TableRow>

							<TableRow>
								<TableCell className="font-medium">Name :</TableCell>
								<TableCell>{student?.name}</TableCell>
							</TableRow>

							<TableRow>
								<TableCell className="font-medium">DOB :</TableCell>
								<TableCell>{student?.dob}</TableCell>
							</TableRow>

							<TableRow>
								<TableCell className="font-medium">Gender :</TableCell>
								<TableCell>{student?.gender}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className="font-medium">Category :</TableCell>
								<TableCell>{student?.category}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className="font-medium">Batch :</TableCell>
								<TableCell>{student?.batch}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className="font-medium">Branch :</TableCell>
								<TableCell>{student?.branch?.branch_name}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			</div>
			<div className="my-5">
				<AddStudentModal docId={student?.documentId} />
			</div>
		</div>
	);
}

export default page;
