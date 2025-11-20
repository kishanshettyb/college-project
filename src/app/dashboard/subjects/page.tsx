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
import { StudentDataTableSemwise } from "@/components/studentsListSemwise";
import { useGetAllStudentsSemwise } from "@/services/queries/student/student";
import { StudentSemwise, columns } from "../students/column";
import { SubjectDataTable } from "@/components/subjectDataTable";
import { useGetAllSubjects } from "@/services/queries/subjects/branch";

export default function SubjectPage() {
	const { data, isLoading, isError } = useGetAllSubjects();

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
			<header className="flex  lg:mt-0 h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="#">Google Form Data List</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Google Forms Data</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>

			<div className="w-full px-2 lg:px-10">
				<SubjectDataTable data={statusesData} isLoading={isLoading} isError={isError} />
			</div>
		</>
	);
}
