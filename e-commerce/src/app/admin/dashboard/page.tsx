"use client";
import AttachMoney from "@mui/icons-material/AttachMoney";
import AlertCircleOutlined from "@mui/icons-material/HighlightOffOutlined";
import PeopleOutline from "@mui/icons-material/PeopleOutline";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import DateRangeFilter, { DateRange } from "~/components/Admin/Dashboard/DateRangeFilter";
import LowStockAlert from "~/components/Admin/Dashboard/LowStockAlert";
import OrderStatusChart from "~/components/Admin/Dashboard/OrderStatusChart";
import RecentOrders from "~/components/Admin/Dashboard/RecentOrders";
import RevenueChart from "~/components/Admin/Dashboard/RevenueChart";
import TopSellingProducts from "~/components/Admin/Dashboard/TopSellingProducts";
import StatCard from "~/components/atoms/StatCard";
import { adminService } from "~/services/admin";
import { DashboardStats } from "~/types/admin";

dayjs.extend(isBetween);

export default function DashboardPage() {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
	const [dateRange, setDateRange] = useState<DateRange>({
		startDate: dayjs().subtract(30, "day"),
		endDate: dayjs(),
	});

	const fetchStats = async () => {
		try {
			setLoading(true);
			setError(null);
			const [data, orders] = await Promise.all([adminService.getStats(), adminService.getOrders()]);
			setStats(data);
			const pendingCount = orders.filter(order => order.status?.toLowerCase() === "pending").length;
			setPendingOrdersCount(pendingCount);
		} catch (err: any) {
			console.error("Dashboard Error:", err);
			const message = err?.response?.data?.message || "Không thể tải dữ liệu thống kê.";
			setError(message);
			setStats(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStats();
	}, []);

	const statItems = [
		{
			title: "Total Revenue",
			value: stats ? `$${stats.totalRevenue.toLocaleString()}` : "0",
			icon: <AttachMoney />,
			color: "bg-green-600",
		},
		{
			title: "Total Orders",
			value: stats?.totalOrders ?? 0,
			icon: <ShoppingCartOutlined />,
			color: "bg-blue-600",
		},
		{
			title: "New Customers",
			value: stats?.newCustomers ?? 0,
			icon: <PeopleOutline />,
			color: "bg-orange-500",
		},
		{
			title: "Pending Orders",
			value: pendingOrdersCount,
			icon: <AlertCircleOutlined />,
			color: "bg-red-500",
		},
	];

	if (loading) {
		return (
			<div className="flex h-[50vh] items-center justify-center flex-col gap-3">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
				<span className="text-gray-500 font-medium">Loading data...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
				<h3 className="text-lg font-bold mb-2">Unable to load Dashboard</h3>
				<p>
					Error: <span className="font-semibold">{error}</span>
				</p>
			</div>
		);
	}

	if (!stats) return null;

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-800 mb-[20px]">Dashboard Overview</h1>

			<DateRangeFilter onDateChange={setDateRange} />

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-[40px]">
				{statItems.map((item, index) => (
					<StatCard key={index} {...item} />
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-[40px]">
				<div className="lg:col-span-2">
					<RevenueChart dateRange={dateRange} />
				</div>
				<div>
					<OrderStatusChart />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-[40px]">
				<TopSellingProducts dateRange={dateRange} />
				<RecentOrders />
			</div>

			<div className="mb-[40px]">
				<LowStockAlert />
			</div>
		</div>
	);
}
