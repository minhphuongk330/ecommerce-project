import { Product } from "./product";

export interface FlashSaleItem {
	id: number;
	flashSaleId: number;
	productId: number;
	product: Product;
	salePrice: number;
	originalPrice: number;
	quantity: number;
	soldQuantity: number;
	createdAt: string;
}

export interface FlashSale {
	id: number;
	title: string;
	endsAt: string;
	isActive: boolean;
	items: FlashSaleItem[];
	createdAt: string;
	updatedAt: string;
}
