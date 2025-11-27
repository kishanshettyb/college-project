import { Subject } from "@/types/subjectType";
import axios from "axios";

const token = process.env.NEXT_PUBLIC_TOKEN;
const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
	baseURL: baseurl,
	headers: {
		Authorization: `Bearer ${token}`
	}
});

export const getAllSubjects = async () => {
	return await axiosInstance.get<Subject[]>(`subjects?populate=*&pagination[pageSize]=1000`);
};
export const getSubjectById = async (documentId: string) => {
	return await axiosInstance.get(`subjects/${documentId}?populate=*`);
};

export const createSubject = async (data: Subject) => {
	const response = await axiosInstance.post("subjects", data);
	return response.data;
};

export const updateSubject = async (data: Subject, documentId: string) => {
	return await axiosInstance.put(`subjects/${documentId}`, data);
};
