import axiosClient from "./axiosClient";
import {
	AdminProduct,
	CreateProductPayload,
	DashboardStats,
	AdminCustomer,
	AdminCategory,
	AdminOrder,
} from "~/types/admin";

export interface CreateColorPayload {
	productId: number;
	colorName: string;
	colorHex?: string;
}

export const adminService = {
	getStats(): Promise<DashboardStats> {
		return axiosClient.get("/admin/stats");
	},

	getCustomers(): Promise<AdminCustomer[]> {
		return axiosClient.get("/admin/customers");
	},

	getProducts(): Promise<AdminProduct[]> {
		return axiosClient.get("/admin/products");
	},

	getProductById(id: number | string): Promise<AdminProduct> {
		return axiosClient.get(`/products/${id}`);
	},

	getCategories(): Promise<AdminCategory[]> {
		return axiosClient.get("/admin/categories");
	},

	createProduct(payload: CreateProductPayload): Promise<AdminProduct> {
		return axiosClient.post("/admin/products", payload);
	},

	createProductColor(payload: CreateColorPayload): Promise<any> {
		return axiosClient.post("/product-colors", payload);
	},

	updateProduct(id: number, payload: Partial<CreateProductPayload>): Promise<AdminProduct> {
		return axiosClient.patch(`/products/${id}`, payload);
	},

	deleteProduct(id: number): Promise<void> {
		return axiosClient.delete(`/products/${id}`);
	},

	getOrders(): Promise<AdminOrder[]> {
		return axiosClient.get("/admin/orders");
	},

	updateOrderStatus(id: number, status: string): Promise<AdminOrder> {
		return axiosClient.patch(`/admin/orders/${id}/status`, { status });
	},
};
