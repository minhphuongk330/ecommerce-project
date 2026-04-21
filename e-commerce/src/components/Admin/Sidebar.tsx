"use client";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routerPaths } from "~/utils/router";
import { ADMIN_NAV_ITEMS } from "~/utils/admin/navItems";
import CommonIconButton from "../atoms/IconButton";

interface SidebarProps {
	isCollapsed: boolean;
	toggleSidebar: () => void;
}

const MENU_ITEMS = ADMIN_NAV_ITEMS;

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
	const pathname = usePathname();
	const widthClass = isCollapsed ? "w-15" : "w-50";

	return (
		<div className={`hidden md:block flex-shrink-0 transition-all duration-300 ${widthClass}`}>
			<div
				className={`fixed top-0 left-0 h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col z-40 ${widthClass}`}
			>
				<div className="h-20 flex items-center justify-between px-4 border-b border-gray-800">
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

				<div className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
					{MENU_ITEMS.map(item => {
						const isActive = item.exact ? pathname === item.path : pathname.startsWith(item.path);

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
								{!isCollapsed && <span className="font-medium truncate">{item.name}</span>}
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
