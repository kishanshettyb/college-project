// marksApi.ts
import { Marks } from "@/types/marksTypes";
import axios from "axios";

const token = process.env.NEXT_PUBLIC_TOKEN;
const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
	baseURL: baseurl,
	headers: {
		Authorization: `Bearer ${token}`
	}
});

export const getAllMarks = async () => {
	return await axiosInstance.get<Marks[]>(`marks`);
};

// Add function to get marks by student and semester
export const getMarksByStudentAndSemester = async (studentId: string, semester: string) => {
	const response = await axiosInstance.get(`marks`, {
		params: {
			"filters[student][$eq]": studentId,
			"filters[semister][$eq]": semester,
			populate: "*"
		}
	});
	return response.data;
};

export const createMarks = async (data: Marks) => {
	const response = await axiosInstance.post("marks", data);
	return response.data;
};

export const updateMarks = async (data: Marks, documentId: string) => {
	return await axiosInstance.put(`marks/${documentId}`, {
		data
	});
};

// Add bulk create/update function
export const createOrUpdateBulkMarks = async (marks: Marks[], studentId: string, semester: string) => {
	// First, get existing marks for this student and semester
	const existingMarksResponse = await getMarksByStudentAndSemester(studentId, semester);
	const existingMarks = existingMarksResponse.data || [];

	console.log("Existing marks:", existingMarks);

	const results = [];

	for (const mark of marks) {
		// Find if this subject already has marks for this student and semester
		const existingMark = existingMarks.find((em: any) => em.attributes.subject?.data?.id === mark.subject || em.attributes.subject === mark.subject);

		if (existingMark) {
			// Update existing mark
			console.log("Updating existing mark:", existingMark.id, mark);
			const response = await updateMarks(mark, existingMark.id);
			results.push({ action: "updated", data: response });
		} else {
			// Create new mark
			console.log("Creating new mark:", mark);
			const response = await createMarks({ data: mark });
			results.push({ action: "created", data: response });
		}
	}

	return results;
};
