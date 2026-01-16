import axiosClient from "./axiosClient";
import {
	Product,
	ProductDetail,
	ProductImage,
	ProductColor,
	CreateProductInput,
	CreateColorInput,
	CreateImageInput,
} from "~/types/product";

interface ProductParams {
	sort?: string;
	[key: string]: any;
}

export const productService = {
	getAll: async (params?: ProductParams): Promise<Product[]> => {
		return await axiosClient.get("/products", { params });
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

	getImages: async (): Promise<ProductImage[]> => {
		return await axiosClient.get("/product-images");
	},

	createImage: async (data: CreateImageInput) => {
		return await axiosClient.post("/product-images", data);
	},

	getColors: async (): Promise<ProductColor[]> => {
		return await axiosClient.get("/product-colors");
	},

	createColor: async (data: CreateColorInput) => {
		return await axiosClient.post("/product-colors", data);
	},
};
