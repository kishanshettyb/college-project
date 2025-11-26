"use client";

import { StudentForm } from "@/components/student-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";

export type StudentSemwise = {
	id: number;
	documentId: string;
	name: string;
	usn: string;
	gender: string;
	age: string;
	branch: {
		branch_name: string;
	};
};

export const columns: ColumnDef<StudentSemwise>[] = [
	{
		id: "slno",
		header: "Sl No",
		cell: ({ row }) => row.index + 1
	},
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "usn", header: "USN" },
	{ accessorKey: "gender", header: "Gender" },
	{ accessorKey: "dob", header: "DOB" },
	{ accessorKey: "category", header: "Category" },
	{
		accessorFn: (row) => row.branch?.branch_name,
		id: "branch",
		header: "Branch",
		cell: ({ row }) => row.original.branch?.branch_name ?? "-"
	},

	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const student = row.original;

			return (
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" size="sm">
							<Edit className="w-4 h-4 mr-2" />
							Edit
						</Button>
					</DialogTrigger>

					<DialogContent className="max-w-xl">
						<StudentForm docId={student.documentId} />
					</DialogContent>
				</Dialog>
			);
		}
	}
];
