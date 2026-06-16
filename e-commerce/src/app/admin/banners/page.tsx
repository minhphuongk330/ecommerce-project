"use client";
import AddIcon from "@mui/icons-material/Add";
import ViewCarousel from "@mui/icons-material/ViewCarousel";
import { useCallback, useEffect, useState } from "react";
import BannerFormModal from "~/components/Admin/Banners/FormModal";
import BannerList from "~/components/Admin/Banners/List";
import ConfirmationModal from "~/components/atoms/Confirmation";
import { TableSkeleton } from "~/components/Skeletons";
import { useNotification } from "~/contexts/Notification";
import { adminService } from "~/services/admin";
import { bannerCache } from "~/utils/lruCache";
import { BannerData } from "~/types/banner";

export default function BannersPage() {
	const [banners, setBanners] = useState<BannerData[]>([]);
	const [loading, setLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingBanner, setEditingBanner] = useState<BannerData | null>(null);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [bannerIdToDelete, setBannerIdToDelete] = useState<number | null>(null);
	const { showNotification } = useNotification();

	const fetchBanners = useCallback(async () => {
		try {
			setLoading(true);
			const data = await adminService.getBanners();
			const sorted = data.sort((a, b) => Number(b.id) - Number(a.id));
			setBanners(sorted);
		} catch {
			showNotification("Không thể tải danh sách banner", "error");
		} finally {
			setLoading(false);
		}
	}, [showNotification]);

	useEffect(() => {
		fetchBanners();
	}, [fetchBanners]);

	const handleToggleActive = async (id: string | number, isActive: boolean) => {
		try {
			await adminService.updateBanner(Number(id), { isActive });
			showNotification(isActive ? "Đã bật kích hoạt banner" : "Đã tắt kích hoạt banner", "success");
			bannerCache.clear();
			fetchBanners();
		} catch {
			showNotification("Cập nhật trạng thái thất bại", "error");
		}
	};

	const handleDelete = (id: number) => {
		setBannerIdToDelete(id);
		setDeleteConfirmOpen(true);
	};

	const confirmDelete = async () => {
		if (bannerIdToDelete === null) return;
		try {
			await adminService.deleteBanner(bannerIdToDelete);
			showNotification("Đã xóa banner thành công", "success");
			bannerCache.clear();
			fetchBanners();
		} catch (err: any) {
			const msg = err?.response?.data?.message || "Xóa thất bại";
			showNotification(msg, "error");
		}
	};

	const handleEdit = (banner: BannerData) => {
		setEditingBanner(banner);
		setIsFormOpen(true);
	};

	const handleFormClose = () => {
		setIsFormOpen(false);
		setEditingBanner(null);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
						<ViewCarousel className="!text-blue-600" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-800">Banner quảng cáo</h1>
						<p className="text-sm text-gray-500">
							{banners.length} banner · {banners.filter(b => b.isActive).length} đang hiển thị ngoài trang chủ
						</p>
					</div>
				</div>
				<button
					onClick={() => { setEditingBanner(null); setIsFormOpen(true); }}
					className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
				>
					<AddIcon fontSize="small" />
					Tạo banner
				</button>
			</div>

			{loading ? (
				<TableSkeleton rows={5} columns={5} />
			) : (
				<BannerList
					banners={banners}
					onToggleActive={handleToggleActive}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			)}
			<BannerFormModal
				open={isFormOpen}
				banner={editingBanner}
				onClose={handleFormClose}
				onSuccess={() => { handleFormClose(); fetchBanners(); }}
			/>

			<ConfirmationModal
				isOpen={deleteConfirmOpen}
				onClose={() => {
					setDeleteConfirmOpen(false);
					setBannerIdToDelete(null);
				}}
				onConfirm={confirmDelete}
				title="Xóa banner"
				message="Bạn có chắc chắn muốn xóa banner này không? Hành động này không thể hoàn tác."
				confirmLabel="Xóa"
				confirmButtonColor="!bg-red-600 hover:!bg-red-700"
			/>
		</div>
	);
}
