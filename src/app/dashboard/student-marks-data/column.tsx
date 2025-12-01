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
import { use, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditStudent } from "@/components/editStudent";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Cookies from "js-cookie";

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
	batch: string;
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
	{ accessorKey: "batch", header: "Batch" },
	{
		id: "subjects",
		header: "Subjects",
		cell: ({ row }) => {
			const student = row.original;

			// match keys like bec601_internal, bec601_external, bec601_total
			// const subjectEntries = Object.entries(student).filter(([key]) => /^[a-z]{2,6}[0-9]{2,5}_(internal|external|total)$/i.test(key));
			const subjectEntries = Object.entries(student).filter(([key]) => /^[a-z0-9]+_(internal|external|total)$/i.test(key));

			// group by subject code
			const groupedSubjects: Record<string, any> = {};
			// subjectEntries.forEach(([key, value]) => {
			// 	const [code, type] = key.split("_");
			// 	if (!groupedSubjects[code]) groupedSubjects[code] = {};
			// 	groupedSubjects[code][type] = value;
			// });
			subjectEntries.forEach(([key, value]) => {
				const [code, type] = key.split("_");
				const normalizedType = type.toLowerCase(); // FIX HERE
				if (!groupedSubjects[code]) groupedSubjects[code] = {};
				groupedSubjects[code][normalizedType] = value;
			});

			const [open, setOpen] = useState(false);

			return (
				<div className="text-xs">
					<button onClick={() => setOpen(!open)} className="px-2 py-1 text-white bg-slate-900 rounded-md text-xs">
						{open ? (
							<div className="flex items-center">
								<MinusIcon size={15} /> Hide Subjects
							</div>
						) : (
							<div className="flex items-center">
								<PlusIcon size={15} /> View Subjects ({Object.keys(groupedSubjects).length})
							</div>
						)}
					</button>

					{open && (
						<div className="mt-2 p-2 border rounded-md bg-slate-50 max-h-48 overflow-y-auto">
							{Object.entries(groupedSubjects).map(([code, marks]: any) => (
								<div key={code} className="border bg-white rounded-xl p-2 mb-2">
									<div className="font-bold text-sm mb-1">{code.toUpperCase()}</div>
									<div className="flex justify-between text-xs">
										<span>Internal: {marks.internal ?? "-"}</span>
										<span>External: {marks.external ?? "-"}</span>
										<span>
											Total: <b>{marks.total ?? "-"}</b>
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			);
		}
	},

	{
		accessorKey: "resultstatus",
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
	// { accessorKey: "CGPA", header: "CGPA" }
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const username = Cookies.get("username")?.replace(/"/g, "");
			const student = row.original.documentId;
			const usn = row.original.usn;
			const sem = "sem" + row.original.sem;

			return (
				<>
					{username == "superadmin" ? (
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline" size="sm">
									<Edit className="w-4 h-4 mr-2" />
									Edit
								</Button>
							</DialogTrigger>

							<DialogContent className="max-w-xl">
								<EditStudent studentId={student} semister={sem} usn={usn} />
							</DialogContent>
						</Dialog>
					) : (
						" "
					)}
				</>
			);
		}
	}
];
