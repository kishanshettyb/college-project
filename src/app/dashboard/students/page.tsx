"use client";

import * as React from "react";
import {
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSemwise, columns } from "./column";
import { StudentDataTableSemwise } from "@/components/studentsListSemwise";
import { useGetAllStudentsSemwise } from "@/services/queries/student/student";

export default function Page() {
	const { data, isLoading, isError } = useGetAllStudentsSemwise();

	// ✅ Make sure the path matches your API response
	const statusesData: StudentSemwise[] = data?.data?.data ?? [];

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [globalFilter, setGlobalFilter] = React.useState("");

	const table = useReactTable({
		data: statusesData,
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

	// ✅ Apply global filter to all filterable columns
	React.useEffect(() => {
		table.getAllColumns().forEach((column) => {
			if (column.getCanFilter()) {
				column.setFilterValue(globalFilter || undefined);
			}
		});
	}, [globalFilter, table]);

	return (
		<>
			<div className="w-full px-2 lg:px-10 mb-50">
				<StudentDataTableSemwise data={statusesData} isLoading={isLoading} isError={isError} />
			</div>
		</>
	);
}
