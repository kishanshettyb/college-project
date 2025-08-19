"use client";

import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const data: Student[] = [
	{
		id: 1,
		name: "Krishna",
		usn: "1RV21CS001",
		gender: "Female",
		category: "ST",
		sem: 5,
		Bec601: 82,
		Bec602: 67,
		Bec603: 68,
		Bec604: 77,
		Bec605: 50,
		Result: "Pass",
		Percentage: 68.8,
		SGPA: 6.88,
		CGPA: 6.04
	},
	{
		id: 2,
		name: "Diya",
		usn: "1RV21CS002",
		gender: "Female",
		category: "ST",
		sem: 5,
		Bec601: 39,
		Bec602: 64,
		Bec603: 59,
		Bec604: 84,
		Bec605: 72,
		Result: "Pass",
		Percentage: 63.6,
		SGPA: 6.36,
		CGPA: 5.7
	},
	{
		id: 3,
		name: "Kabir",
		usn: "1RV18CS003",
		gender: "Female",
		category: "ST",
		sem: 6,
		Bec601: 45,
		Bec602: 75,
		Bec603: 63,
		Bec604: 30,
		Bec605: 97,
		Result: "Fail",
		Percentage: 62.0,
		SGPA: 6.2,
		CGPA: 5.97
	},
	{
		id: 4,
		name: "Diya",
		usn: "1RV20CS004",
		gender: "Female",
		category: "OBC",
		sem: 5,
		Bec601: 87,
		Bec602: 66,
		Bec603: 40,
		Bec604: 89,
		Bec605: 91,
		Result: "Pass",
		Percentage: 74.6,
		SGPA: 7.46,
		CGPA: 7.11
	}
	// ... add remaining 46 items
];

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
	{
		accessorKey: "id",
		header: "ID"
	},
	{
		accessorKey: "name",
		header: "Name"
	},
	{
		accessorKey: "usn",
		header: "USN"
	},
	{
		accessorKey: "gender",
		header: "Gender"
	},
	{
		accessorKey: "category",
		header: "Category"
	},
	{
		accessorKey: "sem",
		header: "Semester"
	},
	{
		accessorKey: "Bec601",
		header: "Bec601"
	},
	{
		accessorKey: "Bec602",
		header: "Bec602"
	},
	{
		accessorKey: "Bec603",
		header: "Bec603"
	},
	{
		accessorKey: "Bec604",
		header: "Bec604"
	},
	{
		accessorKey: "Bec605",
		header: "Bec605"
	},
	{
		accessorKey: "Result",
		header: "Result"
	},
	{
		accessorKey: "Percentage",
		header: "Percentage"
	},
	{
		accessorKey: "SGPA",
		header: "SGPA"
	},
	{
		accessorKey: "CGPA",
		header: "CGPA"
	}
];

export default function DataTableDemo() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection
		}
	});

	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="#">Goole Form Data List</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Forms Data </BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>

			<div className="w-full px-10">
				<div className="flex items-center py-4">
					<Input
						placeholder="Filter emails..."
						value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Columns <ChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="overflow-hidden rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<div className="text-muted-foreground flex-1 text-sm">
						{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className="space-x-2">
						<Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
							Previous
						</Button>
						<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
							Next
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
