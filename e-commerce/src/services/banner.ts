import axiosClient from "./axiosClient";
import { BannerData } from "~/types/banner";

const bannerService = {
	getAll: async (): Promise<BannerData[]> => {
		return await axiosClient.get("/banners");
	},

	getById: async (id: string): Promise<BannerData> => {
		return await axiosClient.get(`/banners/${id}`);
	},
};

export default bannerService;
