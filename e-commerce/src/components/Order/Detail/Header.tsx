import dayjs from "dayjs";
import { Order } from "~/types/order";

interface OrderHeaderProps {
	order: Order;
}

export default function OrderHeader({ order }: OrderHeaderProps) {
	return (
		<div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Order #{order.orderNo}</h1>
				<span
					className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize
            ${order.status === "Pending" ? "bg-yellow-100 text-yellow-700" : ""}
            ${order.status === "Completed" ? "bg-green-100 text-green-700" : ""}
            ${order.status === "Cancelled" ? "bg-red-100 text-red-700" : ""}
            ${order.status === "Shipped" ? "bg-blue-100 text-blue-700" : ""}
          `}
				>
					{order.status}
				</span>
			</div>
			<p className="text-gray-500 text-sm">Placed on {dayjs(order.createdAt).format("MMMM DD, YYYY [at] HH:mm")}</p>
		</div>
	);
}
