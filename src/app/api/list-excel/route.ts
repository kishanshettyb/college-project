import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
	try {
		const dirPath = path.join(process.cwd(), "public", "export");
		const files = await fs.readdir(dirPath);

		const fileStatsPromises = files.map(async (file) => {
			const filePath = path.join(dirPath, file);
			const stats = await fs.stat(filePath);
			return {
				name: file,
				date: stats.mtime.toISOString(),
				url: `/export/${file}`
			};
		});

		const fileStats = await Promise.all(fileStatsPromises);

		return NextResponse.json(fileStats);
	} catch (err) {
		return NextResponse.json({ error: "Failed to read export folder" }, { status: 500 });
	}
}
