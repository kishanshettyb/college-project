"use client";

import { Button } from "@/components/ui/button";
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
	{ accessorKey: "age", header: "Category" },
	{
		accessorFn: (row) => row.branch?.branch_name,
		id: "branch",
		header: "Branch",
		cell: ({ row }) => row.original.branch?.branch_name ?? "-"
	},

	{
		id: "actions",
		header: "Action",
		cell: ({ row }) => (
			<div className="flex justify-center gap-5 items-center">
				<Button variant="outline" className="cursor-pointer">
					<Edit size={14} /> Edit
				</Button>
			</div>
		),
		enableSorting: false
	}
];
