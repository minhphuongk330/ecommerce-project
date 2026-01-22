import axiosClient from "./axiosClient";
import { Product } from "~/types/product";

export interface CartItemBackend {
	id: number;
	customerId: number;
	productId: number;
	quantity: number;
	color?: string;
	product: Product;
}

export const cartService = {
	getAll: async (): Promise<CartItemBackend[]> => {
		return await axiosClient.get("/cart");
	},

	create: async (productId: number, quantity: number, color?: string): Promise<CartItemBackend> => {
		return await axiosClient.post("/cart", {
			productId,
			quantity,
			color,
		});
	},

	update: async (id: number, quantity: number): Promise<void> => {
		return await axiosClient.patch(`/cart/${id}`, { quantity });
	},

	delete: async (id: number): Promise<void> => {
		return await axiosClient.delete(`/cart/${id}`);
	},

	clear: async (): Promise<void> => {
		return await axiosClient.delete("/cart");
	},
};
