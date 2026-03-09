"use client";
import { useEffect, useState } from "react";
import AdminFilter from "~/components/Admin/AdminFilter";
import CustomerTable from "~/components/Table/Customers";
import { useNotification } from "~/contexts/Notification";
import { useTableFilter } from "~/hooks/useTableFilter";
import { adminService } from "~/services/admin";
import { AdminCustomer } from "~/types/admin";
import { FilterConfig } from "~/types/filter";

export default function CustomersPage() {
	const [allCustomers, setAllCustomers] = useState<AdminCustomer[]>([]);
	const [loading, setLoading] = useState(true);
	const { showNotification } = useNotification();

	const filterConfig: FilterConfig = {
		fields: [
			{
				name: "search",
				label: "Search",
				type: "text",
				placeholder: "Search by name or email...",
			},
			{
				name: "createdAt",
				label: "Join Date",
				type: "daterange",
			},
		],
	};

	const {
		filteredData: filteredCustomers,
		filterState,
		setFilterValue,
		resetFilters,
		isFiltered,
	} = useTableFilter({
		data: allCustomers,
		config: filterConfig,
		predicates: {
			search: (item, filters) => {
				const searchTerm = filters.search;
				if (!searchTerm) return true;

				return (
					item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.email.toLowerCase().includes(searchTerm.toLowerCase())
				);
			},
			createdAt: (item, filters) => {
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
		},
	});

	const fetchCustomers = async () => {
		try {
			setLoading(true);
			const data = await adminService.getCustomers();
			setAllCustomers(data);
		} catch (error) {
			console.error("Failed to fetch customers", error);
			showNotification("Failed to load customer list", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	if (loading) return <div className="p-8 text-gray-500">Loading customer list...</div>;

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
			</div>

			<AdminFilter
				fields={filterConfig.fields}
				filterState={filterState}
				onFilterChange={setFilterValue}
				onReset={resetFilters}
				isFiltered={isFiltered}
				loading={loading}
			/>

			<CustomerTable customers={filteredCustomers} />
		</div>
	);
}
