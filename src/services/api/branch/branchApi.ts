import axios from "axios";
export type Branches = {
	branch_name?: string;
};

const token = process.env.NEXT_PUBLIC_TOKEN;
const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
	baseURL: baseurl,
	headers: {
		Authorization: `Bearer ${token}`
	}
});

export const getAllBranches = async () => {
	return await axiosInstance.get<Branches[]>(`branches`);
};
