import ContactMailOutlined from "@mui/icons-material/ContactMailOutlined";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import MarkChatReadOutlined from "@mui/icons-material/MarkChatReadOutlined";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";

/**
 * Định dạng thời gian tương đối từ chuỗi ngày giờ.
 * Ví dụ: "Vừa xong", "5 phút trước", "3 giờ trước", hoặc ngày giờ đầy đủ.
 */
export function formatNotificationTime(dateStr: string): string {
	try {
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);

		if (diffMins < 1) return "Vừa xong";
		if (diffMins < 60) return `${diffMins} phút trước`;
		if (diffHours < 24) return `${diffHours} giờ trước`;

		return date.toLocaleDateString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return "";
	}
}

/**
 * Trả về icon tương ứng với loại thông báo.
 * @param type - Loại thông báo từ server (NEW_ORDER, ORDER_STATUS, OUT_OF_STOCK, NEW_CONTACT, CONTACT_REPLY, v.v.)
 * @param size - Kích thước icon MUI ("small" | "medium"). Mặc định là "small".
 */
export function getNotificationIcon(type: string, size: "small" | "medium" = "small") {
	switch (type) {
		case "NEW_ORDER":
		case "ORDER_STATUS":
			return <ShoppingBagOutlined className="text-emerald-600" fontSize={size} />;
		case "OUT_OF_STOCK":
			return <ErrorOutlineOutlined className="text-rose-600" fontSize={size} />;
		case "NEW_CONTACT":
			return <ContactMailOutlined className="text-blue-600" fontSize={size} />;
		case "CONTACT_REPLY":
			return <MarkChatReadOutlined className="text-indigo-600" fontSize={size} />;
		default:
			return <NotificationsOutlined className="text-gray-500" fontSize={size} />;
	}
}
