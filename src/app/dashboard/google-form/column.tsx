"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MinusIcon, PlusIcon, Trash } from "lucide-react";
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
			const token = process.env.NEXT_PUBLIC_TOKEN;

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
	// {
	// 	id: "subjects",
	// 	header: "Subjects",
	// 	cell: ({ row }) => {
	// 		const student = row.original;

	// 		// Pick only subject keys (all lowercase code keys starting with 'ec', 'be', etc.)
	// 		const subjectEntries = Object.entries(student).filter(
	// 			([key, value]) => key.match(/^[a-z]{2,5}[0-9]{2,5}$/i) // matches ecs001, bec601, bis654c etc.
	// 		);

	// 		return (
	// 			<div className="text-xs space-y-1">
	// 				{subjectEntries.length === 0 && <span>No Subjects</span>}
	// 				{subjectEntries.map(([key, value]) => (
	// 					<div key={key} className="flex border p-1 rounded-2xl justify-between gap-2">
	// 						<span className="font-medium text-xs">{key.toUpperCase()}</span>
	// 						<span>{value}</span>
	// 					</div>
	// 				))}
	// 			</div>
	// 		);
	// 	}
	// },
	{
		id: "subjects",
		header: "Subjects",
		cell: ({ row }) => {
			const student = row.original;

			// pick subject keys dynamically
			const subjectEntries = Object.entries(student).filter(([key]) => /^[a-z]{2,6}[0-9]{2,5}$/i.test(key));

			const [open, setOpen] = useState(false);

			return (
				<div className="text-xs">
					{/* Toggle Button */}
					<button onClick={() => setOpen(!open)} className="px-2 py-1 text-white bg-slate-900 rounded-md text-xs">
						{open ? (
							<div className="flex items-center">
								<MinusIcon size="15" />
								Hide Subjects
							</div>
						) : (
							<div className="flex items-center">
								<PlusIcon size="15" />
								View Subjects ({subjectEntries.length})
							</div>
						)}
					</button>

					{/* Expandable Section */}
					{open && (
						<div className="mt-2 space-y-1 border rounded-md p-2 bg-slate-50 max-h-48 overflow-y-auto">
							{subjectEntries.map(([code, mark]) => (
								<div key={code} className="flex justify-between gap-2 border px-2 py-1 rounded-xl bg-white">
									<span className="font-semibold">{code.toUpperCase()}</span>
									<span>{mark}</span>
								</div>
							))}
						</div>
					)}
				</div>
			);
		}
	},

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
	{ accessorKey: "CGPA", header: "CGPA" }
];
