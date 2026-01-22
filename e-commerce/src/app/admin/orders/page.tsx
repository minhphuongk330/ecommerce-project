"use client";
import { useEffect, useState } from "react";
import OrdersTable from "~/components/Table/Orders";
import ConfirmationModal from "~/components/atoms/Confirmation";
import { useNotification } from "~/contexts/Notification";
import { adminService } from "~/services/admin";
import { AdminOrder } from "~/types/admin";

export default function OrdersPage() {
	const [orders, setOrders] = useState<AdminOrder[]>([]);
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

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const data = await adminService.getOrders();
			setOrders(data);
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

	const onRequestStatusChange = (orderId: number, newStatus: string) => {
		const currentOrder = orders.find(o => o.id === orderId);
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
			setOrders(prevOrders =>
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

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
				<div className="text-sm text-gray-500">
					Total: <span className="font-semibold text-gray-800">{orders.length}</span>
				</div>
			</div>

			<OrdersTable orders={orders} onStatusChange={onRequestStatusChange} />

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
