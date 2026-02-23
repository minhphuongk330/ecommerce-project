"use client";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Dashboard from "@mui/icons-material/Dashboard";
import People from "@mui/icons-material/People";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routerPaths } from "~/utils/router";
import CommonIconButton from "../atoms/IconButton";
import HomeIcon from "@mui/icons-material/Home";

interface SidebarProps {
	isCollapsed: boolean;
	toggleSidebar: () => void;
}

const MENU_ITEMS = [
	{ name: "Dashboard", path: routerPaths.adminDashboard, icon: <Dashboard /> },
	{ name: "Products", path: routerPaths.adminProducts, icon: <ShoppingBag /> },
	{ name: "Orders", path: routerPaths.adminOrders, icon: <ShoppingCart /> },
	{ name: "Customers", path: routerPaths.adminCustomers, icon: <People /> },
	{ name: "Home", path: routerPaths.index, icon: <HomeIcon /> },
];

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
	const pathname = usePathname();

	return (
		<div
			className={`hidden md:flex min-h-screen bg-gray-900 text-white transition-all duration-300 flex-col flex-shrink-0 ${
				isCollapsed ? "w-20" : "w-64"
			}`}
		>
			<div className="h-25 flex items-center justify-between px-4 border-b border-gray-800">
				{!isCollapsed && <span className="text-xl font-bold tracking-wider">ADMIN</span>}
				<CommonIconButton
					onClick={toggleSidebar}
					icon={isCollapsed ? <ChevronRight /> : <ChevronLeft />}
					className="ml-auto !text-gray-400 hover:!text-white hover:!bg-gray-800 rounded-full"
					sx={{
						width: 32,
						height: 32,
						transition: "all 0.3s",
					}}
				/>
			</div>

			<div className="flex-1 py-6 space-y-1 overflow-y-auto">
				{MENU_ITEMS.map(item => {
					const isActive = item.path === routerPaths.index ? pathname === item.path : pathname.startsWith(item.path);

					return (
						<Link
							key={item.path}
							href={item.path}
							title={isCollapsed ? item.name : ""}
							className={`flex items-center px-4 py-3 transition-colors ${
								isActive
									? "bg-blue-600 text-white border-r-4 border-blue-400"
									: "text-gray-400 hover:bg-gray-800 hover:text-white"
							}`}
						>
							<span className={`flex-shrink-0 flex items-center justify-center ${isCollapsed ? "mx-auto" : "mr-3"}`}>
								{item.icon}
							</span>
							{!isCollapsed && (
								<span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>
							)}
						</Link>
					);
				})}
			</div>
		</div>
	);
}
