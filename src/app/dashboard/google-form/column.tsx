"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
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
	grade: string;
	branch: string;
	bec601: number;
	bec602: number;
	bec685: number;
	becl606: number;
	bnsk658: number;
	biks609: number;
	bec613b: number;
	bis654c: number;
	becl657d: number;
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
				"776f29d590a26aa8f3e002f92fa77f760b68eaa24813321a23ebb439ff05274976cb1d9005cf986487c75a6549249737be707455766703911c395e9950180b408a09c9ee38732fde27a2d7d56bba6819cfc96f8d21e141ebe0abf6b83cbba4c6395d09949ddee33a019ce3c6d8ff59be241feacbff4d3582fb2dcdca82eb66ad";

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
				<Button variant="outline" className="text-xs  cursor-pointer text-red-600 flex items-center gap-1">
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
	// { accessorKey: "id", header: "ID" },
	// { accessorKey: "documentId", header: "Document ID" },
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "usn", header: "USN" },
	{ accessorKey: "gender", header: "Gender" },
	{ accessorKey: "category", header: "Category" },
	{ accessorKey: "sem", header: "Semester" },
	{ accessorKey: "branch", header: "Branch" },
	{ accessorKey: "bec601", header: "bec601" },
	{ accessorKey: "bec602", header: "bec602" },
	{ accessorKey: "bec685", header: "bec685" },
	{ accessorKey: "becl606", header: "becl606" },
	{ accessorKey: "bnsk658", header: "bnsk658" },
	{ accessorKey: "biks609", header: "biks609" },
	{ accessorKey: "bec613b", header: "bec613b" },
	{ accessorKey: "bis654c", header: "bis654c" },
	{ accessorKey: "becl657d", header: "becl657d" },
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
	{ accessorKey: "grade", header: "grade" },
	{ accessorKey: "percentage", header: "Percentage" },
	{ accessorKey: "SGPA", header: "SGPA" },
	{ accessorKey: "CGPA", header: "CGPA" },
	{
		id: "actions",
		header: "Action",
		cell: ({ row }) => (
			<div className="flex justify-center gap-5 items-center">
				<Button variant="outline" className="cursor-pointer">
					<Edit size={14} /> Edit
				</Button>
				<DeleteButton id={row.original.documentId} />
			</div>
		),
		enableSorting: false
	}
];
