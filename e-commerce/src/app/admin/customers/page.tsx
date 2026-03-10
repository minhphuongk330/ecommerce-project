"use client";
import { useEffect, useState } from "react";
import AdminFilter from "~/components/Admin/AdminFilter";
import CustomerDetailsModal from "~/components/Admin/CustomerDetailsModal";
import ExportButton from "~/components/Admin/ExportButton";
import { TableSkeleton } from "~/components/Skeletons";
import CustomerTable from "~/components/Table/Customers";
import { useNotification } from "~/contexts/Notification";
import { useTableFilter } from "~/hooks/useTableFilter";
import { adminService } from "~/services/admin";
import { AdminCustomer } from "~/types/admin";
import { FilterConfig } from "~/types/filter";

export default function CustomersPage() {
	const [allCustomers, setAllCustomers] = useState<AdminCustomer[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
	const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
	const selectCount = selectedIds.size;
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

	const handleSelectChange = (id: number) => {
		setSelectedIds(prev => {
			const newSet = new Set(prev);
			if (newSet.has(id)) newSet.delete(id);
			else newSet.add(id);
			return newSet;
		});
	};

	const handleSelectAllVisible = (selected: boolean, visibleIds: number[]) => {
		setSelectedIds(prev => {
			const newSet = new Set(prev);
			if (selected) {
				visibleIds.forEach(id => newSet.add(id));
			} else {
				visibleIds.forEach(id => newSet.delete(id));
			}
			return newSet;
		});
	};

	const selectedItems = filteredCustomers.filter(customer => selectedIds.has(customer.id));

	const customerExportColumns = [
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

	if (loading) {
		return (
			<div className="space-y-6">
				<h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
				<TableSkeleton rows={8} columns={5} />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
				<div className="flex items-center gap-4">
					<div className="text-sm text-gray-500">
						{selectCount > 0 && (
							<span className="mr-4 font-semibold">
								Selected: <span className="text-blue-600">{selectCount}</span> / {filteredCustomers.length}
							</span>
						)}
					</div>
					<ExportButton
						data={selectCount > 0 ? selectedItems : filteredCustomers}
						columns={customerExportColumns}
						filename="customers"
						label={selectCount > 0 ? `Export Selected (${selectCount})` : "Export"}
						variant="both"
						showCount={false}
						disabled={selectCount === 0}
					/>
				</div>
			</div>

			<AdminFilter
				fields={filterConfig.fields}
				filterState={filterState}
				onFilterChange={setFilterValue}
				onReset={resetFilters}
				isFiltered={isFiltered}
				loading={loading}
			/>

			<CustomerTable
				customers={filteredCustomers}
				selectedIds={selectedIds}
				onSelectChange={handleSelectChange}
				onSelectAll={handleSelectAllVisible}
				onSelectCustomer={setSelectedCustomer}
			/>

			<CustomerDetailsModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
		</div>
	);
}
