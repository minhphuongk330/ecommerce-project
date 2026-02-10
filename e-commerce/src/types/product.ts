import { CategoryShort } from "./category";
export interface ProductImage {
	id: number;
	productId: number;
	url: string;
	ordinal: number;
	isPrimary: boolean;
}
export interface ProductColor {
	id: number;
	productId: number;
	colorName: string;
	colorHex: string;
}
export interface Product {
	id: number;
	name: string;
	categoryId: number;
	category?: CategoryShort;
	shortDescription?: string;
	description?: string;
	price: number | string;
	stock: number;
	mainImageUrl: string;
	extraImage1?: string;
	extraImage2?: string;
	extraImage3?: string;
	extraImage4?: string;
	isActive: boolean;
	attribute?: string;
	isFavorite?: boolean;
	createdAt?: string;
	updatedAt?: string;
	collection?: "New Arrival" | "Bestseller" | "Featured Products" | "Discount";
}

export interface ProductDetail extends Product {
	productImages: ProductImage[];
	productColors: ProductColor[];
	capacities?: string[];
	originalPrice?: number;
	specs?: {
		screen: string;
		cpu: string;
		cores: string;
		main_camera: string;
		front_camera: string;
		battery: string;
		os?: string;
		ram?: string;
	};
	fullDescription?: string;
	details?: {
		category: string;
		items: {
			label: string;
			value: string | string[];
		}[];
	}[];
	attributes?: any;
}

export interface CreateProductInput {
	name: string;
	categoryId?: number;
	shortDescription?: string;
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
export interface CreateImageInput {
	productId: number;
	url: string;
	ordinal?: number;
	isPrimary?: boolean;
}
export interface CreateColorInput {
	productId: number;
	colorName: string;
	colorHex?: string;
}
export interface ProductSpecs {
	screen: string;
	cpu: string;
	cores: string;
	main_camera: string;
	front_camera: string;
	battery: string;
	os?: string;
	ram?: string;
}
