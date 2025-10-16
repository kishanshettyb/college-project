import { ColumnDef } from "@tanstack/react-table";

export type Student = {
	id: number;
	name: string;
	usn: string;
	gender: string;
	category: string;
	sem: number;
	brnach: string;
	bec601: number;
	bec602: number;
	bec603: number;
	bec604: number;
	bec605: number;
	Result: string;
	Percentage: number;
	SGPA: number;
	CGPA: number;
};

export const columns: ColumnDef<Student>[] = [
	{
		id: "slno",
		header: "Sl No",
		cell: ({ row }) => row.index + 1 // static serial number starting from 1
	},
	// { accessorKey: "id", header: "ID" },
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
		cell: ({ row, getValue }) => {
			const result = getValue<string>().toLowerCase();
			const borderColor = result === "pass" ? "border-green-200" : "border-red-200";
			const bgColor = result === "pass" ? "bg-green-50" : "bg-red-50";
			const textColor = result === "pass" ? "text-green-500" : "text-red-500";

			return <div className={`border text-center  rounded-xl px-2 ${bgColor} ${textColor} ${borderColor} pl-2`}>{row.original.result}</div>;
		}
	},

	{ accessorKey: "percentage", header: "Percentage" },
	{ accessorKey: "SGPA", header: "SGPA" },
	{ accessorKey: "CGPA", header: "CGPA" }
];
