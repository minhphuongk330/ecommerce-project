import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { Order } from "~/types/order";
import { getOrderStatusText, getPaymentStatusText } from "~/utils/order";
import { parseSafeDate } from "~/utils/format";

interface OrderHeaderProps {
	order: Order;
}

const STATUS_COLORS: Record<string, string> = {
	Pending: "bg-yellow-100 text-yellow-700",
	Processing: "bg-orange-100 text-orange-700",
	Completed: "bg-green-100 text-green-700",
	Cancelled: "bg-red-100 text-red-700",
	Shipped: "bg-blue-100 text-blue-700",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
	pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
	paid: "bg-green-100 text-green-700 border-green-200",
	failed: "bg-red-100 text-red-700 border-red-200",
	cancelled: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function OrderHeader({ order }: OrderHeaderProps) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
				<h1 className="text-2xl font-bold">Đơn hàng #{order.orderNo}</h1>
				<div className="flex flex-wrap gap-2">
					<span className={`px-4 py-1.5 rounded-full text-sm font-bold ${STATUS_COLORS[order.status] || ""}`}>
						{getOrderStatusText(order.status)}
					</span>
					<span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${PAYMENT_STATUS_COLORS[order.paymentStatus || 'pending'] || ""}`}>
						{getPaymentStatusText(order.paymentStatus)}
					</span>
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<p className="text-gray-500 text-sm">
					Đặt lúc: {mounted ? dayjs(parseSafeDate(order.createdAt)).format("HH:mm - DD/MM/YYYY") : ""}
				</p>

				<p className="text-gray-700 text-sm">
					Dự kiến giao hàng:{" "}
					<span className="font-bold ">
						{order.scheduledDeliveryDate && mounted ? dayjs(parseSafeDate(order.scheduledDeliveryDate)).format("DD/MM/YYYY") : "Chưa xác định"}
					</span>
				</p>
			</div>
		</div>
	);
}
