"use client";
import AttachMoney from "@mui/icons-material/AttachMoney";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import PendingActionsOutlined from "@mui/icons-material/PendingActionsOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import Skeleton from "@mui/material/Skeleton";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import LowStockAlert from "~/components/Admin/Dashboard/LowStockAlert";
import OrderStatusChart from "~/components/Admin/Dashboard/OrderStatusChart";
import RecentOrders from "~/components/Admin/Dashboard/RecentOrders";
import RevenueChart from "~/components/Admin/Dashboard/RevenueChart";
import TopSellingProducts from "~/components/Admin/Dashboard/TopSellingProducts";
import StatCard from "~/components/atoms/StatCard";
import { adminService } from "~/services/admin";
import { AdminCustomer, AdminOrder } from "~/types/admin";

dayjs.extend(isBetween);

type TimePeriod = "weekly" | "monthly" | "yearly";

interface DateRangeInfo {
	startDate: dayjs.Dayjs;
	endDate: dayjs.Dayjs;
	previousStartDate: dayjs.Dayjs;
	previousEndDate: dayjs.Dayjs;
}

function getDateRangeByPeriod(period: TimePeriod): DateRangeInfo {
	const endDate = dayjs().endOf("day");
	let startDate: dayjs.Dayjs;
	let previousStartDate: dayjs.Dayjs;
	let previousEndDate: dayjs.Dayjs;

	switch (period) {
		case "weekly":
			startDate = dayjs().subtract(6, "day").startOf("day");
			previousEndDate = startDate.subtract(1, "day").endOf("day");
			previousStartDate = previousEndDate.subtract(6, "day").startOf("day");
			break;
		case "monthly":
			startDate = dayjs().startOf("month");
			previousEndDate = startDate.subtract(1, "day").endOf("day");
			previousStartDate = previousEndDate.subtract(1, "month").startOf("month");
			break;
		case "yearly":
			startDate = dayjs().startOf("year");
			previousEndDate = startDate.subtract(1, "day").endOf("day");
			previousStartDate = previousEndDate.subtract(1, "year").startOf("year");
			break;
	}
	return { startDate, endDate, previousStartDate, previousEndDate };
}

function calculatePercentageChange(current: number, previous: number): number {
	if (previous === 0) return current > 0 ? 100 : 0;
	return Math.round(((current - previous) / previous) * 100);
}

function generateRealChartData(
	items: any[],
	startDate: dayjs.Dayjs,
	endDate: dayjs.Dayjs,
	period: TimePeriod,
	type: "revenue" | "count",
	statusFilter?: string,
) {
	const dataPoints: { name: string; value: number; _timestamp: number }[] = [];
	let current = startDate.clone();
	let stepUnit: dayjs.ManipulateType = period === "yearly" ? "month" : "day";
	let formatString = period === "yearly" ? "MMM YYYY" : "DD/MM";

	while (current.isBefore(endDate) || current.isSame(endDate, stepUnit)) {
		dataPoints.push({
			name: current.format(formatString),
			value: 0,
			_timestamp: current.startOf(stepUnit).valueOf(),
		});
		current = current.add(1, stepUnit);
	}

	items.forEach(item => {
		if (statusFilter && item.status?.toLowerCase() !== statusFilter.toLowerCase()) return;

		const itemDate = dayjs(item.createdAt);
		if (itemDate.isBetween(startDate, endDate, null, "[]")) {
			const targetTime = itemDate.startOf(stepUnit).valueOf();
			const bucketIndex = dataPoints.findIndex(dp => dp._timestamp === targetTime);

			if (bucketIndex !== -1) {
				if (type === "revenue") {
					const amount = parseFloat(String(item.totalAmount)) || 0;
					dataPoints[bucketIndex].value += amount;
				} else {
					dataPoints[bucketIndex].value += 1;
				}
			}
		}
	});

	return dataPoints.map(dp => ({
		name: dp.name,
		value: type === "revenue" ? Number(dp.value.toFixed(2)) : dp.value,
	}));
}

function RevenueStatCard({ allOrders }: { allOrders: AdminOrder[] }) {
	const [period, setPeriod] = useState<TimePeriod>("weekly");
	const [stats, setStats] = useState({ current: 0, previous: 0 });
	const [chartData, setChartData] = useState<Array<{ name?: string; value: number }>>([]);

	useEffect(() => {
		const range = getDateRangeByPeriod(period);
		const currentRev = allOrders
			.filter(o => dayjs(o.createdAt).isBetween(range.startDate, range.endDate, null, "[]"))
			.reduce((s, o) => s + (parseFloat(String(o.totalAmount)) || 0), 0);
		const prevRev = allOrders
			.filter(o => dayjs(o.createdAt).isBetween(range.previousStartDate, range.previousEndDate, null, "[]"))
			.reduce((s, o) => s + (parseFloat(String(o.totalAmount)) || 0), 0);
		setStats({ current: currentRev, previous: prevRev });
		setChartData(generateRealChartData(allOrders, range.startDate, range.endDate, period, "revenue"));
	}, [period, allOrders]);

	return (
		<StatCard
			title="Total Earnings"
			value={`$${stats.current.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
			icon={<AttachMoney />}
			color="bg-teal-500"
			percentage={calculatePercentageChange(stats.current, stats.previous)}
			chartData={chartData}
			onPeriodChange={setPeriod}
		/>
	);
}

function OrdersStatCard({ allOrders }: { allOrders: AdminOrder[] }) {
	const [period, setPeriod] = useState<TimePeriod>("weekly");
	const [stats, setStats] = useState({ current: 0, previous: 0 });
	const [chartData, setChartData] = useState<Array<{ name?: string; value: number }>>([]);

	useEffect(() => {
		const range = getDateRangeByPeriod(period);

		const currCount = allOrders.filter(o =>
			dayjs(o.createdAt).isBetween(range.startDate, range.endDate, null, "[]"),
		).length;
		const prevCount = allOrders.filter(o =>
			dayjs(o.createdAt).isBetween(range.previousStartDate, range.previousEndDate, null, "[]"),
		).length;

		setStats({ current: currCount, previous: prevCount });
		setChartData(generateRealChartData(allOrders, range.startDate, range.endDate, period, "count"));
	}, [period, allOrders]);

	return (
		<StatCard
			title="Total Orders"
			value={stats.current}
			icon={<ShoppingCartOutlined />}
			color="bg-orange-500"
			percentage={calculatePercentageChange(stats.current, stats.previous)}
			chartData={chartData}
			onPeriodChange={setPeriod}
		/>
	);
}

function CustomersStatCard({ allCustomers }: { allCustomers: AdminCustomer[] }) {
	const [period, setPeriod] = useState<TimePeriod>("weekly");
	const [stats, setStats] = useState({ current: 0, previous: 0 });
	const [chartData, setChartData] = useState<Array<{ name?: string; value: number }>>([]);

	useEffect(() => {
		const range = getDateRangeByPeriod(period);
		const currCount = allCustomers.filter(c =>
			dayjs(c.createdAt).isBetween(range.startDate, range.endDate, null, "[]"),
		).length;
		const prevCount = allCustomers.filter(c =>
			dayjs(c.createdAt).isBetween(range.previousStartDate, range.previousEndDate, null, "[]"),
		).length;
		setStats({ current: currCount, previous: prevCount });
		setChartData(generateRealChartData(allCustomers, range.startDate, range.endDate, period, "count"));
	}, [period, allCustomers]);

	return (
		<StatCard
			title="Customers"
			value={stats.current}
			icon={<GroupOutlined />}
			color="bg-blue-500"
			percentage={calculatePercentageChange(stats.current, stats.previous)}
			chartData={chartData}
			onPeriodChange={setPeriod}
		/>
	);
}

function PendingOrdersStatCard({ allOrders }: { allOrders: AdminOrder[] }) {
	const [period, setPeriod] = useState<TimePeriod>("weekly");
	const [stats, setStats] = useState({ current: 0, previous: 0 });
	const [chartData, setChartData] = useState<Array<{ name?: string; value: number }>>([]);

	useEffect(() => {
		const range = getDateRangeByPeriod(period);

		const currCount = allOrders.filter(
			o =>
				dayjs(o.createdAt).isBetween(range.startDate, range.endDate, null, "[]") &&
				o.status.toLowerCase() === "pending",
		).length;
		const prevCount = allOrders.filter(
			o =>
				dayjs(o.createdAt).isBetween(range.previousStartDate, range.previousEndDate, null, "[]") &&
				o.status.toLowerCase() === "pending",
		).length;

		setStats({ current: currCount, previous: prevCount });
		setChartData(generateRealChartData(allOrders, range.startDate, range.endDate, period, "count", "pending"));
	}, [period, allOrders]);

	return (
		<StatCard
			title="Pending Orders"
			value={stats.current}
			icon={<PendingActionsOutlined />}
			color="bg-rose-500"
			percentage={calculatePercentageChange(stats.current, stats.previous)}
			chartData={chartData}
			onPeriodChange={setPeriod}
		/>
	);
}

export default function DashboardPage() {
	const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
	const [allCustomers, setAllCustomers] = useState<AdminCustomer[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRawData = async () => {
			try {
				setLoading(true);
				setError(null);
				const [ordersData, customersData] = await Promise.all([adminService.getOrders(), adminService.getCustomers()]);
				setAllOrders(ordersData);
				setAllCustomers(customersData);
			} catch (err) {
				console.error("Error fetching dashboard data:", err);
				setError("Failed to load dashboard data.");
			} finally {
				setLoading(false);
			}
		};
		fetchRawData();
	}, []);

	if (loading && allOrders.length === 0) {
		return (
			<div className="space-y-6 pb-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{[1, 2, 3, 4].map(i => (
						<div key={i} className="p-4 border border-gray-200 rounded-lg">
							<Skeleton width="50%" height={16} />
							<Skeleton width="66.67%" height={32} />
						</div>
					))}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{[1, 2].map(i => (
						<div key={i} className="border border-gray-200 rounded-lg p-6 h-[400px]">
							<Skeleton width="33.33%" height={24} />
							<Skeleton width="100%" height={350} />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-[50vh] items-center justify-center flex-col gap-4">
				<div className="text-center">
					<p className="text-red-600 font-medium mb-4 text-lg">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition"
					>
						Refresh Page
					</button>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-800 mb-[20px]">Dashboard Overview</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-[40px]">
				<RevenueStatCard allOrders={allOrders} />
				<OrdersStatCard allOrders={allOrders} />
				<CustomersStatCard allCustomers={allCustomers} />
				<PendingOrdersStatCard allOrders={allOrders} />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-[40px]">
				<div className="lg:col-span-2">
					<RevenueChart dateRange={getDateRangeByPeriod("weekly")} />
				</div>
				<div>
					<OrderStatusChart dateRange={getDateRangeByPeriod("weekly")} />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-[40px]">
				<div className="lg:col-span-1">
					<TopSellingProducts dateRange={getDateRangeByPeriod("weekly")} />
				</div>
				<div className="lg:col-span-2">
					<RecentOrders dateRange={getDateRangeByPeriod("weekly")} />
				</div>
			</div>

			<div className="mb-[40px]">
				<LowStockAlert />
			</div>
		</div>
	);
}
