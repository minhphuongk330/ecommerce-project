"use client";
import Link from "next/link";
import dayjs from "dayjs";
import { Order } from "~/types/order";
import { formatPrice } from "~/utils/format";
import { router } from "~/utils/router";
import { getOrderStatusColor } from "~/utils/order";

interface OrderItemProps {
	data: Order;
}

export default function OrderItem({ data }: OrderItemProps) {
	return (
		<div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 mb-4 hover:shadow-md transition-shadow">
			<div className="flex flex-col sm:flex-row justify-between items-start mb-4 border-b border-gray-100 pb-3 gap-3 sm:gap-0">
				<div className="flex-1">
					<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
						<h3 className="font-bold text-base md:text-lg text-black">{data.orderNo}</h3>
						<span
							className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium border w-fit ${getOrderStatusColor(
								data.status
							)} capitalize`}
						>
							{data.status}
						</span>
					</div>
					<p className="text-gray-500 text-xs md:text-sm mt-1">Ordered on: {dayjs(data.createdAt).format("MMM DD, YYYY")}</p>
				</div>
				<div className="text-left sm:text-right w-full sm:w-auto">
					<Link href={router.orderDetail(data.id)} className="text-blue-600 text-xs md:text-sm font-medium hover:underline">
						View Details &rarr;
					</Link>
				</div>
			</div>

			<div className="flex flex-col gap-3 mb-4">
				{data.orderItems.map(item => (
					<div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
						<div className="flex flex-wrap items-center gap-2 flex-1">
							<span className="text-gray-600 text-xs md:text-sm font-medium">{item.quantity}x</span>
							<span className="text-gray-800 text-xs md:text-sm break-words">{item.product?.name || `Product #${item.productId}`}</span>
							{item.colorId && <span className="text-gray-400 text-xs italic">(Color: {item.colorId})</span>}
						</div>

						<span className="text-gray-600 text-xs md:text-sm sm:ml-4">{formatPrice(Number(item.unitPrice))}</span>
					</div>
				))}
			</div>

			<div className="flex justify-between items-center pt-3 border-t border-gray-100">
				<span className="text-gray-500 text-xs md:text-sm">Total Amount:</span>
				<span className="text-red-600 font-bold text-base md:text-lg">{formatPrice(Number(data.totalAmount))}</span>
			</div>
		</div>
	);
}
