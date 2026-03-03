"use client";
import AttachMoney from "@mui/icons-material/AttachMoney";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import PendingActionsOutlined from "@mui/icons-material/PendingActionsOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
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
			startDate = dayjs().subtract(7, "day").startOf("day");
			previousEndDate = startDate.subtract(1, "day").endOf("day");
			previousStartDate = previousEndDate.subtract(7, "day").startOf("day");
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

	return {
		startDate,
		endDate,
		previousStartDate,
		previousEndDate,
	};
}

function calculatePercentageChange(current: number, previous: number): number {
	if (previous === 0) return 0;
	return Math.round(((current - previous) / previous) * 100);
}

// Revenue Card Component
function RevenueStatCard({ allOrders }: { allOrders: AdminOrder[] }) {
	const [period, setPeriod] = useState<TimePeriod>("weekly");
	const [stats, setStats] = useState({ current: 0, previous: 0 });
	const [chartData, setChartData] = useState<Array<{ value: number }>>([]);

	useEffect(() => {
		const dateRange = getDateRangeByPeriod(period);

		const filteredOrders = allOrders.filter(order =>
			dayjs(order.createdAt).isBetween(dateRange.startDate, dateRange.endDate, null, "[]"),
		);

		const previousOrders = allOrders.filter(order =>
			dayjs(order.createdAt).isBetween(dateRange.previousStartDate, dateRange.previousEndDate, null, "[]"),
		);

		const currentRevenue = filteredOrders.reduce((sum, order) => {
			const amount = typeof order.totalAmount === "string" ? parseFloat(order.totalAmount) : order.totalAmount;
			return sum + (amount || 0);
		}, 0);

		const previousRevenue = previousOrders.reduce((sum, order) => {
			const amount = typeof order.totalAmount === "string" ? parseFloat(order.totalAmount) : order.totalAmount;
			return sum + (amount || 0);
		}, 0);

		setStats({ current: currentRevenue, previous: previousRevenue });
		setChartData(Array.from({ length: 7 }).map(() => ({ value: Math.floor(Math.random() * 10000) })));
	}, [period, allOrders]);

	return (
		<StatCard
			title="Total Earnings"
			value={`$${stats.current.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
			icon={<AttachMoney />}
			color="bg-teal-500"
			percentage={calculatePercentageChange(stats.current, stats.previous)}
			chartData={chartData}
			onPeriodChange={setPeriod}
		/>
	);
}

// Orders Card Component
function OrdersStatCard({ allOrders }: { allOrders: AdminOrder[] }) {
	const [period, setPeriod] = useState<TimePeriod>("weekly");
	const [stats, setStats] = useState({ current: 0, previous: 0 });
	const [chartData, setChartData] = useState<Array<{ value: number }>>([]);

	useEffect(() => {
		const dateRange = getDateRangeByPeriod(period);

		const filteredOrders = allOrders.filter(order =>
			dayjs(order.createdAt).isBetween(dateRange.startDate, dateRange.endDate, null, "[]"),
		);

		const previousOrders = allOrders.filter(order =>
			dayjs(order.createdAt).isBetween(dateRange.previousStartDate, dateRange.previousEndDate, null, "[]"),
		);

		setStats({ current: filteredOrders.length, previous: previousOrders.length });
		setChartData(Array.from({ length: 7 }).map(() => ({ value: Math.floor(Math.random() * 100) })));
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

// Customers Card Component
function CustomersStatCard({ allCustomers }: { allCustomers: AdminCustomer[] }) {
	const [period, setPeriod] = useState<TimePeriod>("weekly");
	const [stats, setStats] = useState({ current: 0, previous: 0 });
	const [chartData, setChartData] = useState<Array<{ value: number }>>([]);

	useEffect(() => {
		const dateRange = getDateRangeByPeriod(period);

		const filteredCustomers = allCustomers.filter(customer =>
			dayjs(customer.createdAt).isBetween(dateRange.startDate, dateRange.endDate, null, "[]"),
		);

		const previousCustomers = allCustomers.filter(customer =>
			dayjs(customer.createdAt).isBetween(dateRange.previousStartDate, dateRange.previousEndDate, null, "[]"),
		);

		setStats({ current: filteredCustomers.length, previous: previousCustomers.length });
		setChartData(Array.from({ length: 7 }).map(() => ({ value: Math.floor(Math.random() * 50) })));
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

// Pending Orders Card Component
function PendingOrdersStatCard({ allOrders }: { allOrders: AdminOrder[] }) {
	const [period, setPeriod] = useState<TimePeriod>("weekly");
	const [stats, setStats] = useState({ current: 0, previous: 0 });
	const [chartData, setChartData] = useState<Array<{ value: number }>>([]);

	useEffect(() => {
		const dateRange = getDateRangeByPeriod(period);

		const filteredOrders = allOrders.filter(
			order =>
				dayjs(order.createdAt).isBetween(dateRange.startDate, dateRange.endDate, null, "[]") &&
				order.status.toLowerCase() === "pending",
		);

		const previousOrders = allOrders.filter(
			order =>
				dayjs(order.createdAt).isBetween(dateRange.previousStartDate, dateRange.previousEndDate, null, "[]") &&
				order.status.toLowerCase() === "pending",
		);

		setStats({ current: filteredOrders.length, previous: previousOrders.length });
		setChartData(Array.from({ length: 7 }).map(() => ({ value: Math.floor(Math.random() * 30) })));
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
				setError("Failed to load dashboard data. Please try refreshing the page.");
			} finally {
				setLoading(false);
			}
		};

		fetchRawData();
	}, []);

	if (loading && allOrders.length === 0) {
		return (
			<div className="flex h-[50vh] items-center justify-center flex-col gap-3">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
				<span className="text-gray-500 font-medium">Loading dashboard data...</span>
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

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-[40px]">
				<TopSellingProducts dateRange={getDateRangeByPeriod("weekly")} />
				<RecentOrders dateRange={getDateRangeByPeriod("weekly")} />
			</div>

			<div className="mb-[40px]">
				<LowStockAlert />
			</div>
		</div>
	);
}
