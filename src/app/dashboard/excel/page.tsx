"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Download, Loader2 } from "lucide-react";
import moment from "moment";
interface ExcelFile {
	name: string;
	date: string;
	url: string;
}

export default function ExcelPage() {
	const [files, setFiles] = React.useState<ExcelFile[]>([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		async function fetchFiles() {
			try {
				const res = await fetch("/api/list-excel");
				const data: ExcelFile[] = await res.json();
				setFiles(data);
			} catch (err) {
				console.error("Failed to fetch files", err);
			} finally {
				setLoading(false);
			}
		}
		fetchFiles();
	}, []);

	return (
		<div>
			<header className="flex h-16  shrink-0 items-center gap-2 border-b px-4">
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

			{loading ? (
				<div className="flex justify-center items-center w-full h-full">
					<Loader2 className="animate-spin" />
				</div>
			) : files.length === 0 ? (
				<div className="flex flex-col justify-center w-full h-full items-center ">
					<Image src="/images/nodata.jpg" alt="No Data found" width={500} height={500} className="w-[400px] h-[400px] object-cover" />
					<h2 className="text-2xl font-semibold">Sorry No Data Found</h2>
				</div>
			) : (
				<div className="grid p-4 gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-6">
					{files.map(({ name, date, url }) => (
						<Card key={name} className="overflow-hidden p-0">
							<div className="p-4 border border-x-0 border-t-0">
								<Image alt="Excel icon" width={1000} height={1000} className="w-full h-full" src="/images/excel.png" />
							</div>
							<div className="h-[100px] p-4">
								<p className="text-sm mb-5 font-semibold">
									Date: <span className="text-blue-500 font-light"> {moment(date).format("hh:mm:ss A")}</span>
								</p>
								<p className="text-left  text-sm font-semibold break-all ">
									File Name: <br />
									<span className="text-blue-500  font-light line-clamp-2">{name}</span>
								</p>
							</div>
							<div className="flex flex-col border p-4 border-t-slate-200 border-x-0 border-b-0 justify-between items-center">
								<Button className="w-full my-5" asChild size="lg" variant="default">
									<a href={url} download>
										<Download />
										Download
									</a>
								</Button>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
