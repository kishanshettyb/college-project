"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface ExcelFile {
	name: string;
	date: string;
	url: string;
}

export default function ExcelPage() {
	return (
		<div>
			<header className="flex h-16 mt-10 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator className="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="#">Exported Excel List</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Excel Data</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>

			<div className="grid p-10 gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
				<Card className="overflow-hidden p-0">
					<div className="p-4">
						<Image alt="" width="1000" height="1000" className="w-[100%] h-[100%]" src="/Microsoft_Excel-Logo.wine.png" />
					</div>
					<div>
						<p className="text-center text-sm">
							File Name: <span className="text-blue-500">test</span>
						</p>
					</div>
					<div className="flex border p-4 border-t-slate-200 border-x-0 border-b-0 justify-between items-center">
						<p className="text-sm">
							Date: <span className="text-blue-500">date</span>
						</p>
						<Button asChild size="sm" variant="outline">
							<a href="#" download>
								Download
							</a>
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
}
