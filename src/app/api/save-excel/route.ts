import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
	try {
		const { fileName, fileData } = await request.json();

		if (!fileName || !fileData) {
			return NextResponse.json({ message: "Missing fileName or fileData" }, { status: 400 });
		}

		const buffer = Buffer.from(fileData, "base64");

		// Ensure directory exists
		const dirPath = path.join(process.cwd(), "public", "export");
		await fs.mkdir(dirPath, { recursive: true });

		const savePath = path.join(dirPath, fileName);
		await fs.writeFile(savePath, buffer);

		return NextResponse.json({ message: "File saved", path: `/export/${fileName}` });
	} catch (err) {
		return NextResponse.json({ message: "Error saving file", error: err.message }, { status: 500 });
	}
}
