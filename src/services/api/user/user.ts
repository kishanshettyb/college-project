import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const REGISTER_URL = process.env.NEXT_PUBLIC_REGISTER_URL;
const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json"
	}
});
const axiosInstancenew = axios.create({
	baseURL: REGISTER_URL,
	headers: {
		"Content-Type": "application/json"
	}
});

export const adminLogin = async (payload: { identifier: string; password: string }) => {
	const response = await axiosInstance.post("local", payload);
	return response.data;
};

export const userRegister = async (payload: { username: string; email: string; password: string }) => {
	const response = await axiosInstancenew.post("register", payload);
	return response.data;
};
