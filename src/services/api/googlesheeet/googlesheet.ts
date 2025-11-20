import { Googlesheet } from "@/types/googlesheet";
import axios from "axios";

const token = process.env.NEXT_PUBLIC_TOKEN;
const axiosInstance = axios.create({
	baseURL: "https://light-birds-a8f47896af.strapiapp.com/api/",

	headers: {
		Authorization: `Bearer ${token}`
	}
});
export const getAllGoogleSheet = async () => {
	return await axiosInstance.get<Googlesheet[]>(`googlesheets?populate=*&pagination[limit]=2000&sort=createdAt:desc`);
};

export const getGoogleSheet = async (documentId: string) => {
	return await axiosInstance.get(`googlesheets/${documentId}?populate=*&pagination[limit]=2000&sort=createdAt:desc`);
};

export const deleteGoogleSheet = async (documentId: string) => {
	return await axiosInstance.delete(`googlesheets/${documentId}`);
};
