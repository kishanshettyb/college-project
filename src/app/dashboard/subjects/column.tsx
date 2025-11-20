"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";

export type Subject = {
	id: number;
	documentId: string;
	sub_code: string;
	semister: string;
	branch: {
		branch_name: string;
	};
};

// ⬇ Now columns take a function
export const getColumns = (onEdit: (documentId: string) => void): ColumnDef<Subject>[] => [
	{
		id: "slno",
		header: "Sl No",
		cell: ({ row }) => row.index + 1
	},
	{
		id: "documentId",
		header: "Id",
		cell: ({ row }) => row.original.documentId
	},
	{ accessorKey: "sub_code", header: "Subject Code" },
	{
		accessorFn: (row) => row.semister,
		id: "semister",
		header: "Semester",
		cell: ({ row }) => <div className="uppercase">{row.original.semister}</div>
	},
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
			<Button variant="outline" onClick={() => onEdit(row.original.documentId)}>
				<Edit size={14} /> Edit
			</Button>
		),
		enableSorting: false
	}
];
