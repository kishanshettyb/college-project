"use client";

import * as React from "react";
import {
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table";
import { ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Student, columns } from "@/app/dashboard/google-form/column";

interface DataTableProps {
	data: Student[];
	isLoading: boolean;
	isError: boolean;
}

export const StudentDataTable: React.FC<DataTableProps> = ({ data, isLoading, isError }) => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [semesterFilter, setSemesterFilter] = React.useState<string | null>(null);
	const [exporting, setExporting] = React.useState(false);

	const filteredData = React.useMemo(() => {
		let tempData = data;
		if (semesterFilter) {
			tempData = tempData.filter((student) => student.sem === semesterFilter);
		}
		return tempData;
	}, [data, semesterFilter]);

	const table = useReactTable({
		data: filteredData,
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

	// Apply global filter
	React.useEffect(() => {
		table.getAllColumns().forEach((column) => {
			if (column.getCanFilter()) {
				column.setFilterValue(globalFilter || undefined);
			}
		});
	}, [globalFilter, table]);

	// ✅ Export Function
	const handleExport = async () => {
		try {
			setExporting(true);
			const fileName = prompt("Enter file name (optional):") || "student-data";

			const res = await fetch("/api/export", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ data: filteredData, fileName })
			});

			const result = await res.json();
			if (result.success) {
				alert(`✅ Exported successfully as ${result.fileName}`);
			} else {
				alert(`❌ Failed: ${result.error}`);
			}
		} catch (err: any) {
			alert("❌ Error exporting data: " + err.message);
		} finally {
			setExporting(false);
		}
	};

	return (
		<div className="p-4 border rounded-xl my-10">
			<div className="flex justify-between items-center mb-5">
				<h2 className="font-semibold text-2xl">Student Data</h2>

				<Button onClick={handleExport} disabled={exporting} className="flex items-center gap-2">
					<Download className="w-4 h-4" />
					{exporting ? "Exporting..." : "Export Data"}
				</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 border p-4 my-5">
				<Input placeholder="Search all fields..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm" />

				<select className="border rounded-md px-3 py-2" value={semesterFilter ?? ""} onChange={(e) => setSemesterFilter(e.target.value || null)}>
					<option value="">All Semesters</option>
					{Array.from({ length: 8 }, (_, i) => (
						<option key={i + 1} value={`${i + 1}`}>
							{i + 1} Semester
						</option>
					))}
				</select>

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
							.map((column) => (
								<DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
									{column.id}
								</DropdownMenuCheckboxItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									Loading...
								</TableCell>
							</TableRow>
						) : isError ? (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
									Error loading data.
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
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

			{/* Pagination */}
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
	);
};
