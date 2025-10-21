import { Googlesheet } from "@/types/googlesheet";
import axios from "axios";

const token =
	"12d13571e5947b9ec21457489401841437ded97d80f50ff715670a5fcc44974d78d75189bb925c75bb47ebbaae21d2b08d9ae5a677fbf7d9081eef7af59d61775d67764fff4729af7d3f38aedd229e1df7b6ab8eb0b0ffee0543ae00e25c5d20a06137b17cccec16569b9d2416b896d177c4e93ebd37a53997e96ab65caaaf11";
const axiosInstance = axios.create({
	baseURL: "https://light-birds-a8f47896af.strapiapp.com/api/",

	headers: {
		Authorization: `Bearer ${token}`
	}
});
export const getAllGoogleSheet = async () => {
	return await axiosInstance.get<Googlesheet[]>(`googlesheets?populate=*&pagination[limit]=2000`);
};

export const getGoogleSheet = async (documentId: string) => {
	return await axiosInstance.get(`googlesheets/${documentId}?populate=*&pagination[limit]=2000`);
};
