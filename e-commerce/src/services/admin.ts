import {
	AdminCategory,
	AdminCustomer,
	AdminOrder,
	AdminProduct,
	CreateProductPayload,
	DashboardStats,
} from "~/types/admin";
import axiosClient from "./axiosClient";

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

	deleteOrder(id: number): Promise<void> {
		return axiosClient.delete(`/admin/orders/${id}`);
	},

	deleteCustomer(id: number): Promise<void> {
		return axiosClient.delete(`/admin/customers/${id}`);
	},

	banCustomer(id: number): Promise<void> {
		return axiosClient.patch(`/admin/customers/${id}/ban`);
	},

	unbanCustomer(id: number): Promise<void> {
		return axiosClient.patch(`/admin/customers/${id}/unban`);
	},

	getOrders(): Promise<AdminOrder[]> {
		return axiosClient.get("/admin/orders");
	},

	updateOrderStatus(id: number, status: string): Promise<AdminOrder> {
		return axiosClient.patch(`/admin/orders/${id}/status`, { status });
	},

	getLowStockProducts(threshold: number): Promise<AdminProduct[]> {
		return axiosClient.get(`/admin/products/low-stock?threshold=${threshold}`);
	},

	// Flash Sales
	getFlashSales(): Promise<any[]> {
		return axiosClient.get("/flash-sales");
	},

	getFlashSaleById(id: number): Promise<any> {
		return axiosClient.get(`/flash-sales/${id}`);
	},

	createFlashSale(payload: {
		title: string;
		endsAt: string;
		isActive: boolean;
		items: { productId: number; salePrice: number; originalPrice: number; quantity: number }[];
	}): Promise<any> {
		return axiosClient.post("/flash-sales", payload);
	},

	updateFlashSale(id: number, payload: { title?: string; endsAt?: string; isActive?: boolean }): Promise<any> {
		return axiosClient.patch(`/flash-sales/${id}`, payload);
	},

	deleteFlashSale(id: number): Promise<void> {
		return axiosClient.delete(`/flash-sales/${id}`);
	},

	// Coupons
	getCoupons(): Promise<any[]> {
		return axiosClient.get("/coupons");
	},

	createCoupon(payload: {
		code: string;
		description: string;
		discountType: "percent" | "fixed";
		discountValue: number;
		minOrderValue?: number;
		maxDiscountAmount?: number;
		usageLimit?: number;
		expiresAt?: string;
		isActive?: boolean;
		showOnHomepage?: boolean;
	}): Promise<any> {
		return axiosClient.post("/coupons", payload);
	},

	updateCoupon(id: string, payload: Partial<{
		code: string;
		description: string;
		discountType: "percent" | "fixed";
		discountValue: number;
		minOrderValue: number;
		maxDiscountAmount: number;
		usageLimit: number;
		expiresAt: string;
		isActive: boolean;
		showOnHomepage: boolean;
	}>): Promise<any> {
		return axiosClient.patch(`/coupons/${id}`, payload);
	},

	deleteCoupon(id: string): Promise<void> {
		return axiosClient.delete(`/coupons/${id}`);
	},
};
