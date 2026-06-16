import { CreateOrderItemPayload, CreateOrderPayload, Order, OrderItem, UpdateOrderPayload } from "~/types/order";
import axiosClient from "./axiosClient";

interface CartItemInput {
	id: number | string;
	price: number | string;
	quantity: number;
	selectedColor?: string | null;
	variantId?: number;
}

export const orderService = {
	getMyOrders: async (): Promise<Order[]> => {
		return axiosClient.get("/orders/my-orders");
	},

	getOrderById: async (id: number): Promise<Order> => {
		return axiosClient.get(`/orders/${id}`);
	},

	createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
		return axiosClient.post("/orders", payload);
	},

	createOrderItem: async (payload: CreateOrderItemPayload): Promise<OrderItem> => {
		return axiosClient.post("/order-items", payload);
	},

	updateOrder: async (id: number, payload: UpdateOrderPayload): Promise<Order> => {
		return axiosClient.patch(`/orders/${id}`, payload);
	},

	cancelOrder: async (id: number, note: string = "Customer cancelled order"): Promise<Order> => {
		return axiosClient.patch(`/orders/${id}`, {
			status: "Cancelled",
			note,
		});
	},

	createFullOrder: async (params: {
		userId: number;
		addressId: number;
		totalAmount: number;
		subtotal: number;
		taxAmount: number;
		shippingCost: number;
		items: CartItemInput[];
		scheduledDeliveryDate?: string | null;
		paymentMethod?: 'COD' | 'VNPAY';
		discount?: number;
		shippingDiscount?: number;
		appliedCouponCode?: string;
		appliedShippingCouponCode?: string;
	}): Promise<Order> => {
		const orderNo = `ORD-${Date.now()}`;

		const newOrder = await orderService.createOrder({
			orderNo: orderNo,
			customerId: params.userId,
			addressId: params.addressId,
			status: "Pending",
			totalAmount: params.totalAmount,
			subtotal: params.subtotal,
			taxAmount: params.taxAmount,
			shippingCost: params.shippingCost,
			scheduledDeliveryDate: params.scheduledDeliveryDate ?? undefined,
			note: "Ordered via website",
			paymentMethod: params.paymentMethod ?? 'COD',
			discount: params.discount ?? 0,
			shippingDiscount: params.shippingDiscount ?? 0,
			appliedCouponCode: params.appliedCouponCode,
			appliedShippingCouponCode: params.appliedShippingCouponCode,
		});

		if (!newOrder || !newOrder.id) {
			throw new Error("Failed to retrieve new order ID.");
		}

		const isVnpay = params.paymentMethod === 'VNPAY';
		const createItemPromises = params.items.map(item =>
			orderService.createOrderItem({
				orderId: newOrder.id,
				productId: Number(item.id),
				colorId: item.selectedColor || undefined,
				unitPrice: Number(item.price),
				quantity: item.quantity,
				variantId: item.variantId,
				skipStockDecrement: isVnpay,
			}),
		);
		await Promise.all(createItemPromises);

		if (params.paymentMethod !== 'VNPAY') {
			try {
				await axiosClient.post(`/orders/${newOrder.id}/confirmation`);
			} catch (error) {
				console.error("Failed to trigger email confirmation:", error);
			}
		}

		return newOrder;
	},


	createVnpayUrl: async (orderId: number): Promise<{ paymentUrl: string }> => {
		return axiosClient.post(`/payments/create-url/${orderId}`);
	},


	createVnpayCheckout: async (params: any): Promise<{ paymentUrl: string }> => {
		return axiosClient.post("/payments/vnpay-checkout", params);
	},
};

