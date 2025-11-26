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
	const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);
	const [branchFilter, setBranchFilter] = React.useState<string | null>(null);
	const [resultFilter, setResultFilter] = React.useState<string | null>(null); // "pass", "fail", or null
	const [gradeFilter, setGradeFilter] = React.useState<string | null>(null); // New grade filter
	const [pageSize, setPageSize] = React.useState(500);
	const [exportFileName, setExportFileName] = React.useState("student_data");

	// Utility to get timestamp string for export filename
	const getTimeStamp = () => {
		const now = new Date();
		return now.toISOString().replace(/[:-]/g, "").replace(/\..+/, "");
	};

	// Filtering logic
	const filteredData = React.useMemo(() => {
		let tempData = data;

		if (categoryFilter) {
			tempData = tempData.filter((student) => student.category === categoryFilter);
		}

		if (branchFilter) {
			tempData = tempData.filter((student) => student.branch === branchFilter);
		}

		if (semesterFilter) {
			const semNumber = parseInt(semesterFilter, 10);
			if (!isNaN(semNumber)) {
				tempData = tempData.filter((student) => {
					return parseInt(String(student.sem), 10) === semNumber;
				});
			}
		}

		if (resultFilter) {
			tempData = tempData.filter((student) => {
				const res = (student.result ?? "").toLowerCase();
				if (resultFilter === "pass") return res === "pass";
				if (resultFilter === "fail") return res === "fail";
				return true;
			});
		}

		// Grade filter added
		if (gradeFilter) {
			tempData = tempData.filter((student) => student.grade === gradeFilter);
		}

		if (globalFilter) {
			const lowercasedFilter = globalFilter.toLowerCase();
			tempData = tempData.filter((student) => student.name.toLowerCase().includes(lowercasedFilter) || student.usn.toLowerCase().includes(lowercasedFilter));
		}

		return tempData;
	}, [data, categoryFilter, branchFilter, semesterFilter, resultFilter, gradeFilter, globalFilter]);

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
			pagination: { pageIndex: 0, pageSize }
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

		const worksheet = XLSX.utils.json_to_sheet(exportData, {
			header: visibleColumns.map((c) => c.id)
		});
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
				<h2 className="font-semibold text-2xl">Student Marks Data</h2>
				<Dialog>
					<form onSubmit={(e) => e.preventDefault()}>
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
				<div className="grid grid-cols-2 lg:grid-cols-7 gap-5">
					<Input placeholder="Search by name or USN..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm" />

					<select className="border rounded-md px-3 py-2" value={categoryFilter ?? ""} onChange={(e) => setCategoryFilter(e.target.value || null)}>
						<option value="">All Categories</option>
						{[...new Set(data.map((d) => d.category))].map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>

					<select className="border rounded-md px-3 py-2" value={branchFilter ?? ""} onChange={(e) => setBranchFilter(e.target.value || null)}>
						<option value="">All Branches</option>
						{[...new Set(data.map((d) => d.branch))].map((branch) => (
							<option key={branch} value={branch}>
								{branch}
							</option>
						))}
					</select>

					<select
						className="border rounded-md px-3 py-2"
						value={semesterFilter ?? ""}
						onChange={(e) => {
							const val = e.target.value;
							setSemesterFilter(val === "" ? null : val);
						}}
					>
						<option value="">All Semesters.</option>
						{Array.from({ length: 8 }, (_, i) => (
							<option key={i + 1} value={(i + 1).toString()}>
								{i + 1} Semester
							</option>
						))}
					</select>

					<select className="border rounded-md px-3 py-2" value={resultFilter ?? ""} onChange={(e) => setResultFilter(e.target.value || null)}>
						<option value="">All Results</option>
						<option value="pass">Pass</option>
						<option value="fail">Fail</option>
					</select>

					{/* New Grade Filter */}
					<select className="border rounded-md px-3 py-2" value={gradeFilter ?? ""} onChange={(e) => setGradeFilter(e.target.value || null)}>
						<option value="">All Grades</option>
						{[...new Set(data.map((d) => d.grade))].map((g) => (
							<option key={g} value={g}>
								{g}
							</option>
						))}
					</select>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto w-full">
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
						) : table.getRowModel().rows.length ? (
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
