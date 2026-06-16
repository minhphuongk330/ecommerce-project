import { useState, useEffect, useCallback } from "react";
import { notificationService, WebNotification } from "~/services/notification";
import { useAuthStore } from "~/stores/useAuth";

export function useWebNotifications(isAdmin = false) {
	const [notifications, setNotifications] = useState<WebNotification[]>([]);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const { isAuthenticated } = useAuthStore();

	const fetchNotificationsData = useCallback(async () => {
		if (!isAuthenticated) return;
		try {
			let data: WebNotification[] = [];
			let count = 0;

			if (isAdmin) {
				data = await notificationService.getAdminNotifications();
				count = await notificationService.getAdminUnreadCount();
			} else {
				data = await notificationService.getNotifications();
				count = await notificationService.getUnreadCount();
			}

			setNotifications(data);
			setUnreadCount(count);
		} catch (error) {
			console.error("Failed to fetch web notifications:", error);
		}
	}, [isAuthenticated, isAdmin]);

	const markAsRead = async (id: number) => {
		try {
			if (isAdmin) {
				await notificationService.markAdminAsRead(id);
			} else {
				await notificationService.markAsRead(id);
			}

			setNotifications(prev =>
				prev.map(notif => (notif.id === id ? { ...notif, isRead: true } : notif)),
			);
			setUnreadCount(prev => Math.max(0, prev - 1));
		} catch (error) {
			console.error("Failed to mark notification as read:", error);
		}
	};

	const markAllAsRead = async () => {
		try {
			if (isAdmin) {
				await notificationService.markAdminAllAsRead();
			} else {
				await notificationService.markAllAsRead();
			}
			setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
			setUnreadCount(0);
		} catch (error) {
			console.error("Failed to mark all notifications as read:", error);
		}
	};


	useEffect(() => {
		if (!isAuthenticated) {
			setNotifications([]);
			setUnreadCount(0);
			return;
		}

		setLoading(true);
		fetchNotificationsData().finally(() => setLoading(false));

		const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
		const token = useAuthStore.getState().accessToken;


		if (!token) return;

		let eventSource: EventSource | null = null;
		let retryTimeout: ReturnType<typeof setTimeout> | null = null;
		let retryDelay = 3000;
		let isDestroyed = false;

		const connect = () => {
			if (isDestroyed) return;

			const sseUrl = isAdmin
				? `${API_URL}/admin/notifications/sse?token=${token}`
				: `${API_URL}/notifications/sse?token=${token}`;

			eventSource = new EventSource(sseUrl);

			eventSource.onmessage = (event) => {
				try {
					const parsed = JSON.parse(event.data);

					if (parsed && (parsed.type === "CONNECTED" || parsed.type === "HEARTBEAT")) {
						retryDelay = 3000;
						return;
					}
					const newNotification: WebNotification = parsed;
					setNotifications(prev => [newNotification, ...prev]);
					setUnreadCount(prev => prev + 1);
				} catch (err) {
					console.error("Failed to parse SSE notification:", err);
				}
			};

			eventSource.onerror = () => {
				if (!eventSource) return;
				if (eventSource.readyState === EventSource.CONNECTING) {
					console.warn("[useWebNotifications] SSE mất kết nối, đang thử kết nối lại...");
				} else if (eventSource.readyState === EventSource.CLOSED) {
					console.warn(`[useWebNotifications] SSE đóng. Retry sau ${retryDelay / 1000}s...`);
					eventSource.close();
					eventSource = null;
					if (!isDestroyed) {
						retryTimeout = setTimeout(() => {
							retryDelay = Math.min(retryDelay * 2, 30000);
							connect();
						}, retryDelay);
					}
				}
			};
		};

		connect();

		return () => {
			isDestroyed = true;
			if (retryTimeout) clearTimeout(retryTimeout);
			if (eventSource) eventSource.close();
		};
	}, [isAuthenticated, isAdmin, fetchNotificationsData]);


	return {
		notifications,
		unreadCount,
		loading,
		refetch: fetchNotificationsData,
		markAsRead,
		markAllAsRead,
	};
}
