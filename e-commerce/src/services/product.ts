import {
	CreateColorInput,
	CreateImageInput,
	CreateProductInput,
	Product,
	ProductColor,
	ProductDetail,
	ProductImage,
} from "~/types/product";
import axiosClient from "./axiosClient";

interface ProductResponse {
	items: Product[];
	total: number;
}

interface ProductParams {
	sort?: string;
	categoryId?: number;
	name?: string;
	page?: number;
	limit?: number;
	[key: string]: any;
}

export const productService = {
  // Sửa kiểu trả về từ Promise<Product[]> thành Promise<ProductResponse>
  getAll: async (params?: ProductParams): Promise<ProductResponse> => {
    const queryParams = { ...params };
    return await axiosClient.get("/products", { params: queryParams });
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
