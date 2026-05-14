import axiosClient from "./axiosClient";
import { FlashSale } from "~/types/flashSale";

export const flashSaleService = {
	getActive: async (): Promise<FlashSale | null> => {
		try {
			return await axiosClient.get("/flash-sales/active");
		} catch {
			return null;
		}
	},
};
