"use client";
import { useEffect, useState } from "react";
import AttachMoney from "@mui/icons-material/AttachMoney";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import TrendingUp from "@mui/icons-material/TrendingUp";
import PeopleOutline from "@mui/icons-material/PeopleOutline";
import { adminService } from "~/services/admin";
import { DashboardStats } from "~/types/admin";
import StatCard from "~/components/atoms/StatCard";

export default function DashboardPage() {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchStats = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await adminService.getStats();
			setStats(data);
		} catch (err: any) {
			console.error("Dashboard Error:", err);
			const message = err?.response?.data?.message || "Unable to load statistical data.";
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
			title: "Today's Orders",
			value: stats?.todayOrders ?? 0,
			icon: <ShoppingCartOutlined />,
			color: "bg-blue-600",
		},
		{
			title: "Total Orders",
			value: stats?.totalOrders ?? 0,
			icon: <TrendingUp />,
			color: "bg-purple-600",
		},
		{
			title: "Total Customers",
			value: stats?.totalCustomers ?? 0,
			icon: <PeopleOutline />,
			color: "bg-orange-500",
		},
		{
			title: "Almost Sold Out",
			value: stats?.lowStockProducts ?? 0,
			icon: <Inventory2Outlined />,
			color: "bg-red-500",
		},
	];

	if (loading) {
		return (
			<div className="flex h-[50vh] items-center justify-center flex-col gap-3">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
				<span className="text-gray-500 font-medium">Loading statistical data...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
				<h3 className="text-lg font-bold mb-2">Unable to load Dashboard data</h3>
				<p>
					Error details: <span className="font-semibold">{error}</span>
				</p>
			</div>
		);
	}

	if (!stats) return null;

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-800 mb-[20px]">System Overview</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-[40px]">
				{statItems.map((item, index) => (
					<StatCard key={index} {...item} />
				))}
			</div>
		</div>
	);
}
