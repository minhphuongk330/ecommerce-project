import { AdminOrder } from "~/types/admin";
import { FilterConfig } from "~/types/filter";
import { ExportColumn } from "~/utils/export";
import { formatDate, formatPrice } from "~/utils/format";

export const ORDER_FILTER_CONFIG: FilterConfig = {
	fields: [
		{
			name: "search",
			label: "Tìm kiếm",
			type: "text",
			placeholder: "Tìm kiếm theo mã đơn, tên khách hàng hoặc email...",
		},
		{
			name: "status",
			label: "Trạng thái",
			type: "select",
			options: [
				{ label: "Chờ xác nhận", value: "Pending" },
				{ label: "Đang giao hàng", value: "Shipped" },
				{ label: "Đã hoàn thành", value: "Completed" },
				{ label: "Đã hủy", value: "Cancelled" },
			],
		},
		{
			name: "price",
			label: "Giá",
			type: "numberrange",
			placeholder: "Ví dụ: 100k - 500k",
		},
		{
			name: "createdAt",
			label: "Ngày đặt hàng",
			type: "daterange",
		},
	],
};

export const ORDER_FILTER_PREDICATES = {
	search: (item: AdminOrder, filters: any) => {
		const searchTerm = filters.search;
		if (!searchTerm) return true;
		const orderNo = item.orderNo || item.id;
		const customerName = item.customer?.fullName || "";
		const customerEmail = item.customer?.email || "";
		return (
			orderNo.toString().includes(searchTerm.toLowerCase()) ||
			customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
		);
	},
	status: (item: AdminOrder, filters: any) => {
		const statusFilter = filters.status;
		if (!statusFilter) return true;
		return item.status === statusFilter;
	},
	createdAt: (item: AdminOrder, filters: any) => {
		const dateRange = filters.createdAt;
		if (!dateRange || (!dateRange[0] && !dateRange[1])) return true;
		const itemDate = new Date(item.createdAt);
		const [startDateStr, endDateStr] = dateRange;
		if (startDateStr) {
			const startDate = new Date(startDateStr);
			startDate.setHours(0, 0, 0, 0);
			if (itemDate < startDate) return false;
		}
		if (endDateStr) {
			const endDate = new Date(endDateStr);
			endDate.setHours(23, 59, 59, 999);
			if (itemDate > endDate) return false;
		}
		return true;
	},
	totalAmount: (item: AdminOrder, filters: any) => {
		const range = filters.totalAmount;
		if (!Array.isArray(range)) return true;
		const [min, max] = range;
		const amount = Number(item.totalAmount);
		if (min !== null && min !== "" && !isNaN(Number(min)) && amount < Number(min)) return false;
		if (max !== null && max !== "" && !isNaN(Number(max)) && amount > Number(max)) return false;
		return true;
	},
	scheduledDeliveryDate: (item: AdminOrder, filters: any) => {
		const dateRange = filters.scheduledDeliveryDate;
		if (!dateRange || (!dateRange[0] && !dateRange[1])) return true;
		if (!item.scheduledDeliveryDate) return true;
		const itemDate = new Date(item.scheduledDeliveryDate);
		const [startDateStr, endDateStr] = dateRange;
		if (startDateStr) {
			const startDate = new Date(startDateStr);
			startDate.setHours(0, 0, 0, 0);
			if (itemDate < startDate) return false;
		}
		if (endDateStr) {
			const endDate = new Date(endDateStr);
			endDate.setHours(23, 59, 59, 999);
			if (itemDate > endDate) return false;
		}
		return true;
	},
};

export const ORDER_EXPORT_COLUMNS: ExportColumn<AdminOrder>[] = [
	{ key: "orderNo", label: "Mã đơn hàng" },
	{
		key: "customer.fullName",
		label: "Tên khách hàng",
		formatter: value => value || "---",
	},
	{
		key: "customer.email",
		label: "Email khách hàng",
		formatter: value => value || "---",
	},
	{ key: "status", label: "Trạng thái" },
	{
		key: "totalAmount",
		label: "Tổng tiền",
		formatter: value => (value != null ? formatPrice(value) : ""),
	},
	{
		key: "createdAt",
		label: "Ngày đặt hàng",
		formatter: value => (value != null ? formatDate(value) : ""),
	},
	{
		key: "scheduledDeliveryDate",
		label: "Ngày hẹn giao",
		formatter: value => (value ? formatDate(value) : "---"),
	},
	{
		key: "address.receiverName",
		label: "Tên người nhận",
		formatter: value => value || "---",
	},
	{
		key: "address.address",
		label: "Địa chỉ giao hàng",
		formatter: value => value || "---",
	},
	{
		key: "address.phone",
		label: "Số điện thoại",
		formatter: value => value || "---",
	},
];
