"use client";
import { useCallback, useState } from "react";
import AdminFilter from "~/components/Admin/AdminFilter";
import CustomerDetailsModal from "~/components/Admin/CustomerDetailsModal";
import ExportButton from "~/components/Admin/ExportButton";
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
		selectedItems,
		filterState,
		isFiltered,
		setFilterValue,
		resetFilters,
		handleSelectChange,
		handleSelectAllVisible,
	} = useAdminTableManager<AdminCustomer>({
		filterConfig: CUSTOMER_FILTER_CONFIG,
		predicates: CUSTOMER_FILTER_PREDICATES,
		fetchFn: fetchCustomersFn,
		onFetchError,
	});

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
						columns={CUSTOMER_EXPORT_COLUMNS}
						filename="customers"
						label={selectCount > 0 ? `Export Selected (${selectCount})` : "Export"}
						variant="both"
						showCount={false}
						disabled={selectCount === 0}
					/>
				</div>
			</div>

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
			/>

			<CustomerDetailsModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
		</div>
	);
}
