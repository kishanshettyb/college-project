import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
	try {
		const dirPath = path.join(process.cwd(), "public", "export");

		// Check if directory exists
		try {
			await fs.access(dirPath);
		} catch {
			// Directory doesn't exist, return empty array
			return NextResponse.json([]);
		}

		// Read directory
		const files = await fs.readdir(dirPath);

		// Filter for Excel files and get their stats
		const excelFiles = await Promise.all(
			files
				.filter((file) => file.match(/\.(xlsx|xls|csv)$/i))
				.map(async (file) => {
					const filePath = path.join(dirPath, file);
					const stats = await fs.stat(filePath);
					return {
						name: file,
						date: stats.mtime.toISOString(),
						url: `/export/${file}`
					};
				})
		);

		// Sort by date (newest first)
		excelFiles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return NextResponse.json(excelFiles);
	} catch (err: any) {
		console.error("Error listing Excel files:", err);
		return NextResponse.json({ message: "Error listing files", error: err.message }, { status: 500 });
	}
}
