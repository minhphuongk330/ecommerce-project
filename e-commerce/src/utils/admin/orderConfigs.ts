import { AdminOrder } from "~/types/admin";
import { FilterConfig } from "~/types/filter";
import { ExportColumn } from "~/utils/export";
import { formatDate, formatPrice } from "~/utils/format";

export const ORDER_FILTER_CONFIG: FilterConfig = {
	fields: [
		{
			name: "search",
			label: "Search",
			type: "text",
			placeholder: "Search by order #, customer name, or email...",
		},
		{
			name: "status",
			label: "Status",
			type: "select",
			options: [
				{ label: "Pending", value: "Pending" },
				{ label: "Shipped", value: "Shipped" },
				{ label: "Completed", value: "Completed" },
				{ label: "Cancelled", value: "Cancelled" },
			],
		},
		{
			name: "createdAt",
			label: "Order Date",
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
	{ key: "orderNo", label: "Order #" },
	{
		key: "customer.fullName",
		label: "Customer Name",
		formatter: value => value || "---",
	},
	{
		key: "customer.email",
		label: "Customer Email",
		formatter: value => value || "---",
	},
	{ key: "status", label: "Status" },
	{
		key: "totalAmount",
		label: "Total Amount",
		formatter: value => (value != null ? formatPrice(value) : ""),
	},
	{
		key: "createdAt",
		label: "Order Date",
		formatter: value => (value != null ? formatDate(value) : ""),
	},
	{
		key: "scheduledDeliveryDate",
		label: "Scheduled Delivery Date",
		formatter: value => (value ? formatDate(value) : "---"),
	},
	{
		key: "address.receiverName",
		label: "Receiver Name",
		formatter: value => value || "---",
	},
	{
		key: "address.address",
		label: "Delivery Address",
		formatter: value => value || "---",
	},
	{
		key: "address.phone",
		label: "Phone",
		formatter: value => value || "---",
	},
];
