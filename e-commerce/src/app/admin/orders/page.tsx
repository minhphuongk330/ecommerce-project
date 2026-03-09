"use client";
import { useEffect, useState } from "react";
import AdminFilter from "~/components/Admin/AdminFilter";
import ExportButton from "~/components/Admin/ExportButton";
import OrdersTable from "~/components/Table/Orders";
import ConfirmationModal from "~/components/atoms/Confirmation";
import { useNotification } from "~/contexts/Notification";
import { useSelection } from "~/hooks/useSelection";
import { useTableFilter } from "~/hooks/useTableFilter";
import { adminService } from "~/services/admin";
import { AdminOrder } from "~/types/admin";
import { FilterConfig } from "~/types/filter";
import { ExportColumn } from "~/utils/export";
import { formatDate, formatPrice } from "~/utils/format";

export default function OrdersPage() {
	const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
	const [loading, setLoading] = useState(true);

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

	const filterConfig: FilterConfig = {
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

	const exportColumns: ExportColumn<AdminOrder>[] = [
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
			formatter: value => formatPrice(value),
		},
		{
			key: "createdAt",
			label: "Order Date",
			formatter: value => formatDate(value),
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
	const {
		filteredData: filteredOrders,
		filterState,
		setFilterValue,
		resetFilters,
		isFiltered,
	} = useTableFilter({
		data: allOrders,
		config: filterConfig,
		predicates: {
			search: (item, filters) => {
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
			status: (item, filters) => {
				const statusFilter = filters.status;
				if (!statusFilter) return true;
				return item.status === statusFilter;
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
			scheduledDeliveryDate: (item, filters) => {
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
		},
	});

	const { selectedIds, selectedItems, toggleSelect, toggleAll, clearSelection, selectCount } = useSelection({
		data: filteredOrders,
		getId: order => order.id,
	});

	const onRequestStatusChange = (orderId: number, newStatus: string) => {
		const currentOrder = allOrders.find(o => o.id === orderId);
		if (currentOrder && ["Completed", "Cancelled"].includes(currentOrder.status)) {
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
			setAllOrders(prevOrders =>
				prevOrders.map(order => (order.id === orderId ? { ...order, status: newStatus } : order)),
			);
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
	const fetchOrders = async () => {
		try {
			setLoading(true);
			const data = await adminService.getOrders();
			setAllOrders(data);
		} catch (error) {
			console.error("Failed to fetch orders", error);
			showNotification("Unable to load the order list", "error");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchOrders();
	}, []);
	if (loading) {
		return <div className="p-8 text-gray-500">Loading order list...</div>;
	}
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
				<div className="flex items-center gap-4">
					<div className="text-sm text-gray-500">
						{selectCount > 0 && (
							<span className="mr-4 font-semibold">
								Selected: <span className="text-blue-600">{selectCount}</span> / {filteredOrders.length}
							</span>
						)}
					</div>
					<ExportButton
						data={selectCount > 0 ? selectedItems : filteredOrders}
						columns={exportColumns}
						filename="orders"
						label={selectCount > 0 ? `Export Selected (${selectCount})` : "Export"}
						variant="csv"
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

			<OrdersTable
				orders={filteredOrders}
				onStatusChange={onRequestStatusChange}
				selectedIds={selectedIds}
				onSelectChange={toggleSelect}
				onSelectAll={toggleAll}
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
