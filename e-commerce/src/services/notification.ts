import axiosClient from "./axiosClient";

export interface WebNotification {
	id: number;
	userId: number | null;
	title: string;
	content: string;
	type: string;
	link?: string;
	isRead: boolean;
	isAdmin: boolean;
	createdAt: string;
}

export const notificationService = {
	getNotifications: async (): Promise<WebNotification[]> => {
		return axiosClient.get("/notifications");
	},

	getUnreadCount: async (): Promise<number> => {
		return axiosClient.get("/notifications/unread-count");
	},

	markAsRead: async (id: number): Promise<WebNotification> => {
		return axiosClient.patch(`/notifications/${id}/read`);
	},

	markAllAsRead: async (): Promise<{ success: boolean }> => {
		return axiosClient.patch("/notifications/read-all");
	},

	getAdminNotifications: async (): Promise<WebNotification[]> => {
		return axiosClient.get("/admin/notifications");
	},

	getAdminUnreadCount: async (): Promise<number> => {
		return axiosClient.get("/admin/notifications/unread-count");
	},

	markAdminAsRead: async (id: number): Promise<WebNotification> => {
		return axiosClient.patch(`/admin/notifications/${id}/read`);
	},

	markAdminAllAsRead: async (): Promise<{ success: boolean }> => {
		return axiosClient.patch("/admin/notifications/read-all");
	},
};
