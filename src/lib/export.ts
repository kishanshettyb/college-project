import fs from "fs";
import path from "path";

/**
 * Save given data to /public/data/ folder as a JSON file.
 * @param data - The array or object to save
 * @param userFileName - Optional custom name for file
 */
export const exportDataToFile = (data: any, userFileName?: string) => {
	try {
		// Ensure folder exists
		const folderPath = path.join(process.cwd(), "public", "data");
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true });
		}

		// Unique filename
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const fileName = `${userFileName || "googlesheet"}_${timestamp}.json`;
		const filePath = path.join(folderPath, fileName);

		// Write file
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

		console.log(`✅ Data exported: ${filePath}`);
		return { success: true, fileName };
	} catch (err: any) {
		console.error("❌ Export failed:", err.message);
		return { success: false, error: err.message };
	}
};
