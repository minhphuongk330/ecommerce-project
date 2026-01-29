"use client";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { adminService } from "~/services/admin";

dayjs.extend(isBetween);

interface DateRange {
	startDate: Dayjs;
	endDate: Dayjs;
}

interface RevenueChartProps {
	dateRange?: DateRange;
}

export default function RevenueChart({ dateRange }: RevenueChartProps) {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRevenueData = async () => {
			try {
				setLoading(true);
				const orders = await adminService.getOrders();
				let start, end;
				if (dateRange) {
					start = dateRange.startDate;
					end = dateRange.endDate;
				} else {
					end = dayjs();
					start = end.subtract(30, "day");
				}

				const dateMap: Record<string, { revenue: number; orders: number }> = {};
				let current = start;
				while (current.isBefore(end) || current.isSame(end, "day")) {
					dateMap[current.format("MMM DD")] = { revenue: 0, orders: 0 };
					current = current.add(1, "day");
				}

				orders.forEach(order => {
					const date = dayjs(order.createdAt);
					if (date.isBetween(start, end, null, "[]")) {
						const key = date.format("MMM DD");
						if (dateMap[key]) {
							const amount = typeof order.totalAmount === "string" ? parseFloat(order.totalAmount) : order.totalAmount;
							dateMap[key].revenue += amount || 0;
							dateMap[key].orders += 1;
						}
					}
				});

				const chartData = Object.entries(dateMap)
					.map(([date, { revenue, orders }]) => ({
						date,
						revenue: Math.max(0, Math.round(revenue)),
						orders: Math.max(0, orders),
					}))
					.filter(item => item.date);

				setData(chartData);
			} catch (error) {
				console.error("Error fetching revenue data:", error);
				setData([]);
			} finally {
				setLoading(false);
			}
		};

		fetchRevenueData();
	}, [dateRange]);

	if (loading) {
		return (
			<div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center min-h-[400px]">
				<div className="text-gray-500">Loading...</div>
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center min-h-[400px]">
				<div className="text-gray-500">No revenue data available</div>
			</div>
		);
	}

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-xl font-bold text-gray-800 mb-4">Revenue & Orders</h2>
			<ResponsiveContainer width="100%" height={350}>
				<ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis yAxisId="left" />
					<YAxis yAxisId="right" orientation="right" />
					<Tooltip />
					<Legend />
					<Bar yAxisId="left" dataKey="revenue" fill="#66BB6A" name="Revenue ($)" />
					<Line yAxisId="right" type="monotone" dataKey="orders" stroke="#42A5F5" name="Orders" strokeWidth={2} />
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	);
}
