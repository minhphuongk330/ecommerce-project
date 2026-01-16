import axiosClient from "./axiosClient";
import { Product } from "~/types/product";

export interface FavoriteItem {
	id: number;
	customerId: number;
	productId: number;
	product: Product;
}

export const favoriteService = {
	getAll: async (): Promise<FavoriteItem[]> => {
		return await axiosClient.get("/favorites");
	},

	create: async (productId: number): Promise<FavoriteItem> => {
		return await axiosClient.post("/favorites", { productId });
	},

	delete: async (productId: number): Promise<void> => {
		return await axiosClient.delete(`/favorites/${productId}`);
	},
};
