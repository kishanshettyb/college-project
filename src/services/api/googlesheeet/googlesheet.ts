import { Googlesheet } from "@/types/googlesheet";
import axios from "axios";

const token =
	"a7be0941b29ba54f3cb9de531510f14ef0114a9211fb3c2c305af6d14e5ee8cfb66f7d968dae98cefc0620101fe8015a398e07a09ab73013ef227404a12d9023ce230938920a853e7d6eb248759e034369dd5b84c549f830644ab78f82a0ce252cf64ba515d8b58edc4826491df0607ea8887ac8beaab691b50e820a56dfd6b9";
const axiosInstance = axios.create({
	baseURL: "https://makemystatus-strapi.onrender.com/api/",

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
