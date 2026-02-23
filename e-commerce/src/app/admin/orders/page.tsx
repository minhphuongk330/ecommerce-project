"use client";
import { useEffect, useMemo, useState } from "react";
import AdminTableFilter, { FilterConfig } from "~/components/Admin/AdminTableFilter";
import OrdersTable from "~/components/Table/Orders";
import ConfirmationModal from "~/components/atoms/Confirmation";
import { useNotification } from "~/contexts/Notification";
import { adminService } from "~/services/admin";
import { AdminOrder } from "~/types/admin";

const STATUS_OPTIONS = [
	{ value: "Pending", label: "Pending" },
	{ value: "Shipped", label: "Shipped" },
	{ value: "Completed", label: "Completed" },
	{ value: "Cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
	const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
	const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("");

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

	useMemo(() => {
		const filtered = allOrders.filter(order => {
			const orderNo = order.orderNo || order.id;
			const customerName = order.customer?.fullName || "";
			const customerEmail = order.customer?.email || "";

			const matchesSearch =
				orderNo.toString().includes(searchTerm.toLowerCase()) ||
				customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus = !statusFilter || order.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
		setFilteredOrders(filtered);
	}, [allOrders, searchTerm, statusFilter]);

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

	if (loading) {
		return <div className="p-8 text-gray-500">Loading order list...</div>;
	}

	const filterConfig: FilterConfig = {
		searchPlaceholder: "Search by order ID, customer name, or email...",
		filterOptions: {
			Status: STATUS_OPTIONS,
		},
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
				<div className="text-sm text-gray-500">
					Total: <span className="font-semibold text-gray-800">{filteredOrders.length}</span>
				</div>
			</div>

			<AdminTableFilter
				config={filterConfig}
				onSearch={setSearchTerm}
				onFilterChange={(filterKey, value) => {
					if (filterKey === "Status") setStatusFilter(value);
				}}
			/>

			<OrdersTable orders={filteredOrders} onStatusChange={onRequestStatusChange} />

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
