"use client";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { adminService } from "~/services/admin";
import PeriodDropdown, { Period } from "~/components/atoms/PeriodDropdown";
import { formatPrice } from "~/utils/format";

dayjs.extend(isBetween);

type RevenueChartProps = {
	dateRange?: [Dayjs | null, Dayjs | null];
};

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white p-3 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 z-50">
				<p className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">{label}</p>
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between gap-6">
						<div className="flex items-center gap-2">
							<span className="w-3 h-3 rounded-full bg-[#FF8A4C]"></span>
							<span className="text-xs text-gray-500 font-medium">Revenue</span>
						</div>
						<span className="text-sm font-bold text-gray-800">{formatPrice(payload[0]?.value)}</span>
					</div>
					<div className="flex items-center justify-between gap-6">
						<div className="flex items-center gap-2">
							<span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>
							<span className="text-xs text-gray-500 font-medium">Order</span>
						</div>
						<span className="text-sm font-bold text-gray-800">{payload[1]?.value?.toLocaleString()}</span>
					</div>
				</div>
			</div>
		);
	}
	return null;
};

export default function RevenueChart({ dateRange }: RevenueChartProps) {
	const [allOrders, setAllOrders] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [period, setPeriod] = useState<Period>("yearly");

	const fetchOrders = useCallback(async () => {
		try {
			setLoading(true);
			const orders = await adminService.getOrders();
			setAllOrders(orders);
		} catch (error) {
			console.error("Error fetching revenue data:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	const { chartData, stats } = useMemo(() => {
		let startDate: dayjs.Dayjs;
		let prevStartDate: dayjs.Dayjs;
		const endDate = dayjs().endOf("day");
		let stepUnit: dayjs.ManipulateType;
		let formatStr: string;

		if (period === "yearly") {
			startDate = dayjs().startOf("year");
			prevStartDate = startDate.subtract(1, "year").startOf("year");
			stepUnit = "month";
			formatStr = "MMM";
		} else if (period === "monthly") {
			startDate = dayjs().startOf("month");
			prevStartDate = startDate.subtract(1, "month").startOf("month");
			stepUnit = "day";
			formatStr = "DD/MM";
		} else {
			startDate = dayjs().subtract(6, "day").startOf("day");
			prevStartDate = startDate.subtract(7, "day").startOf("day");
			stepUnit = "day";
			formatStr = "ddd";
		}

		const dataPoints: Record<string, { name: string; revenue: number; orders: number; timestamp: number }> = {};
		let curr = startDate.clone();

		while (curr.isBefore(endDate) || curr.isSame(endDate, stepUnit)) {
			const key = curr.format(formatStr);
			if (!dataPoints[key]) {
				dataPoints[key] = { name: key, revenue: 0, orders: 0, timestamp: curr.valueOf() };
			}
			curr = curr.add(1, stepUnit);
		}

		let currentRevenue = 0,
			currentOrders = 0;
		let prevRevenue = 0,
			prevOrders = 0;

		allOrders.forEach(order => {
			const orderDate = dayjs(order.createdAt);
			const amount = typeof order.totalAmount === "string" ? parseFloat(order.totalAmount) : order.totalAmount;
			const validAmount = amount || 0;

			if (orderDate.isBetween(startDate, endDate, null, "[]")) {
				currentRevenue += validAmount;
				currentOrders += 1;
				const chartKey = orderDate.format(formatStr);
				if (dataPoints[chartKey]) {
					dataPoints[chartKey].revenue += validAmount;
					dataPoints[chartKey].orders += 1;
				}
			}

			if (orderDate.isBetween(prevStartDate, startDate.subtract(1, "ms"), null, "[]")) {
				prevRevenue += validAmount;
				prevOrders += 1;
			}
		});

		const calcPercent = (curr: number, prev: number) =>
			prev === 0 ? (curr > 0 ? 100 : 0) : ((curr - prev) / prev) * 100;

		return {
			chartData: Object.values(dataPoints).sort((a, b) => a.timestamp - b.timestamp),
			stats: {
				revenue: currentRevenue,
				revenuePercent: calcPercent(currentRevenue, prevRevenue),
				orders: currentOrders,
				ordersPercent: calcPercent(currentOrders, prevOrders),
			},
		};
	}, [period, allOrders]);

	if (loading) {
		return (
			<div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center min-h-[400px]">
				Loading chart data...
			</div>
		);
	}

	return (
		<div className="bg-white p-6 md:p-8 rounded-xl shadow-md h-full flex flex-col relative">
			<div className="flex justify-between items-start mb-6 relative">
				<h2 className="text-2xl font-bold text-gray-900">Revenue</h2>

				<PeriodDropdown period={period} onPeriodChange={setPeriod} />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-b border-gray-100 pb-6">
				<div className="flex flex-col items-start gap-1.5">
					<p className="text-gray-600 text-xs font-semibold tracking-wide uppercase">Revenue</p>
					<div className="flex items-center gap-3">
						<h3 className="text-3xl font-bold text-gray-900">{formatPrice(stats.revenue)}</h3>
						<div className="flex items-center gap-1">
							{stats.revenuePercent >= 0 ? (
								<TrendingUpIcon sx={{ fontSize: "18px", color: "#14B8A6" }} />
							) : (
								<TrendingDownIcon sx={{ fontSize: "18px", color: "#EF4444" }} />
							)}
							<span className={`text-sm font-bold ${stats.revenuePercent >= 0 ? "text-teal-500" : "text-red-500"}`}>
								{Math.abs(stats.revenuePercent).toFixed(2)}%
							</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-start gap-1.5">
					<p className="text-gray-600 text-xs font-semibold tracking-wide uppercase">Order</p>
					<div className="flex items-center gap-3">
						<h3 className="text-3xl font-bold text-gray-900">{stats.orders.toLocaleString()}</h3>
						<div className="flex items-center gap-1">
							{stats.ordersPercent >= 0 ? (
								<TrendingUpIcon sx={{ fontSize: "18px", color: "#14B8A6" }} />
							) : (
								<TrendingDownIcon sx={{ fontSize: "18px", color: "#EF4444" }} />
							)}
							<span className={`text-sm font-bold ${stats.ordersPercent >= 0 ? "text-teal-500" : "text-red-500"}`}>
								{Math.abs(stats.ordersPercent).toFixed(2)}%
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex-1 min-h-[320px]">
				<ResponsiveContainer width="100%" height="100%">
					<ComposedChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 20 }}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 13, fill: "#9CA3AF", fontWeight: 500 }}
							dy={10}
						/>
						<YAxis yAxisId="left" axisLine={false} tickLine={false} tick={false} />
						<YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={false} />
						<Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB" }} />
						<Bar yAxisId="left" dataKey="revenue" fill="#FF8A4C" radius={[8, 8, 0, 0]} barSize={32} />
						<Line
							yAxisId="right"
							type="monotone"
							dataKey="orders"
							stroke="#8B5CF6"
							strokeWidth={4}
							dot={false}
							activeDot={{ r: 6, fill: "#8B5CF6", stroke: "#fff", strokeWidth: 3 }}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
