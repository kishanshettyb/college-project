import fs from "fs";
import path from "path";

export async function GET() {
	try {
		const exportDir = path.join(process.cwd(), "public", "export");
		const files = fs.readdirSync(exportDir).filter((file) => file.endsWith(".xlsx"));

		const fileData = files.map((file) => {
			const stats = fs.statSync(path.join(exportDir, file));
			return {
				name: file,
				url: `/export/${file}`, // static path
				createdAt: stats.mtime.toLocaleDateString(),
				status: "Active"
			};
		});

		return Response.json({ files: fileData });
	} catch (error) {
		console.error("Error reading files:", error);
		return Response.json({ files: [] });
	}
}
