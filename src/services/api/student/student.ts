import { Student } from "@/types/studentTypes";
import axios from "axios";

const token = process.env.NEXT_PUBLIC_TOKEN;
const baseurl = process.env.NEXT_PUBLIC_BASE_URL;
const axiosInstance = axios.create({
	baseURL: baseurl,

	headers: {
		Authorization: `Bearer ${token}`
	}
});
export const getAllStudentsSemwise = async () => {
	return await axiosInstance.get<Student[]>(`students?populate=*&sort=createdAt:desc`);
};
export const getAllStudentsSemwiseById = async (documentId: string) => {
	return await axiosInstance.get<Student[]>(`students?filters[usn][$eq]=${documentId}&populate=branch`);
};

export const getStudent = async (documentId: string) => {
	return await axiosInstance.get(`students/${documentId}?populate=*&pagination[limit]=2000&sort=createdAt:desc`);
};

export const deleteStudent = async (documentId: string) => {
	return await axiosInstance.delete(`students/${documentId}`);
};

export const createStudent = async (data: Student) => {
	const response = await axiosInstance.post("students", data);
	return response.data;
};

export const updateStudent = async (data: Student, documentId: string) => {
	return await axiosInstance.put(`students/${documentId}`, {
		data
	});
};
