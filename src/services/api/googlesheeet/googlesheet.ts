import { Googlesheet } from "@/types/googlesheet";
import axios from "axios";

const token = process.env.NEXT_PUBLIC_TOKEN;
const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,

	headers: {
		Authorization: `Bearer ${token}`
	}
});
export const getAllGoogleSheet = async () => {
	return await axiosInstance.get<Googlesheet[]>(`googlesheets?populate=*`);
};

export const getGoogleSheet = async (documentId: string) => {
	return await axiosInstance.get(`googlesheets/${documentId}?populate=*`);
};
