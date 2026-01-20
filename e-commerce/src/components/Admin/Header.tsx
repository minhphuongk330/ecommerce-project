"use client";
import { useAuthStore } from "~/stores/useAuth";
import UserAvatar from "~/components/atoms/UserAvatar";

export default function AdminHeader() {
	const { user } = useAuthStore();

	return (
		<div className="h-25 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm flex-shrink-0">
			<h2 className="text-lg font-semibold text-gray-800">Management System</h2>
			<div className="flex items-center gap-4">
				<div className="text-right">
					<p className="text-sm font-medium text-gray-900">{user?.fullName || "Admin"}</p>
					<p className="text-xs text-gray-500">Administrator</p>
				</div>
				<UserAvatar alt={user?.fullName || "Admin"} size={40} bgColor="#dbeafe" textColor="#2563eb" />
			</div>
		</div>
	);
}
