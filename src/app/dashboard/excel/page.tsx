"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Loader2, RefreshCw } from "lucide-react";
import moment from "moment";

interface ExcelFile {
	name: string;
	date: string;
	url: string;
}

export default function ExcelPage() {
	const [files, setFiles] = React.useState<ExcelFile[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [downloading, setDownloading] = React.useState<string | null>(null);

	const fetchFiles = React.useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch("/api/list-excel");

			if (!res.ok) {
				throw new Error(`Failed to fetch: ${res.status}`);
			}

			const data: ExcelFile[] = await res.json();
			setFiles(data);
		} catch (err: any) {
			console.error("Failed to fetch files", err);
			setError(err.message || "Failed to load files");
			setFiles([]);
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		fetchFiles();
	}, [fetchFiles]);

	const handleDownload = async (fileName: string) => {
		try {
			setDownloading(fileName);

			// Using the API route for download (optional, you can keep direct link too)
			const response = await fetch(`/api/download-excel?file=${encodeURIComponent(fileName)}`);

			if (!response.ok) {
				throw new Error("Download failed");
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (err) {
			console.error("Download error:", err);
			// Fallback to direct link
			window.open(`/export/${fileName}`, "_blank");
		} finally {
			setDownloading(null);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<Loader2 className="animate-spin h-8 w-8" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center min-h-[400px]">
				<Image src="/images/error.png" alt="Error" width={200} height={200} className="mb-4" />
				<h2 className="text-xl font-semibold mb-2">Error Loading Files</h2>
				<p className="text-gray-600 mb-4">{error}</p>
				<Button onClick={fetchFiles}>
					<RefreshCw className="mr-2 h-4 w-4" />
					Retry
				</Button>
			</div>
		);
	}

	if (files.length === 0) {
		return (
			<div className="flex flex-col justify-center items-center min-h-[400px]">
				<Image src="/images/nodata.jpg" alt="No Data found" width={400} height={400} className="mb-4" />
				<h2 className="text-2xl font-semibold mb-2">No Excel Files Found</h2>
				<p className="text-gray-600">Upload or generate Excel files to see them here.</p>
			</div>
		);
	}

	return (
		<div className="mb-50 p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Excel Files</h1>
				<Button onClick={fetchFiles} variant="outline">
					<RefreshCw className="mr-2 h-4 w-4" />
					Refresh
				</Button>
			</div>

			<div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
				{files.map(({ name, date, url }) => (
					<Card key={name} className="overflow-hidden flex flex-col">
						<div className="p-4 border-b">
							<div className=" relative">
								<Image alt="Excel icon" className="object-cover" src="/images/excel.png" width="300" height="300" />
							</div>
						</div>
						<div className="p-4 flex-grow">
							<p className="text-sm mb-2">
								<span className="font-semibold">Date:</span> <span className="text-blue-500">{moment(date).format("MMM DD, YYYY")}</span>
							</p>
							<p className="text-sm">
								<span className="font-semibold">Time:</span> <span className="text-blue-500">{moment(date).format("hh:mm A")}</span>
							</p>
							<div className="mt-3">
								<p className="text-xs text-gray-500 mb-1">File Name:</p>
								<p className="text-sm font-medium break-all line-clamp-2">{name}</p>
							</div>
						</div>
						<div className="p-4 border-t">
							<Button className="w-full" size="sm" onClick={() => handleDownload(name)} disabled={downloading === name}>
								{downloading === name ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
								{downloading === name ? "Downloading..." : "Download"}
							</Button>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
