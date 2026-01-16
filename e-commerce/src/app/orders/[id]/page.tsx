"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { orderService } from "~/services/order";
import { Order } from "~/types/order";
import { useNotification } from "~/contexts/Notification";
import { routerPaths } from "~/utils/router";
import SingleBtn from "~/components/atoms/SingleBtn";
import OrderHeader from "~/components/Order/Detail/Header";
import OrderItems from "~/components/Order/Detail/Item";
import OrderAddress from "~/components/Order/Detail/Address";
import OrderSummary from "~/components/Order/Detail/Summary";

export default function OrderDetailPage() {
	const nav = useRouter();
	const params = useParams();
	const orderId = params?.id ? Number(params.id) : null;
	const { showNotification } = useNotification();
	const [order, setOrder] = useState<Order | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchOrder = async () => {
		if (!orderId) return;
		try {
			setIsLoading(true);
			const data = await orderService.getOrderById(orderId);
			setOrder(data);
		} catch (error) {
			console.error("Failed to fetch order detail:", error);
			showNotification("Unable to load order information.", "error");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchOrder();
	}, []);

	const handleCancelOrder = async () => {
		if (!orderId) return;
		try {
			const updatedOrder = await orderService.cancelOrder(orderId);
			setOrder(updatedOrder);
			showNotification("Order canceled successfully.", "success");
		} catch (error) {
			console.error(error);
			showNotification("Failed to cancel the order.", "error");
		}
	};

	const handleBack = () => {
		nav.push(routerPaths.order);
	};

	if (isLoading) return <div className="p-10 text-center text-gray-500">Loading order details...</div>;
	if (!order) return <div className="p-10 text-center text-red-500">Order not found.</div>;

	return (
		<div className="w-full max-w-[1120px] mx-auto py-8 px-4">
			<div className="inline-flex items-center mb-6 gap-2 cursor-pointer group" onClick={handleBack}>
				<SingleBtn direction="left" onClick={handleBack} />
				<span className="text-gray-500 group-hover:text-black transition-colors">Back to My Orders</span>
			</div>

			<div className="flex flex-col lg:flex-row gap-8">
				<div className="flex-1">
					<OrderHeader order={order} />
					<OrderItems items={order.orderItems} />
				</div>

				<div className="w-full lg:w-[360px] flex flex-col gap-6">
					<OrderAddress address={order.address} />

					<OrderSummary order={order} onCancelOrder={handleCancelOrder} />
				</div>
			</div>
		</div>
	);
}
