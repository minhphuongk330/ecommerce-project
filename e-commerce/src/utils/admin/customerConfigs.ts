import { AdminCustomer } from "~/types/admin";
import { FilterConfig } from "~/types/filter";
import { ExportColumn } from "~/utils/export";

export const CUSTOMER_FILTER_CONFIG: FilterConfig = {
	fields: [
		{
			name: "search",
			label: "Search",
			type: "text",
			placeholder: "Search by name or email...",
		},
		{
			name: "status",
			label: "Status",
			type: "select",
			options: [
				{ label: "Active", value: "active" },
				{ label: "Inactive", value: "inactive" },
				{ label: "Banned", value: "banned" },
			],
		},
		{
			name: "createdAt",
			label: "Join Date",
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
	{ key: "fullName" as const, label: "Full Name" },
	{ key: "email" as const, label: "Email" },
	{
		key: "profile.phoneNumber" as any,
		label: "Phone Number",
	},
	{
		key: "isActive" as const,
		label: "Active",
		formatter: (value: any) => (value != null ? (value ? "Yes" : "No") : ""),
	},
	{
		key: "createdAt" as const,
		label: "Join Date",
		formatter: (value: any) => (value != null ? new Date(value).toLocaleDateString() : ""),
	},
];
