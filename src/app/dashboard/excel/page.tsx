import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import React from "react";

function page() {
	return (
		<div>
			<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="#">Exported Excel List</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Excel Data </BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>
			<div className="grid p-10  gap-5 grid-cols-2 md:grid-cols-5">
				<Card className="p-0">
					<div className="p-4">
						<Image alt="" width="1000" height="1000" className="w-[100%] h-[100%]" src="/Microsoft_Excel-Logo.wine.png" />
					</div>
					<div>
						<p className="text-center text-sm">
							File Name:<span className="text-blue-500">Form 1</span>
						</p>
					</div>
					<div className="flex border p-4 border-t-slate-200 border-x-0 border-b-0 justify-between items-center">
						<div>
							<p className="text-left text-sm">
								Date:<span className="text-blue-500">19-Aug-2025</span>
							</p>
						</div>
						<div>
							<p className="text-center text-sm">
								Status:<span className="text-blue-500">Active</span>
							</p>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}

export default page;
