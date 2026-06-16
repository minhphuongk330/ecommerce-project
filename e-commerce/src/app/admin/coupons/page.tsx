"use client";
import AddIcon from "@mui/icons-material/Add";
import LocalOffer from "@mui/icons-material/LocalOffer";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useClientPagination, paginateItems } from "~/hooks/usePagination";
import CouponFormModal from "~/components/Admin/Coupons/FormModal";
import CouponList from "~/components/Admin/Coupons/List";
import { TableSkeleton } from "~/components/Skeletons";
import { useNotification } from "~/contexts/Notification";
import { adminService } from "~/services/admin";
import PaginationComponent from "~/components/atoms/Pagination";
import ConfirmationModal from "~/components/atoms/Confirmation";
import AdminEmptyState from "~/components/Admin/AdminEmptyState";

const ITEMS_PER_PAGE = 6;

export default function CouponsPage() {
	const [coupons, setCoupons] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const { showNotification } = useNotification();

	const fetchCoupons = useCallback(async () => {
		try {
			setLoading(true);
			const data = await adminService.getCoupons();
			setCoupons(data);
		} catch {
			showNotification("Không thể tải danh sách coupon", "error");
		} finally {
			setLoading(false);
		}
	}, [showNotification]);

	useEffect(() => {
		fetchCoupons();
	}, [fetchCoupons]);

	const handleToggleActive = async (id: string, isActive: boolean) => {
		try {
			await adminService.updateCoupon(id, { isActive });
			showNotification(isActive ? "Đã bật coupon" : "Đã tắt coupon", "success");
			fetchCoupons();
		} catch {
			showNotification("Cập nhật thất bại", "error");
		}
	};

	const handleToggleHomepage = async (id: string, showOnHomepage: boolean) => {
		try {
			await adminService.updateCoupon(id, { showOnHomepage });
			showNotification(showOnHomepage ? "Đã hiện trên trang chủ" : "Đã ẩn khỏi trang chủ", "success");
			fetchCoupons();
		} catch {
			showNotification("Cập nhật thất bại", "error");
		}
	};

	const handleDeleteClick = (id: string) => {
		setDeletingId(id);
		setIsDeleteOpen(true);
	};

	const doDelete = async () => {
		if (!deletingId) return;
		try {
			await adminService.deleteCoupon(deletingId);
			showNotification("Đã xóa coupon thành công", "success");
			fetchCoupons();
		} catch {
			showNotification("Xóa thất bại", "error");
		}
	};

	const handleEdit = (coupon: any) => {
		setEditingCoupon(coupon);
		setIsFormOpen(true);
	};

	const handleFormClose = () => {
		setIsFormOpen(false);
		setEditingCoupon(null);
	};

	const filteredCoupons = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return coupons;
		return coupons.filter(
			(c) =>
				c.code.toLowerCase().includes(query) ||
				(c.description || "").toLowerCase().includes(query)
		);
	}, [coupons, searchQuery]);

	const { currentPage, totalPages, setCurrentPage } = useClientPagination(
		filteredCoupons.length,
		ITEMS_PER_PAGE,
		[searchQuery],
	);
	const paginatedCoupons = paginateItems(filteredCoupons, currentPage, ITEMS_PER_PAGE);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
						<LocalOffer className="!text-orange-600" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-800">Mã giảm giá</h1>
						<p className="text-sm text-gray-500">
							{coupons.length} coupon · {coupons.filter(c => c.isActive).length} đang hoạt động
						</p>
					</div>
				</div>
				<button
					onClick={() => { setEditingCoupon(null); setIsFormOpen(true); }}
					className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
				>
					<AddIcon fontSize="small" />
					Tạo coupon
				</button>
			</div>

			<div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
				<div className="w-full">
					<label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tìm kiếm mã giảm giá</label>
					<input
						type="text"
						placeholder="Tìm theo mã hoặc mô tả coupon..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
					/>
				</div>
			</div>

			{loading ? (
				<TableSkeleton rows={5} columns={6} />
			) : coupons.length === 0 ? (
				<CouponList
					coupons={[]}
					onToggleActive={handleToggleActive}
					onToggleHomepage={handleToggleHomepage}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
				/>
			) : filteredCoupons.length === 0 ? (
				<AdminEmptyState title="Không tìm thấy coupon phù hợp" />
			) : (
				<>
					<CouponList
						coupons={paginatedCoupons}
						onToggleActive={handleToggleActive}
						onToggleHomepage={handleToggleHomepage}
						onEdit={handleEdit}
						onDelete={handleDeleteClick}
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

			<CouponFormModal
				open={isFormOpen}
				coupon={editingCoupon}
				onClose={handleFormClose}
				onSuccess={() => { handleFormClose(); fetchCoupons(); }}
			/>

			<ConfirmationModal
				isOpen={isDeleteOpen}
				onClose={() => {
					setIsDeleteOpen(false);
					setDeletingId(null);
				}}
				onConfirm={doDelete}
				title="Xóa mã giảm giá"
				message="Bạn có chắc chắn muốn xóa mã giảm giá này không? Hành động này không thể hoàn tác."
				confirmLabel="Xóa"
			/>
		</div>
	);
}
