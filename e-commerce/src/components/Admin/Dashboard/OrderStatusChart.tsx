"use client";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useMemo, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { adminService } from "~/services/admin";
import PeriodDropdown, { Period } from "~/components/atoms/PeriodDropdown";

dayjs.extend(isBetween);

interface OrderStatusChartProps {
	dateRange?: { startDate: Dayjs; endDate: Dayjs };
}

export default function OrderStatusChart({ dateRange }: OrderStatusChartProps) {
	const [allOrders, setAllOrders] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [period, setPeriod] = useState<Period>("weekly");

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
				setAllOrders(orders);
			} catch (error) {
				console.error("Error fetching order status:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchOrderStatus();
	}, []);

	const data = useMemo(() => {
		let startDate: dayjs.Dayjs;
		const endDate = dayjs().endOf("day");
		if (period === "yearly") {
			startDate = dayjs().startOf("year");
		} else if (period === "monthly") {
			startDate = dayjs().startOf("month");
		} else {
			startDate = dayjs().subtract(6, "day").startOf("day");
		}

		const filteredOrders = allOrders.filter(order => dayjs(order.createdAt).isBetween(startDate, endDate, null, "[]"));
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
			<div className="flex justify-between items-start mb-4 relative">
				<h2 className="text-xl font-bold text-gray-800">Order Status Distribution</h2>
				<PeriodDropdown period={period} onPeriodChange={setPeriod} />
			</div>

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
					<Tooltip formatter={(value: any) => `${value} orders`} />
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}
