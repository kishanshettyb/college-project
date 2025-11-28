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
	const response = await axiosInstance.get(`marks?filters[student][documentId][$eq]=${studentId}&filters[semister][$eq]=${semester}&populate=*`);

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
	// Get existing marks for student + semester
	const existingMarksResponse = await getMarksByStudentAndSemester(studentId, semester);
	const existingMarks = existingMarksResponse.data || [];

	const results = [];

	for (const mark of marks) {
		// ❗ Match by subject ID or documentId based on your payload
		const existingMark = existingMarks.find(
			(em: any) =>
				em.subject?.documentId === mark.subject || // if frontend sends subject documentId
				em.subject?.id === mark.subject // if frontend sends subject numeric id
		);

		if (existingMark) {
			// Update existing mark using documentId (NOT id)

			const response = await updateMarks(mark, existingMark.documentId);

			results.push({
				action: "updated",
				id: existingMark.documentId,
				data: response
			});
		} else {
			// Create new mark

			const response = await createMarks({ data: mark });

			results.push({
				action: "created",
				data: response
			});
		}
	}

	return results;
};
