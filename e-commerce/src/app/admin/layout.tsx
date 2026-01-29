"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import AdminHeader from "~/components/Admin/Header";
import Sidebar from "~/components/Admin/Sidebar";
import { useAuthStore } from "~/stores/useAuth";
import { routerPaths } from "~/utils/router";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
	const { user, isAuthenticated, logout } = useAuthStore();
	const router = useRouter();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (isClient) {
			if (!isAuthenticated || user?.role !== "ADMIN") {
				logout();
				router.push(routerPaths.login);
			}
		}
	}, [isClient, isAuthenticated, user, router, logout]);

	if (!isClient || !isAuthenticated || user?.role !== "ADMIN") {
		return null;
	}

	return (
		<div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
			<Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
			<div className="flex-1 flex flex-col">
				<AdminHeader />
				<main className="flex-1 bg-gray-50 p-4 md:p-[40px]">{children}</main>
			</div>
		</div>
	);
}
