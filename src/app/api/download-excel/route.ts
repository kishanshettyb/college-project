import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const fileName = searchParams.get("file");

		if (!fileName) {
			return NextResponse.json({ message: "File name is required" }, { status: 400 });
		}

		// Security: Prevent directory traversal
		const safeFileName = path.basename(fileName);
		if (!safeFileName.match(/\.(xlsx|xls|csv)$/i)) {
			return NextResponse.json({ message: "Invalid file type" }, { status: 400 });
		}

		const filePath = path.join(process.cwd(), "public", "export", safeFileName);

		// Check if file exists
		try {
			await fs.access(filePath);
		} catch {
			return NextResponse.json({ message: "File not found" }, { status: 404 });
		}

		// Read file
		const fileBuffer = await fs.readFile(filePath);
		const stats = await fs.stat(filePath);

		// Return file with proper headers
		const headers = new Headers();
		headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		headers.set("Content-Length", stats.size.toString());
		headers.set("Content-Disposition", `attachment; filename="${safeFileName}"`);

		return new NextResponse(fileBuffer, { headers });
	} catch (err: any) {
		console.error("Error downloading file:", err);
		return NextResponse.json({ message: "Error downloading file", error: err.message }, { status: 500 });
	}
}
