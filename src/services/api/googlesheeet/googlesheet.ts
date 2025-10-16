import { Googlesheet } from "@/types/googlesheet";
import axios from "axios";

const token =
	"19ad7bc3af029bc7eca668471185ba647a167f6946f864414c739db67afd9240d7add2d0b19b27af232dcc091eec15cf72714996fb017b05dd4b7d3d3c08981b88fb44eb87787c6f60d186ffb8ea97d59fdb644cfcd3ed9c802b13a8190176c81931bfb8a3ef6802084aaecb711a27782e35e646b2406ce5f7c0a0a2e8db1ebe";
const axiosInstance = axios.create({
	baseURL: "https://light-birds-a8f47896af.strapiapp.com/api/",

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
