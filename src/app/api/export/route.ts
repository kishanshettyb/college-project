import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
	try {
		const { data, fileName } = await req.json();

		const folderPath = path.join(process.cwd(), "public", "exports");
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true });
		}

		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const finalFileName = `${fileName || "student-data"}_${timestamp}.json`;
		const filePath = path.join(folderPath, finalFileName);

		fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

		return NextResponse.json({
			success: true,
			message: "File saved successfully",
			fileName: finalFileName,
			filePath: `/exports/${finalFileName}`
		});
	} catch (error: any) {
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
