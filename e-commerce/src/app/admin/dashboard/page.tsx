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
import { AdminCustomer, AdminOrder } from "~/types/admin";

dayjs.extend(isBetween);

export default function DashboardPage() {
	const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
	const [allCustomers, setAllCustomers] = useState<AdminCustomer[]>([]);

	const [filteredStats, setFilteredStats] = useState({
		revenue: 0,
		orders: 0,
		newCustomers: 0,
		pendingOrders: 0,
	});

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [dateRange, setDateRange] = useState<DateRange>({
		startDate: dayjs().subtract(7, "day").startOf("day"),
		endDate: dayjs().endOf("day"),
	});

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

	useEffect(() => {
		if (!allOrders.length && !allCustomers.length) return;

		const filteredOrders = allOrders.filter(order =>
			dayjs(order.createdAt).isBetween(dateRange.startDate, dateRange.endDate, null, "[]"),
		);

		const filteredCustomers = allCustomers.filter(customer =>
			dayjs(customer.createdAt).isBetween(dateRange.startDate, dateRange.endDate, null, "[]"),
		);

		const totalRevenue = filteredOrders.reduce((sum, order) => {
			const amount = typeof order.totalAmount === "string" ? parseFloat(order.totalAmount) : order.totalAmount;
			return sum + (amount || 0);
		}, 0);

		const pendingCount = filteredOrders.filter(order => order.status.toLowerCase() === "pending").length;

		setFilteredStats({
			revenue: totalRevenue,
			orders: filteredOrders.length,
			newCustomers: filteredCustomers.length,
			pendingOrders: pendingCount,
		});
	}, [dateRange, allOrders, allCustomers]);

	const statItems = [
		{
			title: "Revenue",
			value: `$${filteredStats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			icon: <AttachMoney />,
			color: "bg-green-600",
		},
		{
			title: "Orders",
			value: filteredStats.orders,
			icon: <ShoppingCartOutlined />,
			color: "bg-blue-600",
		},
		{
			title: "New Customers",
			value: filteredStats.newCustomers,
			icon: <PeopleOutline />,
			color: "bg-orange-500",
		},
		{
			title: "Pending Orders",
			value: filteredStats.pendingOrders,
			icon: <AlertCircleOutlined />,
			color: "bg-red-500",
		},
	];

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
					<OrderStatusChart dateRange={dateRange} />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-[40px]">
				<TopSellingProducts dateRange={dateRange} />
				<RecentOrders dateRange={dateRange} />
			</div>

			<div className="mb-[40px]">
				<LowStockAlert />
			</div>
		</div>
	);
}
