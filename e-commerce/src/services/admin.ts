import {
	AdminCategory,
	AdminBrand,
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

	getContacts(): Promise<any[]> {
		return axiosClient.get("/admin/contacts");
	},

	resolveContact(id: number, adminReply: string): Promise<any> {
		return axiosClient.patch(`/admin/contacts/${id}/resolve`, { adminReply });
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

	getBrands(): Promise<AdminBrand[]> {
		return axiosClient.get("/brands");
	},

	createBrand(payload: { name: string; logoUrl?: string }): Promise<AdminBrand> {
		return axiosClient.post("/brands", payload);
	},

	updateBrand(id: number, payload: { name?: string; logoUrl?: string }): Promise<AdminBrand> {
		return axiosClient.patch(`/brands/${id}`, payload);
	},

	deleteBrand(id: number): Promise<void> {
		return axiosClient.delete(`/brands/${id}`);
	},

	createCategory(payload: { name: string }): Promise<AdminCategory> {
		return axiosClient.post("/categories", payload);
	},

	updateCategory(id: number, payload: { name?: string }): Promise<AdminCategory> {
		return axiosClient.patch(`/categories/${id}`, payload);
	},

	deleteCategory(id: number): Promise<void> {
		return axiosClient.delete(`/categories/${id}`);
	},

	getBanners(): Promise<any[]> {
		return axiosClient.get("/banners");
	},

	createBanner(payload: { title: string; content?: string; imageUrl: string; isActive?: boolean; displayType?: string }): Promise<any> {
		return axiosClient.post("/banners", payload);
	},

	updateBanner(id: number, payload: Partial<{ title: string; content: string; imageUrl: string; isActive: boolean; displayType: string }>): Promise<any> {
		return axiosClient.patch(`/banners/${id}`, payload);
	},

	deleteBanner(id: number): Promise<void> {
		return axiosClient.delete(`/banners/${id}`);
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

	updateFlashSale(
		id: number,
		payload: {
			title?: string;
			endsAt?: string;
			isActive?: boolean;
			items?: { id?: number; productId: number; salePrice: number; originalPrice: number; quantity: number }[];
		},
	): Promise<any> {
		return axiosClient.patch(`/flash-sales/${id}`, payload);
	},

	deleteFlashSale(id: number): Promise<void> {
		return axiosClient.delete(`/flash-sales/${id}`);
	},


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
