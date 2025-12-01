import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
	try {
		const { fileName, fileData } = await request.json();

		if (!fileName || !fileData) {
			return NextResponse.json({ message: "Missing fileName or fileData" }, { status: 400 });
		}

		// Validate file name for security
		if (!fileName.match(/^[a-zA-Z0-9_\-\.]+\.(xlsx|xls|csv)$/i)) {
			return NextResponse.json({ message: "Invalid file name or type" }, { status: 400 });
		}

		const buffer = Buffer.from(fileData, "base64");

		// Ensure directory exists
		const dirPath = path.join(process.cwd(), "public", "export");
		await fs.mkdir(dirPath, { recursive: true });

		const savePath = path.join(dirPath, fileName);
		await fs.writeFile(savePath, buffer);

		return NextResponse.json({
			message: "File saved successfully",
			path: `/export/${fileName}`,
			fileName,
			downloadUrl: `/api/download-excel?file=${encodeURIComponent(fileName)}`
		});
	} catch (err: any) {
		console.error("Error saving file:", err);
		return NextResponse.json({ message: "Error saving file", error: err.message }, { status: 500 });
	}
}
