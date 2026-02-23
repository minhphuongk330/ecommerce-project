"use client";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { adminService } from "~/services/admin";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

interface OrderStatusChartProps {
	dateRange: { startDate: Dayjs; endDate: Dayjs };
}

export default function OrderStatusChart({ dateRange }: OrderStatusChartProps) {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const COLORS: Record<string, string> = {
		pending: "#FFA726",
		processing: "#42A5F5",
		shipped: "#66BB6A",
		delivered: "#29B6F6",
		cancelled: "#EF5350",
	};

	useEffect(() => {
		const fetchOrderStatus = async () => {
			try {
				setLoading(true);
				const orders = await adminService.getOrders();
				const filteredOrders = orders.filter(order =>
					dayjs(order.createdAt).isBetween(dateRange.startDate, dateRange.endDate, null, "[]"),
				);

				const statusCount = filteredOrders.reduce(
					(acc, order) => {
						const status = order.status.toLowerCase();
						acc[status] = (acc[status] || 0) + 1;
						return acc;
					},
					{} as Record<string, number>,
				);

				const chartData = Object.entries(statusCount).map(([status, count]) => ({
					name: status.charAt(0).toUpperCase() + status.slice(1),
					value: count,
				}));

				setData(chartData);
			} catch (error) {
				console.error("Error fetching order status:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchOrderStatus();
	}, [dateRange]);

	if (loading)
		return (
			<div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center min-h-[350px]">Loading...</div>
		);
	if (data.length === 0)
		return (
			<div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center min-h-[350px]">
				No data in this period
			</div>
		);

	return (
		<div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
			<h2 className="text-xl font-bold text-gray-800 mb-4">Order Status Distribution</h2>
			<ResponsiveContainer width="100%" height={350}>
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						labelLine={false}
						label={entry => `${entry.name}: ${entry.value}`}
						outerRadius={80}
						fill="#8884d8"
						dataKey="value"
					>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()] || "#8884d8"} />
						))}
					</Pie>
					<Tooltip formatter={value => `${value} orders`} />
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}
