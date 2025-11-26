"use client";

import * as React from "react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetAllGoogleSheet } from "@/services/queries/googlesheet/googlesheet";
import Result from "@/components/reports";

export default function Page() {
	const { data, isLoading, isError } = useGetAllGoogleSheet();

	return (
		<>
			<header className="flex mt-0 lg:mt-0 h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="md:block">
							<BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
					</BreadcrumbList>
				</Breadcrumb>
			</header>

			<div className="w-full">
				<Result data={data} />
			</div>
		</>
	);
}
