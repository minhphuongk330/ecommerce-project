"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import People from "@mui/icons-material/People";
import Dashboard from "@mui/icons-material/Dashboard";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { useAuthStore } from "~/stores/useAuth";
import UserAvatar from "~/components/atoms/UserAvatar";
import { routerPaths } from "~/utils/router";

const NAV_ICONS = [
	{ path: routerPaths.adminDashboard, icon: <Dashboard fontSize="small" /> },
	{ path: routerPaths.adminProducts, icon: <ShoppingBag fontSize="small" /> },
	{ path: routerPaths.adminOrders, icon: <ShoppingCart fontSize="small" /> },
	{ path: routerPaths.adminCustomers, icon: <People fontSize="small" /> },
];

export default function AdminHeader() {
	const { user } = useAuthStore();
	const pathname = usePathname();

	return (
		<div className="h-16 md:h-25 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm flex-shrink-0 sticky top-0 z-30">
			<div className="flex items-center">
				<h2 className="hidden md:block text-lg font-semibold text-gray-800">Management System</h2>
			</div>

			<div className="flex md:hidden items-center gap-6">
				{NAV_ICONS.map((item, index) => {
					const isActive = pathname.startsWith(item.path);
					return (
						<Link
							key={index}
							href={item.path}
							className={`p-2 rounded-lg transition-colors ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-400"}`}
						>
							{item.icon}
						</Link>
					);
				})}
			</div>

			<div className="flex items-center gap-4">
				<div className="hidden md:block text-right">
					<p className="text-sm font-medium text-gray-900">{user?.fullName || "Admin"}</p>
					<p className="text-xs text-gray-500">Administrator</p>
				</div>

				<UserAvatar alt={user?.fullName || "Admin"} size={40} bgColor="#dbeafe" textColor="#2563eb" />
			</div>
		</div>
	);
}
