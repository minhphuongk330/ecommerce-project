"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dashboard, ShoppingBag, ShoppingCart, People, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { routerPaths } from "~/utils/router";
import CommonIconButton from "../atoms/IconButton";

interface SidebarProps {
	isCollapsed: boolean;
	toggleSidebar: () => void;
}

const MENU_ITEMS = [
	{ name: "Dashboard", path: routerPaths.adminDashboard, icon: <Dashboard /> },
	{ name: "Products", path: routerPaths.adminProducts, icon: <ShoppingBag /> },
	{ name: "Orders", path: routerPaths.adminOrders, icon: <ShoppingCart /> },
	{ name: "Customers", path: routerPaths.adminCustomers, icon: <People /> },
];

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
	const pathname = usePathname();

	return (
		<div
			className={`h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col flex-shrink-0 ${
				isCollapsed ? "w-20" : "w-64"
			}`}
		>
			<div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
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
					const isActive = pathname.startsWith(item.path);
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
