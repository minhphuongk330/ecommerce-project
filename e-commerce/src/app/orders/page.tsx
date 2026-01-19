"use client";
import { useState, useEffect } from "react";
import { orderService } from "~/services/order";
import { Order } from "~/types/order";
import OrderItem from "~/components/Order/OrderItem";
import OrderEmptyState from "~/components/Order/EmptyState";

export default function OrderListPage() {
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

	if (isLoading) {
		return (
			<div className="w-full py-10 flex justify-center">
				<p className="text-gray-500">Loading your orders...</p>
			</div>
		);
	}

	if (orders.length === 0) {
		return <OrderEmptyState />;
	}

	return (
		<div className="w-full max-w-[800px] mx-auto py-6 md:py-[40px] px-4 md:px-6">
			<h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">My Orders</h1>
			<div className="flex flex-col">
				{orders.map(order => (
					<OrderItem key={order.id} data={order} />
				))}
			</div>
		</div>
	);
}
