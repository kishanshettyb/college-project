"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type Student = {
	id: number;
	documentId: string;
	name: string;
	usn: string;
	gender: string;
	category: string;
	sem: number;
	branch: string;
	bec601: number;
	bec602: number;
	bec603: number;
	bec604: number;
	bec605: number;
	result: string;
	percentage: number;
	SGPA: number;
	CGPA: number;
};

function DeleteButton({ id }: { id: string }) {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);

	const deleteMutation = useMutation({
		mutationFn: async () => {
			const token =
				"12d13571e5947b9ec21457489401841437ded97d80f50ff715670a5fcc44974d78d75189bb925c75bb47ebbaae21d2b08d9ae5a677fbf7d9081eef7af59d61775d67764fff4729af7d3f38aedd229e1df7b6ab8eb0b0ffee0543ae00e25c5d20a06137b17cccec16569b9d2416b896d177c4e93ebd37a53997e96ab65caaaf11";

			const response = await fetch(`https://light-birds-a8f47896af.strapiapp.com/api/googlesheets/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}` // Replace with actual token if needed
				}
			});

			if (!response.ok) {
				throw new Error("Failed to delete student");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["googlesheet"] });
			toast.success("successfully deleted data.");
			setOpen(false);
		}
	});

	const handleConfirmDelete = () => {
		deleteMutation.mutate();
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="outline" className="text-xs text-red-600 flex items-center gap-1">
					<Trash size={14} /> Delete
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure you want to delete this record?</AlertDialogTitle>
					<AlertDialogDescription>This action cannot be undone. Once deleted, the record will be permanently removed.</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={deleteMutation.isLoading}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirmDelete} disabled={deleteMutation.isLoading}>
						{deleteMutation.isLoading ? "Deleting..." : "Continue"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export const columns: ColumnDef<Student>[] = [
	{
		id: "slno",
		header: "Sl No",
		cell: ({ row }) => row.index + 1
	},
	{ accessorKey: "id", header: "ID" },
	{ accessorKey: "documentId", header: "Document ID" },
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "usn", header: "USN" },
	{ accessorKey: "gender", header: "Gender" },
	{ accessorKey: "category", header: "Category" },
	{ accessorKey: "sem", header: "Semester" },
	{ accessorKey: "branch", header: "Branch" },
	{ accessorKey: "bec601", header: "Bec601" },
	{ accessorKey: "bec602", header: "Bec602" },
	{ accessorKey: "bec603", header: "Bec603" },
	{ accessorKey: "bec604", header: "Bec604" },
	{ accessorKey: "bec605", header: "Bec605" },
	{
		accessorKey: "result",
		header: "Result",
		cell: ({ getValue }) => {
			const result = String(getValue() ?? "").toLowerCase();
			const borderColor = result === "pass" ? "border-green-200" : "border-red-200";
			const bgColor = result === "pass" ? "bg-green-50" : "bg-red-50";
			const textColor = result === "pass" ? "text-green-500" : "text-red-500";

			return <div className={`border text-center rounded-xl px-2 py-1 text-sm ${bgColor} ${textColor} ${borderColor}`}>{result.toUpperCase()}</div>;
		}
	},
	{ accessorKey: "percentage", header: "Percentage" },
	{ accessorKey: "SGPA", header: "SGPA" },
	{ accessorKey: "CGPA", header: "CGPA" },
	{
		id: "actions",
		header: "Action",
		cell: ({ row }) => <DeleteButton id={row.original.documentId} />,
		enableSorting: false
	}
];
