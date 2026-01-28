import axiosClient from "./axiosClient";
import { Order, OrderItem, CreateOrderPayload, CreateOrderItemPayload, UpdateOrderPayload } from "~/types/order";

interface CartItemInput {
	id: number | string;
	price: number | string;
	quantity: number;
	selectedColor?: string | null;
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
		items: CartItemInput[];
	}): Promise<Order> => {
		const orderNo = `ORD-${Date.now()}`;

		const newOrder = await orderService.createOrder({
			orderNo: orderNo,
			customerId: params.userId,
			addressId: params.addressId,
			status: "Pending",
			discount: 0,
			totalAmount: params.totalAmount,
			note: "Ordered via website",
		});

		if (!newOrder || !newOrder.id) {
			throw new Error("Failed to retrieve new order ID.");
		}

		const createItemPromises = params.items.map(item =>
			orderService.createOrderItem({
				orderId: newOrder.id,
				productId: Number(item.id),
				colorId: item.selectedColor || undefined,
				unitPrice: Number(item.price),
				quantity: item.quantity,
			}),
		);
		await Promise.all(createItemPromises);

		try {
			await axiosClient.post(`/orders/${newOrder.id}/confirmation`);
		} catch (error) {
			console.error("Failed to trigger email confirmation:", error);
		}

		return newOrder;
	},
};
