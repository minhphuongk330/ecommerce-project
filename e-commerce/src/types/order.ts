import { Address } from "./address";
import { User } from "./auth";
import { Product } from "./product";

export type OrderStatus = "Pending" | "Shipped" | "Completed" | "Cancelled";

export interface OrderItem {
	id: number;
	orderId: number;
	productId: number;
	product?: Product;
	colorId?: string;
	unitPrice: string;
	quantity: number;
	createdAt?: string;
}

export interface Order {
	id: number;
	orderNo: string;
	customerId: number;
	customer?: User;
	addressId: number;
	address?: Address;
	status: OrderStatus;
	discount: string;
	totalAmount: string;
	note?: string;
	shippingCost?: number | string;
	scheduledDeliveryDate?: string;
	orderItems: OrderItem[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateOrderPayload {
	orderNo: string;
	customerId?: number;
	addressId: number;
	status?: OrderStatus;
	discount?: number;
	totalAmount?: number;
	note?: string;
	shippingCost?: number;
	scheduledDeliveryDate?: string;
}

export interface CreateOrderItemPayload {
	orderId: number;
	productId: number;
	colorId?: string;
	unitPrice: number;
	quantity: number;
	variantId?: number;
}

export interface UpdateOrderPayload {
	status?: OrderStatus;
	note?: string;
}
