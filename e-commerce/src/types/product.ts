import { CategoryShort } from "./category";

export interface ProductAttributes {
	[key: string]: string;
}

export interface Product {
	id: number;
	name: string;
	categoryId: number;
	category?: CategoryShort;
	description?: string;
	price: number | string;
	originalPrice?: number | string;
	installmentPrice?: number | string;
	memberPrice?: number | string;
	stock: number;
	stockStatus?: "in_stock" | "out_of_stock" | "contact";
	badgeLabel?: string;
	mainImageUrl: string;
	extraImage1?: string;
	extraImage2?: string;
	extraImage3?: string;
	extraImage4?: string;
	isActive: boolean;
	color?: string;
	specifications?: Record<string, any>;
	attributes?: ProductAttributes;
	isFavorite?: boolean;
	createdAt?: string;
	updatedAt?: string;
	isFeatured?: boolean;
	// Flash Sale fields
	isFlashSale?: boolean;
	flashSaleDiscount?: number;
}

export interface ProductDetail extends Product {
	originalPrice?: number;
	specifications?: Record<string, any>;
	fullDescription?: string;
	details?: {
		category: string;
		items: {
			label: string;
			value: string | string[];
		}[];
	}[];
}

export interface CreateProductInput {
	name: string;
	categoryId?: number;
	description?: string;
	price: number;
	stock?: number;
	mainImageUrl: string;
	extraImage1?: string;
	extraImage2?: string;
	extraImage3?: string;
	extraImage4?: string;
	isActive?: boolean;
}


