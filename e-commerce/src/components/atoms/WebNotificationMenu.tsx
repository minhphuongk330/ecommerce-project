"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import Circle from "@mui/icons-material/Circle";

import CommonIconButton from "~/components/atoms/IconButton";
import { useWebNotifications } from "~/hooks/useWebNotifications";
import { useScrollLock } from "~/hooks/useScrollLock";
import { WebNotification } from "~/services/notification";
import { useAuthStore } from "~/stores/useAuth";
import { formatNotificationTime, getNotificationIcon } from "~/utils/notification";

interface WebNotificationMenuProps {
	isAdmin?: boolean;
	iconColorClass?: string;
}


const WebNotificationMenu: React.FC<WebNotificationMenuProps> = ({ isAdmin = false, iconColorClass = "text-black" }) => {
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useWebNotifications(isAdmin);
	const [isMounted, setIsMounted] = useState(false);
	const { isAuthenticated } = useAuthStore();

	React.useEffect(() => {
		setIsMounted(true);
	}, []);

	useScrollLock(!!anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleNotificationClick = async (item: WebNotification) => {
		handleClose();
		if (!item.isRead) {
			await markAsRead(item.id);
		}
		if (item.link) {
			router.push(item.link);
		}
	};

	const handleMarkAllReadClick = async (e: React.MouseEvent) => {
		e.stopPropagation();
		await markAllAsRead();
	};

	const handleViewAllClick = () => {
		handleClose();
		if (isAdmin) {
			router.push("/admin/orders"); // Default for admin view all
		} else {
			router.push("/notifications");
		}
	};

	const displayNotifications = notifications.slice(0, 6);

	return (
		<>
			<CommonIconButton
				icon={
					<Badge
						badgeContent={isMounted ? unreadCount : 0}
						color="error"
						max={99}
						sx={{
							"& .MuiBadge-badge": {
								fontSize: { xs: "9px", md: "11px" },
								height: { xs: "16px", md: "18px" },
								minWidth: { xs: "16px", md: "18px" },
								padding: "0 4px",
							},
						}}
					>
						<NotificationsOutlined className={`${iconColorClass}`} sx={{ fontSize: { xs: 24, md: 28 } }} />
					</Badge>
				}
				onClick={handleClick}
				className={`hover:bg-gray-100 p-2 rounded-full transition-colors`}
			/>

			<Menu
				anchorEl={anchorEl}
				open={!!anchorEl}
				onClose={handleClose}
				disableScrollLock
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
				sx={{ mt: 1 }}
				PaperProps={{
					sx: {
						width: 360,
						maxHeight: 480,
						boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
						borderRadius: "12px",
						overflow: "hidden",
					},
				}}
			>
				{/* Header */}
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, py: 1.5 }}>
					<Typography variant="subtitle1" fontWeight="bold" className="text-gray-900">
						Thông báo
					</Typography>
					{unreadCount > 0 && (
						<button
							onClick={handleMarkAllReadClick}
							className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
						>
							Đánh dấu đã đọc tất cả
						</button>
					)}
				</Box>

				<Divider />

				{/* List */}
				<Box sx={{ overflowY: "auto", maxHeight: 360 }}>
					{!isAuthenticated ? (
						<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 5, px: 3 }}>
							<NotificationsOutlined sx={{ fontSize: 40 }} className="text-gray-300 mb-2" />
							<Typography variant="body2" className="text-gray-500 text-center mb-4">
								Vui lòng đăng nhập để xem thông báo
							</Typography>
							<button
								onClick={() => {
									handleClose();
									router.push("/auth/login");
								}}
								className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:opacity-80 transition-opacity"
							>
								Đăng nhập
							</button>
						</Box>
					) : loading && notifications.length === 0 ? (
						<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
							<CircularProgress size={24} className="text-blue-600" />
						</Box>
					) : displayNotifications.length === 0 ? (
						<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6, px: 2 }}>
							<NotificationsOutlined sx={{ fontSize: 40 }} className="text-gray-300 mb-2" />
							<Typography variant="body2" className="text-gray-500 text-center">
								Không có thông báo nào
							</Typography>
						</Box>
					) : (
						displayNotifications.map(item => (
							<MenuItem
								key={item.id}
								onClick={() => handleNotificationClick(item)}
								sx={{
									py: 1.5,
									px: 2,
									display: "flex",
									alignItems: "flex-start",
									gap: 1.5,
									whiteSpace: "normal",
									borderBottom: "1px solid #f3f4f6",
									backgroundColor: item.isRead ? "transparent" : "#eff6ff",
									"&:hover": {
										backgroundColor: item.isRead ? "#f9fafb" : "#e0f2fe",
									},
								}}
							>
								{/* Icon */}
								<div className="flex-shrink-0 mt-0.5 p-1 bg-white rounded-lg border border-gray-100 shadow-sm">
									{getNotificationIcon(item.type)}
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-start gap-1">
										<Typography variant="body2" fontWeight={item.isRead ? "medium" : "bold"} className="text-gray-900 line-clamp-1">
											{item.title}
										</Typography>
										{!item.isRead && <Circle className="text-blue-600 flex-shrink-0 mt-1" sx={{ fontSize: 8 }} />}
									</div>
									<Typography variant="caption" className="text-gray-600 line-clamp-2 mt-0.5">
										{item.content}
									</Typography>
									<Typography variant="caption" className="text-gray-400 block mt-1">
										{formatNotificationTime(item.createdAt)}
									</Typography>
								</div>
							</MenuItem>
						))
					)}
				</Box>

				<Divider />

				{/* Footer */}
				{isAuthenticated && (
					<Box sx={{ py: 1, px: 2, display: "flex", justifyContent: "center" }}>
						<button
							onClick={handleViewAllClick}
							className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors w-full text-center py-1"
						>
							{isAdmin ? "Xem danh sách đơn hàng" : "Xem tất cả thông báo"}
						</button>
					</Box>
				)}
			</Menu>
		</>
	);
};

export default WebNotificationMenu;
