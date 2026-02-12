import axiosClient from "./axiosClient";
import { Product } from "~/types/product";

// Định nghĩa kiểu dữ liệu cho Variant (để UI hiển thị tên, giá của phiên bản)
export interface FavoriteVariant {
	id: number;
	sku: string;
	price: number;
	imageUrl?: string;
	options?: any;
}

export interface FavoriteItem {
	id: number;
	customerId: number;
	productId: number;
	variantId?: number | null;
	product: Product;
	variant?: FavoriteVariant | null;
}

export const favoriteService = {
	getAll: async (): Promise<FavoriteItem[]> => {
		return await axiosClient.get("/favorites");
	},

	create: async (productId: number, variantId?: number): Promise<FavoriteItem> => {
		return await axiosClient.post("/favorites", {
			productId,
			variantId,
		});
	},

	delete: async (productId: number, variantId?: number): Promise<void> => {
		const url = variantId ? `/favorites/${productId}?variantId=${variantId}` : `/favorites/${productId}`;
		return await axiosClient.delete(url);
	},
};
