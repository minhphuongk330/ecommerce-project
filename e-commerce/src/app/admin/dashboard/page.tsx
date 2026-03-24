"use client";
import AttachMoney from "@mui/icons-material/AttachMoney";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import PendingActionsOutlined from "@mui/icons-material/PendingActionsOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import Skeleton from "@mui/material/Skeleton";
import { useCallback, useEffect, useState } from "react";
import LowStockAlert from "~/components/Admin/Dashboard/LowStockAlert";
import DashboardMetricCard, { getDateRangeByPeriod } from "~/components/Admin/Dashboard/MetricCard";
import OrderStatusChart from "~/components/Admin/Dashboard/OrderStatusChart";
import RecentOrders from "~/components/Admin/Dashboard/RecentOrders";
import RevenueChart from "~/components/Admin/Dashboard/RevenueChart";
import TopSellingProducts from "~/components/Admin/Dashboard/TopSellingProducts";
import { adminService } from "~/services/admin";
import { AdminCustomer, AdminOrder } from "~/types/admin";

export default function DashboardPage() {
	const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
	const [allCustomers, setAllCustomers] = useState<AdminCustomer[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const weeklyDateRange = getDateRangeByPeriod("weekly");

	const fetchRawData = useCallback(async () => {
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
	}, []);

	useEffect(() => {
		fetchRawData();
	}, [fetchRawData]);

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
				<DashboardMetricCard
					title="Total Earnings"
					icon={<AttachMoney />}
					color="bg-teal-500"
					data={allOrders}
					type="revenue"
				/>
				<DashboardMetricCard
					title="Total Orders"
					icon={<ShoppingCartOutlined />}
					color="bg-orange-500"
					data={allOrders}
					type="count"
				/>
				<DashboardMetricCard
					title="Customers"
					icon={<GroupOutlined />}
					color="bg-blue-500"
					data={allCustomers}
					type="count"
				/>
				<DashboardMetricCard
					title="Pending Orders"
					icon={<PendingActionsOutlined />}
					color="bg-rose-500"
					data={allOrders}
					type="count"
					statusFilter="pending"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-[40px]">
				<div className="lg:col-span-2">
					<RevenueChart dateRange={weeklyDateRange} />
				</div>
				<div>
					<OrderStatusChart dateRange={weeklyDateRange} />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-[40px]">
				<div className="lg:col-span-1">
					<TopSellingProducts dateRange={weeklyDateRange} />
				</div>
				<div className="lg:col-span-2">
					<RecentOrders dateRange={weeklyDateRange} />
				</div>
			</div>

			<div className="mb-[40px]">
				<LowStockAlert />
			</div>
		</div>
	);
}
