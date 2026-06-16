import { AdminCustomer } from "~/types/admin";
import { FilterConfig } from "~/types/filter";
import { ExportColumn } from "~/utils/export";

export const CUSTOMER_FILTER_CONFIG: FilterConfig = {
	fields: [
		{
			name: "search",
			label: "Tìm kiếm",
			type: "text",
			placeholder: "Tìm theo tên hoặc email...",
		},
		{
			name: "status",
			label: "Trạng thái",
			type: "select",
			options: [
				{ label: "Đang hoạt động", value: "active" },
				{ label: "Không hoạt động", value: "inactive" },
				{ label: "Bị khóa", value: "banned" },
			],
		},
		{
			name: "createdAt",
			label: "Ngày tham gia",
			type: "daterange",
		},
	],
};

export const CUSTOMER_FILTER_PREDICATES = {
	search: (item: AdminCustomer, filters: any) => {
		const searchTerm = filters.search;
		if (!searchTerm) return true;

		return (
			item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.email.toLowerCase().includes(searchTerm.toLowerCase())
		);
	},
	status: (item: AdminCustomer, filters: any) => {
		const statusFilter = filters.status;
		if (!statusFilter) return true;
		if (statusFilter === "banned") return item.isBanned === true;
		if (statusFilter === "inactive") return !item.isActive && !item.isBanned;
		if (statusFilter === "active") return item.isActive && !item.isBanned;
		return true;
	},
	createdAt: (item: AdminCustomer, filters: any) => {
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
};

export const CUSTOMER_EXPORT_COLUMNS: ExportColumn<AdminCustomer>[] = [
	{ key: "fullName" as const, label: "Họ và tên" },
	{ key: "email" as const, label: "Email" },
	{
		key: "profile.phoneNumber" as any,
		label: "Số điện thoại",
	},
	{
		key: "isActive" as const,
		label: "Trạng thái hoạt động",
		formatter: (value: any) => (value != null ? (value ? "Có" : "Không") : ""),
	},
	{
		key: "createdAt" as const,
		label: "Ngày tham gia",
		formatter: (value: any) => (value != null ? new Date(value).toLocaleDateString("vi-VN") : ""),
	},
];
