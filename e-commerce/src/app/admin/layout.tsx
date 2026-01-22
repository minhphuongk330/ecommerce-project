"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "~/components/Admin/Sidebar";
import AdminHeader from "~/components/Admin/Header";
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
		<div className="flex flex-col md:flex-row min-h-screen md:h-screen bg-gray-100 md:overflow-hidden">
			<Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
			<div className="flex-1 flex flex-col md:overflow-hidden">
				<AdminHeader />
				<main className="flex-1 bg-gray-50 p-4 md:p-[40px] md:overflow-x-hidden md:overflow-y-auto">{children}</main>
			</div>
		</div>
	);
}
