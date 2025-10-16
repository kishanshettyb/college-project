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
import { ChevronDown, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Student, columns } from "@/app/dashboard/google-form/column";
import * as XLSX from "xlsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
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
	const [pageSize, setPageSize] = React.useState(500);
	const [exportFileName, setExportFileName] = React.useState("student_data");

	// Utility function to get timestamp string
	const getTimeStamp = () => {
		const now = new Date();
		return now.toISOString().replace(/[:-]/g, "").replace(/\..+/, "");
	};

	// Apply semester filter first
	const semesterFilteredData = React.useMemo(() => {
		if (!semesterFilter) return data;
		return data.filter((student) => student.sem === semesterFilter);
	}, [data, semesterFilter]);

	// Apply global filter (search by name or usn) on semesterFilteredData
	const filteredData = React.useMemo(() => {
		if (!globalFilter) return semesterFilteredData;
		const lowercasedFilter = globalFilter.toLowerCase();
		return semesterFilteredData.filter((student) => student.name.toLowerCase().includes(lowercasedFilter) || student.usn.toLowerCase().includes(lowercasedFilter));
	}, [semesterFilteredData, globalFilter]);

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
			rowSelection,
			pagination: { pageIndex: 0, pageSize } // Set default page size to 500
		},
		onPaginationChange: (updater) => {
			const newState = typeof updater === "function" ? updater({ pageIndex: 0, pageSize }) : updater;
			setPageSize(newState.pageSize);
		}
	});

	const handleExport = async () => {
		if (!exportFileName.trim()) {
			alert("Please enter a file name.");
			return;
		}

		const visibleColumns = table.getAllColumns().filter((col) => col.getIsVisible());
		const headers = visibleColumns.map((col) => col.columnDef.header ?? col.id);

		const exportData = table.getRowModel().rows.map((row) => {
			const rowData: Record<string, any> = {};
			visibleColumns.forEach((col) => {
				const val = row.getValue(col.id);
				rowData[col.id] = typeof val === "object" ? JSON.stringify(val) : val;
			});
			return rowData;
		});

		const worksheet = XLSX.utils.json_to_sheet(exportData, { header: visibleColumns.map((c) => c.id) });
		XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

		const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

		const uint8Array = new Uint8Array(wbout);
		let binary = "";
		for (let i = 0; i < uint8Array.byteLength; i++) {
			binary += String.fromCharCode(uint8Array[i]);
		}
		const base64Data = btoa(binary);

		// Append timestamp to filename before sending
		const filenameWithTimestamp = `${exportFileName.trim()}_${getTimeStamp()}.xlsx`;

		try {
			const response = await fetch("/api/save-excel", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fileName: filenameWithTimestamp, fileData: base64Data })
			});
			const json = await response.json();
			if (response.ok) {
				alert("File saved to server public folder as: " + json.path);
			} else {
				alert("Failed to save file: " + json.message);
			}
		} catch (error: any) {
			alert("Error uploading file: " + error.message);
		}
	};

	return (
		<div className="p-4 border rounded-xl my-10">
			<div className="flex justify-between items-center mb-5">
				<h2 className="font-semibold text-2xl">Student Data</h2>
				<Dialog>
					<form>
						<DialogTrigger asChild>
							<Button variant="default">
								<File />
								Export Data
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Export data to excel file</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4">
								<Input type="text" placeholder="Enter filename" value={exportFileName} onChange={(e) => setExportFileName(e.target.value)} className="max-w-xs" />
								<DialogClose asChild>
									<Button size="lg" onClick={handleExport} variant="default">
										Export Excel
									</Button>
								</DialogClose>
							</div>
						</DialogContent>
					</form>
				</Dialog>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 border p-4 my-5">
				<Input placeholder="Search by name or USN..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm" />

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
