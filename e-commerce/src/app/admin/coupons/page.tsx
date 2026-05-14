"use client";
import AddIcon from "@mui/icons-material/Add";
import LocalOffer from "@mui/icons-material/LocalOffer";
import { useCallback, useEffect, useState } from "react";
import CouponFormModal from "~/components/Admin/Coupons/FormModal";
import CouponList from "~/components/Admin/Coupons/List";
import { TableSkeleton } from "~/components/Skeletons";
import { useNotification } from "~/contexts/Notification";
import { adminService } from "~/services/admin";

export default function CouponsPage() {
	const [coupons, setCoupons] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
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

	const handleDelete = async (id: string) => {
		if (!confirm("Xác nhận xóa coupon này?")) return;
		try {
			await adminService.deleteCoupon(id);
			showNotification("Đã xóa coupon", "success");
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

	return (
		<div className="space-y-6">
			{/* Header */}
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

			{/* Content */}
			{loading ? (
				<TableSkeleton rows={5} columns={6} />
			) : (
				<CouponList
					coupons={coupons}
					onToggleActive={handleToggleActive}
					onToggleHomepage={handleToggleHomepage}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			)}

			{/* Form Modal */}
			<CouponFormModal
				open={isFormOpen}
				coupon={editingCoupon}
				onClose={handleFormClose}
				onSuccess={() => { handleFormClose(); fetchCoupons(); }}
			/>
		</div>
	);
}
