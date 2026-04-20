"use client";
import { useCallback, useState } from "react";
import AdminFilter from "~/components/Admin/AdminFilter";
import AdminPageHeader from "~/components/Admin/AdminPageHeader";
import CustomerDetailsModal from "~/components/Admin/CustomerDetailsModal";
import { TableSkeleton } from "~/components/Skeletons";
import CustomerTable from "~/components/Table/Customers";
import { useNotification } from "~/contexts/Notification";
import { useAdminTableManager } from "~/hooks/useAdminTableManager";
import { adminService } from "~/services/admin";
import { AdminCustomer } from "~/types/admin";
import {
	CUSTOMER_EXPORT_COLUMNS,
	CUSTOMER_FILTER_CONFIG,
	CUSTOMER_FILTER_PREDICATES,
} from "~/utils/admin/customerConfigs";

export default function CustomersPage() {
	const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
	const [isMobileSelectMode, setIsMobileSelectMode] = useState(false);
	const { showNotification } = useNotification();
	const fetchCustomersFn = useCallback(() => adminService.getCustomers(), []);
	const onFetchError = useCallback(
		(error: any) => {
			console.error("Failed to fetch customers", error);
			showNotification("Failed to load customer list", "error");
		},
		[showNotification],
	);

	const {
		filteredData: filteredCustomers,
		loading,
		selectCount,
		selectedIds,
		filterState,
		isFiltered,
		setFilterValue,
		resetFilters,
		handleSelectChange,
		handleSelectAllVisible,
		clearSelection,
		fetchData: fetchCustomers,
	} = useAdminTableManager<AdminCustomer>({
		filterConfig: CUSTOMER_FILTER_CONFIG,
		predicates: CUSTOMER_FILTER_PREDICATES,
		fetchFn: fetchCustomersFn,
		onFetchError,
	});

	const handleBulkDelete = async (ids: number[]) => {
		try {
			await Promise.all(ids.map(id => adminService.deleteCustomer(id)));
			showNotification("Customers deleted successfully", "success");
		} catch (error) {
			showNotification("Failed to delete some customers", "error");
		} finally {
			clearSelection();
			setIsMobileSelectMode(false);
			fetchCustomers();
		}
	};

	const handleBanToggle = async (customer: AdminCustomer) => {
		try {
			if (customer.isBanned) {
				await adminService.unbanCustomer(customer.id);
				showNotification(`${customer.fullName} has been unbanned`, "success");
			} else {
				await adminService.banCustomer(customer.id);
				showNotification(`${customer.fullName} has been banned`, "success");
			}
			fetchCustomers();
		} catch (error) {
			showNotification("Failed to update customer status", "error");
		}
	};

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
			<AdminPageHeader
				title="Customer Management"
				selectCount={selectCount}
				totalCount={filteredCustomers.length}
				allData={filteredCustomers}
				exportColumns={CUSTOMER_EXPORT_COLUMNS}
				exportFilename="customers"
				exportLabel="Export"
				selectedIds={selectedIds}
				onBulkDelete={handleBulkDelete}
				isMobileSelectMode={isMobileSelectMode}
				onToggleMobileSelect={() => {
					if (isMobileSelectMode) clearSelection();
					setIsMobileSelectMode(!isMobileSelectMode);
				}}
			/>

			<AdminFilter
				fields={CUSTOMER_FILTER_CONFIG.fields}
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
				onBanToggle={handleBanToggle}
				isMobileSelectMode={isMobileSelectMode}
			/>

			<CustomerDetailsModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
		</div>
	);
}
