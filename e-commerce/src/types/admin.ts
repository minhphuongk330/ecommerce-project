export interface DashboardStats {
	totalRevenue: number;
	todayOrders: number;
	totalOrders: number;
	totalCustomers: number;
	lowStockProducts: number;
}

export interface AdminCustomer {
	id: number;
	email: string;
	fullName: string;
	isActive: boolean;
	createdAt: string;
	role: string;
	profile?: {
		phoneNumber?: string;
		gender?: string;
		dateOfBirth?: string;
	};
}

export interface AdminCategory {
	id: number;
	name: string;
}

export interface AdminProduct {
	id: number;
	name: string;
	price: number;
	stock: number;
	mainImageUrl: string;
	isActive: boolean;
	category?: AdminCategory;
	categoryId?: number;
	description?: string;
	shortDescription?: string;
	extraImage1?: string;
	extraImage2?: string;
	extraImage3?: string;
	extraImage4?: string;
	productColors?: {
		id: number | string;
		colorName: string;
		colorHex: string;
	}[];
}

export interface CreateProductPayload {
	name: string;
	categoryId?: number;
	price: number;
	stock?: number;
	description?: string;
	shortDescription?: string;
	mainImageUrl: string;
	extraImage1?: string;
	extraImage2?: string;
	extraImage3?: string;
	extraImage4?: string;
	isActive?: boolean;
	colors?: {
		colorName: string;
		colorHex?: string;
	}[];
}

export interface AdminOrder {
	id: number;
	orderNo: string;
	status: string;
	totalAmount: number;
	createdAt: string;
	customer?: {
		fullName: string;
		email: string;
	};
}
