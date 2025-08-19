import { ColumnDef } from "@tanstack/react-table";

export type Student = {
	id: number;
	name: string;
	usn: string;
	gender: string;
	category: string;
	sem: number;
	Bec601: number;
	Bec602: number;
	Bec603: number;
	Bec604: number;
	Bec605: number;
	Result: string;
	Percentage: number;
	SGPA: number;
	CGPA: number;
};

export const columns: ColumnDef<Student>[] = [
	{ accessorKey: "id", header: "ID" },
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "usn", header: "USN" },
	{ accessorKey: "gender", header: "Gender" },
	{ accessorKey: "category", header: "Category" },
	{ accessorKey: "sem", header: "Semester" },
	{ accessorKey: "Bec601", header: "Bec601" },
	{ accessorKey: "Bec602", header: "Bec602" },
	{ accessorKey: "Bec603", header: "Bec603" },
	{ accessorKey: "Bec604", header: "Bec604" },
	{ accessorKey: "Bec605", header: "Bec605" },
	{ accessorKey: "Result", header: "Result" },
	{ accessorKey: "Percentage", header: "Percentage" },
	{ accessorKey: "SGPA", header: "SGPA" },
	{ accessorKey: "CGPA", header: "CGPA" }
];
