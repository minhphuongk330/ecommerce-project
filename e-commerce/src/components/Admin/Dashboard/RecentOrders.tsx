"use client";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import { adminService } from "~/services/admin";

dayjs.extend(isBetween);

interface RecentOrdersProps {
	dateRange: { startDate: Dayjs; endDate: Dayjs };
}

export default function RecentOrders({ dateRange }: RecentOrdersProps) {
	const [orders, setOrders] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
		pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
		processing: { bg: "bg-blue-100", text: "text-blue-700" },
		shipped: { bg: "bg-purple-100", text: "text-purple-700" },
		delivered: { bg: "bg-green-100", text: "text-green-700" },
		cancelled: { bg: "bg-red-100", text: "text-red-700" },
	};

	useEffect(() => {
		const fetchRecentOrders = async () => {
			try {
				setLoading(true);
				const allOrders = await adminService.getOrders();
				const filteredOrders = allOrders.filter(order =>
					dayjs(order.createdAt).isBetween(dateRange.startDate, dateRange.endDate, null, "[]"),
				);
				const recentOrders = filteredOrders
					.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
					.slice(0, 10);
				setOrders(recentOrders);
			} catch (error) {
				console.error("Error fetching recent orders:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchRecentOrders();
	}, [dateRange]);

	const getStatusColor = (status: string) => {
		return STATUS_COLORS[status.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-700" };
	};

	if (loading) return <div className="bg-white p-6 rounded-lg shadow-md">Loading...</div>;

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="flex items-center gap-2 mb-4">
				<ShoppingCartOutlined className="text-blue-600" />
				<h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
			</div>

			{orders.length === 0 ? (
				<div className="text-center py-8 text-gray-500">No orders found in this period</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-200">
								<th className="text-left py-2 px-3 font-semibold text-gray-600">Order #</th>
								<th className="text-left py-2 px-3 font-semibold text-gray-600">Customer</th>
								<th className="text-right py-2 px-3 font-semibold text-gray-600">Total</th>
								<th className="text-center py-2 px-3 font-semibold text-gray-600">Status</th>
								<th className="text-left py-2 px-3 font-semibold text-gray-600">Date</th>
							</tr>
						</thead>
						<tbody>
							{orders.map(order => {
								const statusColor = getStatusColor(order.status);
								return (
									<tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
										<td className="py-3 px-3 font-medium text-gray-800">{order.orderNo}</td>
										<td className="py-3 px-3 text-gray-800">
											<div className="font-medium">{order.customer?.fullName || "Unknown"}</div>
											<div className="text-xs text-gray-500">{order.customer?.email}</div>
										</td>
										<td className="py-3 px-3 text-right font-bold text-gray-800">
											$
											{(typeof order.totalAmount === "string"
												? parseFloat(order.totalAmount)
												: order.totalAmount
											).toFixed(2)}
										</td>
										<td className="py-3 px-3 text-center">
											<span
												className={`${statusColor.bg} ${statusColor.text} px-3 py-1 rounded-full text-xs font-semibold`}
											>
												{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
											</span>
										</td>
										<td className="py-3 px-3 text-gray-600 text-xs">
											{dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
