import axios from "axios";
import { getToken } from "../utility/tokenHelper";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	// timeout: 3000,
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = getToken();
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export async function userLogin(userData: { email: string; password: string }) {
	const res = await axiosInstance.post("auth/signin", userData);
	return res;
}

export async function userSignup(userData: { name: string; company: string; email: string; password: string }) {
	const res = await axiosInstance.post("auth/signup", userData);
	return res;
}

export async function getAllUsers() {
	const res = await axiosInstance.get("users/");
	return res;
}

export async function getUser() {
	const res = await axiosInstance.get("users/me");
	return res;
}

export async function updateUserStatus(users: number[], status: string) {
	const res = await axiosInstance.put(`users/update-status?status=${status}`, users);
	return res;
}

export async function updateUserLastSeen(lastSeen: Date) {
	const res = await axiosInstance.patch("users/update-last-seen", { data: lastSeen });
	return res;
}

export async function deleteUsers(users: number[]) {
	const res = await axiosInstance.delete("users/", { data: users });
	return res;
}
