import { StudentForm } from "@/components/student-form";
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

function page() {
	return (
		<div>
			<h2 className="mb-5 font-semibold text-lg">Student Basic Details</h2>
			<div className="w-1/2 bg-white p-6 border rounded-2xl">
				<div className="border rounded-lg bg-slate-50">
					<Table>
						<TableBody>
							<TableRow>
								<TableCell className="font-medium">USN :</TableCell>
								<TableCell>4JN13MCA24</TableCell>
							</TableRow>

							<TableRow>
								<TableCell className="font-medium">Name :</TableCell>
								<TableCell>Kishan</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className="font-medium">Age :</TableCell>
								<TableCell>33</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className="font-medium">Gender :</TableCell>
								<TableCell>Male</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className="font-medium">Branch :</TableCell>
								<TableCell>CS</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
				<Button size="sm" className="my-4">
					<Edit />
					Edit details
				</Button>
			</div>
		</div>
	);
}

export default page;
