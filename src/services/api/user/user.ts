import axios from "axios";
const BASE_URL = "https://light-birds-a8f47896af.strapiapp.com/api/auth/";
const REGISTER_URL = "https://light-birds-a8f47896af.strapiapp.com/api/auth/local/";
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
