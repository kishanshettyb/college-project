"use client";
import ResultAdvanced from "@/components/result";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetAllGoogleSheet } from "@/services/queries/googlesheet/googlesheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";

function page() {
	const { data, isLoading, isError } = useGetAllGoogleSheet();

	return (
		<div className="bg-slate-50 h-full">
			<header className="flex lg:mt-0  h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator className="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="#">Google Form Data List</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Result Analysis</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>
			<div>
				<ResultAdvanced data={data} />
			</div>
		</div>
	);
}

export default page;
