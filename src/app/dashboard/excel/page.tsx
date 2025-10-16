"use client";

import React, { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ExcelFile {
	name: string;
	url: string;
	createdAt: string;
	status: string;
}

export default function Page() {
	const [files, setFiles] = useState<ExcelFile[]>([]);

	useEffect(() => {
		const fetchFiles = async () => {
			try {
				// ✅ Hit a local API route that reads files from /public/export
				const res = await fetch("/api/get-excel-files");
				const data = await res.json();
				console.log(data);
				setFiles(data.files || []);
			} catch (error) {
				console.error("Error fetching files:", error);
			}
		};
		fetchFiles();
	}, []);

	return (
		<div>
			{/* Header */}
			<header className="flex h-16 lg:mt-0 mt-10 shrink-0 items-center gap-2 border-b px-4">
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

			{/* Files List */}
			<div className="grid p-10 gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{files.length === 0 ? (
					<p className="text-center text-gray-500 col-span-full">No exported Excel files found.</p>
				) : (
					files.map((file, index) => (
						<Card key={index} className="p-0 shadow-md hover:shadow-lg transition">
							<div className="p-4">
								<Image alt="Excel File" width={1000} height={1000} className="w-full h-40 object-contain" src="/Microsoft_Excel-Logo.wine.png" />
							</div>

							<div className="px-4 pb-2">
								<p className="text-center text-sm font-semibold">
									File Name: <span className="text-blue-500">{file.name}</span>
								</p>
							</div>

							<div className="flex border-t p-4 justify-between text-sm text-gray-600">
								<p>
									Date: <span className="text-blue-500">{file.createdAt}</span>
								</p>
								<p>
									Status: <span className="text-green-600">{file.status}</span>
								</p>
							</div>

							<div className="flex justify-center pb-4">
								<Button onClick={() => window.open(file.url, "_blank")} className="w-[80%] mt-2 bg-green-600 hover:bg-green-700">
									Download
								</Button>
							</div>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
