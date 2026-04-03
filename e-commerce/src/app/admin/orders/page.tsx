"use client";
import { useCallback, useState } from "react";
import AdminFilter from "~/components/Admin/AdminFilter";
import AdminPageHeader from "~/components/Admin/AdminPageHeader";
import { TableSkeleton } from "~/components/Skeletons";
import OrdersTable from "~/components/Table/Orders";
import ConfirmationModal from "~/components/atoms/Confirmation";
import { useNotification } from "~/contexts/Notification";
import { useAdminTableManager } from "~/hooks/useAdminTableManager";
import { adminService } from "~/services/admin";
import { AdminOrder } from "~/types/admin";
import { ORDER_EXPORT_COLUMNS, ORDER_FILTER_CONFIG, ORDER_FILTER_PREDICATES } from "~/utils/admin/orderConfigs";
import { FINAL_ORDER_STATUSES } from "~/utils/order";
import { OrderStatus } from "~/types/order";

export default function OrdersPage() {
	const [confirmModal, setConfirmModal] = useState<{
		isOpen: boolean;
		orderId: number | null;
		newStatus: string | null;
	}>({
		isOpen: false,
		orderId: null,
		newStatus: null,
	});
	const { showNotification } = useNotification();
	const fetchOrdersFn = useCallback(() => adminService.getOrders(), []);
	const onFetchError = useCallback(
		(error: any) => {
			console.error("Failed to fetch orders", error);
			showNotification("Unable to load the order list", "error");
		},
		[showNotification],
	);

	const {
		allData: allOrders,
		filteredData: filteredOrders,
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
		setData: setAllOrders,
		fetchData: fetchOrders,
	} = useAdminTableManager<AdminOrder>({
		filterConfig: ORDER_FILTER_CONFIG,
		predicates: ORDER_FILTER_PREDICATES,
		fetchFn: fetchOrdersFn,
		onFetchError,
	});

	const onRequestStatusChange = (orderId: number, newStatus: string) => {
		const currentOrder = allOrders.find(o => o.id === orderId);
		if (currentOrder && FINAL_ORDER_STATUSES.includes(currentOrder.status as OrderStatus)) {
			showNotification("Cannot change status of a finalized order.", "error");
			return;
		}
		setConfirmModal({
			isOpen: true,
			orderId,
			newStatus,
		});
	};

	const handleConfirmUpdate = async () => {
		const { orderId, newStatus } = confirmModal;
		if (!orderId || !newStatus) return;
		try {
			await adminService.updateOrderStatus(orderId, newStatus);
			const updatedOrders = allOrders.map(order => (order.id === orderId ? { ...order, status: newStatus } : order));
			setAllOrders(updatedOrders);
			showNotification("Status updated successfully!", "success");
		} catch (error) {
			console.error("Update status failed:", error);
			showNotification("Update failed. Please try again.", "error");
		} finally {
			closeConfirmModal();
		}
	};

	const closeConfirmModal = () => {
		setConfirmModal(prev => ({ ...prev, isOpen: false }));
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
				<TableSkeleton rows={8} columns={7} />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Order Management"
				selectCount={selectCount}
				totalCount={filteredOrders.length}
				exportData={selectCount > 0 ? selectedItems : filteredOrders}
				exportColumns={ORDER_EXPORT_COLUMNS}
				exportFilename="orders"
				exportLabel="Export"
			/>

			<AdminFilter
				fields={ORDER_FILTER_CONFIG.fields}
				filterState={filterState}
				onFilterChange={setFilterValue}
				onReset={resetFilters}
				isFiltered={isFiltered}
			/>

			<OrdersTable
				orders={filteredOrders}
				onStatusChange={onRequestStatusChange}
				selectedIds={selectedIds}
				onSelectChange={handleSelectChange}
				onSelectAll={handleSelectAllVisible}
			/>

			<ConfirmationModal
				isOpen={confirmModal.isOpen}
				onClose={closeConfirmModal}
				onConfirm={handleConfirmUpdate}
				title="Update Order Status"
				message={`Are you sure you want to change the status to "${confirmModal.newStatus}"?`}
				confirmLabel="Update"
				confirmButtonColor="!bg-blue-600 hover:!bg-blue-700"
			/>
		</div>
	);
}
