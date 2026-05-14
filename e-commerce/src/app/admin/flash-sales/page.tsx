"use client";
import { useCallback, useEffect, useState } from "react";
import { adminService } from "~/services/admin";
import { useNotification } from "~/contexts/Notification";
import FlashSaleList from "~/components/Admin/FlashSales/List";
import FlashSaleCreateModal from "~/components/Admin/FlashSales/CreateModal";
import { TableSkeleton } from "~/components/Skeletons";
import Bolt from "@mui/icons-material/Bolt";
import AddIcon from "@mui/icons-material/Add";

export default function FlashSalesPage() {
	const [flashSales, setFlashSales] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const { showNotification } = useNotification();

	const fetchFlashSales = useCallback(async () => {
		try {
			setLoading(true);
			const data = await adminService.getFlashSales();
			setFlashSales(data);
		} catch {
			showNotification("Không thể tải danh sách flash sale", "error");
		} finally {
			setLoading(false);
		}
	}, [showNotification]);

	useEffect(() => {
		fetchFlashSales();
	}, [fetchFlashSales]);

	const handleToggleActive = async (id: number, isActive: boolean) => {
		try {
			await adminService.updateFlashSale(id, { isActive });
			showNotification(isActive ? "Đã bật Flash Sale" : "Đã tắt Flash Sale", "success");
			fetchFlashSales();
		} catch {
			showNotification("Cập nhật thất bại", "error");
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm("Xác nhận xóa Flash Sale này?")) return;
		try {
			await adminService.deleteFlashSale(id);
			showNotification("Đã xóa Flash Sale", "success");
			fetchFlashSales();
		} catch {
			showNotification("Xóa thất bại", "error");
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
						<Bolt className="!text-red-600" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-800">Flash Sales</h1>
						<p className="text-sm text-gray-500">Quản lý chương trình flash sale</p>
					</div>
				</div>
				<button
					onClick={() => setIsCreateOpen(true)}
					className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
				>
					<AddIcon fontSize="small" />
					Tạo Flash Sale
				</button>
			</div>

			{/* Content */}
			{loading ? (
				<TableSkeleton rows={4} columns={5} />
			) : (
				<FlashSaleList
					flashSales={flashSales}
					onToggleActive={handleToggleActive}
					onDelete={handleDelete}
					onRefresh={fetchFlashSales}
				/>
			)}

			{/* Create Modal */}
			<FlashSaleCreateModal
				open={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
				onSuccess={() => {
					setIsCreateOpen(false);
					fetchFlashSales();
				}}
			/>
		</div>
	);
}
