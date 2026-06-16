"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Button from "~/components/atoms/Button";
import EmptyState from "~/components/atoms/EmptyState";
import { useWebNotifications } from "~/hooks/useWebNotifications";
import { WebNotification } from "~/services/notification";
import { useAuthStore } from "~/stores/useAuth";
import { routerPaths } from "~/utils/router";
import { formatNotificationTime, getNotificationIcon } from "~/utils/notification";



export default function NotificationsPage() {
	const router = useRouter();
	const { isAuthenticated } = useAuthStore();
	const { notifications, unreadCount, loading, markAsRead, markAllAsRead, refetch } = useWebNotifications(false);
	const [actionLoading, setActionLoading] = useState(false);

	useEffect(() => {
		if (!isAuthenticated) {
			router.push(routerPaths.login);
		}
	}, [isAuthenticated, router]);

	const handleNotificationClick = async (item: WebNotification) => {
		if (!item.isRead) {
			await markAsRead(item.id);
		}
		if (item.link) {
			router.push(item.link);
		}
	};

	const handleMarkAllRead = async () => {
		try {
			setActionLoading(true);
			await markAllAsRead();
			await refetch();
		} finally {
			setActionLoading(false);
		}
	};

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="max-w-3xl mx-auto">
				<Link
					href={routerPaths.profile}
					className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6 transition-colors gap-1.5"
				>
					<ArrowBack className="text-sm" /> Quay lại trang cá nhân
				</Link>

				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
								Thông báo của tôi
								{unreadCount > 0 && (
									<span className="text-xs font-semibold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
										{unreadCount} chưa đọc
									</span>
								)}
							</h1>
							<p className="text-sm text-gray-500 mt-1">Cập nhật những hoạt động, đơn hàng và phản hồi của bạn</p>
						</div>

						{unreadCount > 0 && (
							<Button
								type="button"
								onClick={handleMarkAllRead}
								disabled={actionLoading}
								variant="outline"
								theme="light"
								className="!flex items-center gap-2 !px-4 !py-2 !text-sm hover:!bg-gray-50"
							>
								<CheckCircleOutline fontSize="small" /> Đánh dấu đã đọc tất cả
							</Button>
						)}
					</div>
				</div>

				{loading && notifications.length === 0 ? (
					<div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
						<CircularProgress className="text-blue-600" />
					</div>
				) : notifications.length === 0 ? (
					<div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-12">
						<EmptyState
							title="Không có thông báo nào"
							description="Bạn hiện tại chưa có thông báo hệ thống hoặc cập nhật đơn hàng nào."
							buttonText="Tiếp tục mua sắm"
							link={routerPaths.index}
						/>
					</div>
				) : (
					<div className="space-y-4">
						{notifications.map(item => (
							<div
								key={item.id}
								onClick={() => handleNotificationClick(item)}
								className={`group relative bg-white rounded-xl border p-5 flex gap-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:border-blue-100 ${item.isRead ? "border-gray-100 opacity-90" : "border-blue-100 bg-blue-50/20"
									}`}
							>
								{!item.isRead && (
									<div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-xl" />
								)}

								<div className="flex-shrink-0 p-3 bg-white rounded-xl border border-gray-100 shadow-sm self-start group-hover:scale-105 transition-transform duration-200">
									{getNotificationIcon(item.type, "medium")}
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
										<h3 className={`text-base text-gray-900 ${item.isRead ? "font-semibold" : "font-bold"}`}>
											{item.title}
										</h3>
										<span className="text-xs text-gray-400 font-medium whitespace-nowrap">
											{formatNotificationTime(item.createdAt)}
										</span>
									</div>
									<p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{item.content}</p>

									{item.link && (
										<span className="inline-flex items-center text-xs font-semibold text-blue-600 group-hover:text-blue-800 transition-colors mt-3">
											Xem chi tiết →
										</span>
									)}
								</div>


								{!item.isRead && (
									<div className="flex-shrink-0 self-center">
										<div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
