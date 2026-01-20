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
		<div className="flex h-screen bg-gray-100 overflow-hidden">
			<Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
			<div className="flex-1 flex flex-col overflow-hidden">
				<AdminHeader />
				<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-[40px]">{children}</main>
			</div>
		</div>
	);
}
