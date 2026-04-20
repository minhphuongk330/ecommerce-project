"use client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useMemo, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import PeriodDropdown, { Period } from "~/components/atoms/PeriodDropdown";
import { adminService } from "~/services/admin";
import { AdminOrder } from "~/types/admin";
import { getDateRangeByPeriod } from "~/utils/admin/dashboardUtils";

dayjs.extend(isBetween);

const COLORS: Record<string, string> = {
	pending: "#FFA726",
	processing: "#42A5F5",
	shipped: "#66BB6A",
	delivered: "#29B6F6",
	cancelled: "#EF5350",
};

export default function OrderStatusChart() {
	const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [period, setPeriod] = useState<Period>("weekly");

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				const orders = await adminService.getOrders();
				setAllOrders(orders);
			} catch (error) {
				console.error("Error fetching order status:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, []);

	const data = useMemo(() => {
		const { startDate, endDate } = getDateRangeByPeriod(period);

		const filteredOrders = allOrders.filter(order =>
			dayjs(order.createdAt).isBetween(startDate, endDate, null, "[]"),
		);

		const statusCount = filteredOrders.reduce(
			(acc, order) => {
				const status = order.status.toLowerCase();
				acc[status] = (acc[status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(statusCount).map(([status, count]) => ({
			name: status.charAt(0).toUpperCase() + status.slice(1),
			value: count,
		}));
	}, [period, allOrders]);

	if (loading)
		return (
			<div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center min-h-[350px]">Loading...</div>
		);

	return (
		<div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
			<div className="flex justify-between items-start mb-6 relative">
				<h2 className="text-2xl font-bold text-gray-900">Order Status Distribution</h2>
				<PeriodDropdown period={period} onPeriodChange={setPeriod} />
			</div>

			{data.length === 0 ? (
				<div className="flex items-center justify-center min-h-[350px]">
					<p className="text-gray-500 text-lg">No data in this period</p>
				</div>
			) : (
				<ResponsiveContainer width="100%" height={350}>
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={55}
							outerRadius={80}
							labelLine={false}
							label={entry => `${entry.name}: ${entry.value}`}
							fill="#8884d8"
							dataKey="value"
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()] || "#8884d8"} />
							))}
						</Pie>
						<Tooltip formatter={(value: number | undefined) => `${value ?? 0} orders`} />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			)}
		</div>
	);
}
