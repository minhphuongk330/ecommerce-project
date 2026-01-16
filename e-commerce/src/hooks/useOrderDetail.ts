import { useState, useEffect, useCallback } from "react";
import { orderService } from "~/services/order";
import { Order } from "~/types/order";
import { useNotification } from "~/contexts/Notification";

export const useOrderDetail = (orderId: number | null) => {
	const [order, setOrder] = useState<Order | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isCancelling, setIsCancelling] = useState(false);
	const { showNotification } = useNotification();

	const fetchOrder = useCallback(async () => {
		if (!orderId) return;

		try {
			setIsLoading(true);
			const data = await orderService.getOrderById(orderId);
			setOrder(data);
		} catch (error) {
			console.error("Failed to fetch order detail:", error);
			showNotification("Unable to load order details.", "error");
		} finally {
			setIsLoading(false);
		}
	}, [orderId, showNotification]);

	useEffect(() => {
		fetchOrder();
	}, [fetchOrder]);

	const cancelOrder = useCallback(async () => {
		if (!orderId || !order || isCancelling) return;

		try {
			setIsCancelling(true);
			const updatedOrder = await orderService.cancelOrder(orderId);
			setOrder(updatedOrder);
			showNotification("Order cancelled successfully.", "success");
		} catch (error) {
			console.error(error);
			showNotification("Failed to cancel order.", "error");
		} finally {
			setIsCancelling(false);
		}
	}, [orderId, order, isCancelling, showNotification]);

	return {
		order,
		isLoading,
		isCancelling,
		cancelOrder,
		refetch: fetchOrder,
	};
};
