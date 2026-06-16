"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useClientPagination, paginateItems } from "~/hooks/usePagination";
import { adminService } from "~/services/admin";
import { useNotification } from "~/contexts/Notification";
import FlashSaleList from "~/components/Admin/FlashSales/List";
import FlashSaleCreateModal from "~/components/Admin/FlashSales/CreateModal";
import ConfirmationModal from "~/components/atoms/Confirmation";
import PaginationComponent from "~/components/atoms/Pagination";
import AdminEmptyState from "~/components/Admin/AdminEmptyState";
import { TableSkeleton } from "~/components/Skeletons";
import Bolt from "@mui/icons-material/Bolt";
import AddIcon from "@mui/icons-material/Add";

const ITEMS_PER_PAGE = 6;

export default function FlashSalesPage() {
	const [flashSales, setFlashSales] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [flashSaleIdToDelete, setFlashSaleIdToDelete] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
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

	const handleDelete = (id: number) => {
		setFlashSaleIdToDelete(id);
		setDeleteConfirmOpen(true);
	};

	const confirmDelete = async () => {
		if (flashSaleIdToDelete === null) return;
		try {
			await adminService.deleteFlashSale(flashSaleIdToDelete);
			showNotification("Đã xóa Flash Sale", "success");
			fetchFlashSales();
		} catch {
			showNotification("Xóa thất bại", "error");
		}
	};

	const filteredFlashSales = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return flashSales;
		return flashSales.filter((sale) => sale.title?.toLowerCase().includes(query));
	}, [flashSales, searchQuery]);

	const { currentPage, totalPages, setCurrentPage } = useClientPagination(
		filteredFlashSales.length,
		ITEMS_PER_PAGE,
		[searchQuery],
	);
	const paginatedFlashSales = paginateItems(filteredFlashSales, currentPage, ITEMS_PER_PAGE);

	return (
		<div className="space-y-6">
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

			<div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
				<div className="w-full">
					<label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tìm kiếm Flash Sale</label>
					<input
						type="text"
						placeholder="Tìm theo tiêu đề Flash Sale..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
					/>
				</div>
			</div>

			{loading ? (
				<TableSkeleton rows={4} columns={5} />
			) : flashSales.length === 0 ? (
				<FlashSaleList
					flashSales={[]}
					onToggleActive={handleToggleActive}
					onDelete={handleDelete}
					onRefresh={fetchFlashSales}
				/>
			) : filteredFlashSales.length === 0 ? (
				<AdminEmptyState title="Không tìm thấy chương trình Flash Sale phù hợp" />
			) : (
				<>
					<FlashSaleList
						flashSales={paginatedFlashSales}
						onToggleActive={handleToggleActive}
						onDelete={handleDelete}
						onRefresh={fetchFlashSales}
					/>
					<div className="mt-6">
						<PaginationComponent
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={(page) => setCurrentPage(page)}
						/>
					</div>
				</>
			)}

			<FlashSaleCreateModal
				open={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
				onSuccess={() => {
					setIsCreateOpen(false);
					fetchFlashSales();
				}}
			/>

			<ConfirmationModal
				isOpen={deleteConfirmOpen}
				onClose={() => {
					setDeleteConfirmOpen(false);
					setFlashSaleIdToDelete(null);
				}}
				onConfirm={confirmDelete}
				title="Xóa Flash Sale"
				message="Bạn có chắc chắn muốn xóa Flash Sale này không? Hành động này không thể hoàn tác."
				confirmLabel="Xóa"
				confirmButtonColor="!bg-red-600 hover:!bg-red-700"
			/>
		</div>
	);
}
