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
			showNotification("Không thể tải chi tiết đơn hàng.", "error");
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
			showNotification("Huỷ đơn hàng thành công.", "success");
		} catch (error) {
			showNotification("Huỷ đơn hàng thất bại.", "error");
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
