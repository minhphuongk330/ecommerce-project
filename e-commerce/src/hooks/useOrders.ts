import { useEffect, useState } from "react";
import { orderService } from "~/services/order";
import { Order } from "~/types/order";

export const useOrders = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchOrders = async () => {
		try {
			setIsLoading(true);
			const data = await orderService.getMyOrders();
			setOrders(data);
		} catch (error) {
			console.error("Failed to fetch orders:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	return { orders, isLoading, fetchOrders };
};
