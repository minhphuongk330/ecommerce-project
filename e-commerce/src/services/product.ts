import { CreateProductInput, Product, ProductDetail } from "~/types/product";
import axiosClient from "./axiosClient";

export interface ProductResponse {
	items: Product[];
	total: number;
}

export interface ProductParams {
	sort?: string;
	categoryId?: number;
	name?: string;
	page?: number;
	limit?: number;
	[key: string]: string | number | undefined;
}

export const PRODUCT_SYSTEM_PARAMS = ["sort", "categoryId", "name", "page", "minPrice", "maxPrice", "flashSale"];

export const productService = {
	getAll: async (params?: ProductParams): Promise<ProductResponse> => {
		const queryParams = { ...params };
		return await axiosClient.get("/products", { params: queryParams });
	},

	getPriceRange: async (categoryId?: number): Promise<{ minPrice: number; maxPrice: number }> => {
		return await axiosClient.get("/products/price-range", {
			params: categoryId ? { categoryId } : {},
		});
	},

	getByCollection: async (collection: string, limit = 8): Promise<Product[]> => {
		const response: ProductResponse = await axiosClient.get("/products", {
			params: { collection, limit },
		});
		const items = Array.isArray(response) ? response : response?.items || [];
		return items;
	},

	getById: async (id: number | string): Promise<ProductDetail> => {
		return await axiosClient.get(`/products/${id}`);
	},

	create: async (data: CreateProductInput): Promise<Product> => {
		return await axiosClient.post("/products", data);
	},

	update: async (id: number | string, data: Partial<CreateProductInput>): Promise<void> => {
		return await axiosClient.patch(`/products/${id}`, data);
	},

	delete: async (id: number | string): Promise<void> => {
		return await axiosClient.delete(`/products/${id}`);
	},

	getBestSellers: async (limit: number = 8): Promise<Product[]> => {
		try {
			console.log("Fetching best sellers (using Bestseller collection)...");
			const response: ProductResponse = await axiosClient.get("/products", {
				params: { collection: "Bestseller", limit }
			});

			const items = Array.isArray(response) ? response : response?.items || [];
			console.log("Best sellers items count:", items.length);
			return items;
		} catch (error) {
			console.error("Error in getBestSellers:", error);
			return [];
		}
	},
};
