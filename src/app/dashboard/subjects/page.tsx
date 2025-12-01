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
import { StudentSemwise, columns } from "../students/column";
import { SubjectDataTable } from "@/components/subjectDataTable";
import { useGetAllSubjects } from "@/services/queries/subjects/branch";

export default function SubjectPage() {
	const { data, isLoading, isError } = useGetAllSubjects();
	const statusesData: StudentSemwise[] = data?.data?.data ?? [];

	return (
		<>
			<div className="w-full px-2 lg:px-10 mb-50">
				<SubjectDataTable data={statusesData} isLoading={isLoading} isError={isError} />
			</div>
		</>
	);
}
