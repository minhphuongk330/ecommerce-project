import axios from "axios";
import { useAuthStore } from "~/stores/useAuth";

const API_URL = "http://localhost:3001";

const axiosClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosClient.interceptors.request.use(
	config => {
		const accessToken = useAuthStore.getState().accessToken;
		if (accessToken && config.headers) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	error => Promise.reject(error)
);

axiosClient.interceptors.response.use(
	response => {
		return response.data;
	},
	async error => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken = useAuthStore.getState().refreshToken;
				if (!refreshToken) throw new Error("No refresh token available");

				const result = await axios.post(API_URL, {
					refreshToken: refreshToken,
				});

				const { accessToken } = result.data;
				useAuthStore.getState().setAccessToken(accessToken);
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return axiosClient(originalRequest);
			} catch (refreshError) {
				useAuthStore.getState().logout();
				if (typeof window !== "undefined") {
				}
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);

export default axiosClient;
