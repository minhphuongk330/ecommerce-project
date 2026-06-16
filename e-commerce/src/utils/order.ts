import { OrderStatus } from "~/types/order";

export const FINAL_ORDER_STATUSES: OrderStatus[] = ["Completed", "Cancelled"];

export const getOrderStatusColor = (status: OrderStatus) => {
	switch (status) {
		case "Pending":
			return "text-yellow-600 bg-yellow-50 border-yellow-200";
		case "Processing":
			return "text-orange-600 bg-orange-50 border-orange-200";
		case "Shipped":
			return "text-blue-600 bg-blue-50 border-blue-200";
		case "Completed":
			return "text-green-600 bg-green-50 border-green-200";
		case "Cancelled":
			return "text-red-600 bg-red-50 border-red-200";
		default:
			return "text-gray-600 bg-gray-50 border-gray-200";
	}
};

export const getOrderStatusText = (status: OrderStatus) => {
	switch (status) {
		case "Pending":
			return "Chờ xác nhận";
		case "Processing":
			return "Đang chuẩn bị hàng";
		case "Shipped":
			return "Đang giao hàng";
		case "Completed":
			return "Đã hoàn thành";
		case "Cancelled":
			return "Đã hủy";
		default:
			return status;
	}
};

export const getPaymentStatusColor = (status?: string) => {
	switch (status) {
		case "pending":
			return "text-yellow-600 bg-yellow-50 border-yellow-200";
		case "paid":
			return "text-green-600 bg-green-50 border-green-200";
		case "failed":
			return "text-red-600 bg-red-50 border-red-200";
		case "cancelled":
			return "text-gray-600 bg-gray-50 border-gray-200";
		default:
			return "text-yellow-600 bg-yellow-50 border-yellow-200";
	}
};

export const getPaymentStatusText = (status?: string) => {
	switch (status) {
		case "pending":
			return "Chưa thanh toán";
		case "paid":
			return "Đã thanh toán";
		case "failed":
			return "Thanh toán thất bại";
		case "cancelled":
			return "Đã hủy thanh toán";
		default:
			return "Chưa thanh toán";
	}
};

