"use client";
import AddIcon from "@mui/icons-material/Add";
import Business from "@mui/icons-material/Business";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useClientPagination, paginateItems } from "~/hooks/usePagination";
import BrandFormModal from "~/components/Admin/Brands/FormModal";
import BrandList from "~/components/Admin/Brands/List";
import ConfirmationModal from "~/components/atoms/Confirmation";
import PaginationComponent from "~/components/atoms/Pagination";
import AdminEmptyState from "~/components/Admin/AdminEmptyState";
import { TableSkeleton } from "~/components/Skeletons";
import { useNotification } from "~/contexts/Notification";
import { adminService } from "~/services/admin";
import { AdminBrand } from "~/types/admin";

const ITEMS_PER_PAGE = 6;

export default function BrandsPage() {
	const [brands, setBrands] = useState<AdminBrand[]>([]);
	const [loading, setLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingBrand, setEditingBrand] = useState<AdminBrand | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const { showNotification } = useNotification();

	const fetchBrands = useCallback(async () => {
		try {
			setLoading(true);
			const data = await adminService.getBrands();
			setBrands(data);
		} catch {
			showNotification("Không thể tải danh sách thương hiệu", "error");
		} finally {
			setLoading(false);
		}
	}, [showNotification]);

	useEffect(() => {
		fetchBrands();
	}, [fetchBrands]);

	const handleDeleteClick = (id: number) => {
		setDeletingId(id);
		setIsDeleteOpen(true);
	};

	const doDelete = async () => {
		if (deletingId === null) return;
		try {
			await adminService.deleteBrand(deletingId);
			showNotification("Đã xóa thương hiệu thành công", "success");
			fetchBrands();
		} catch (err: any) {
			const msg = err?.response?.data?.message || "Xóa thất bại";
			showNotification(msg, "error");
		}
	};

	const handleEdit = (brand: AdminBrand) => {
		setEditingBrand(brand);
		setIsFormOpen(true);
	};

	const handleFormClose = () => {
		setIsFormOpen(false);
		setEditingBrand(null);
	};

	const filteredBrands = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return brands;
		return brands.filter((b) => b.name.toLowerCase().includes(query));
	}, [brands, searchQuery]);

	const { currentPage, totalPages, setCurrentPage } = useClientPagination(
		filteredBrands.length,
		ITEMS_PER_PAGE,
		[searchQuery],
	);
	const paginatedBrands = paginateItems(filteredBrands, currentPage, ITEMS_PER_PAGE);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
						<Business className="!text-blue-600" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-800">Thương hiệu</h1>
						<p className="text-sm text-gray-500">
							{brands.length} thương hiệu sản phẩm đối tác
						</p>
					</div>
				</div>
				<button
					onClick={() => { setEditingBrand(null); setIsFormOpen(true); }}
					className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
				>
					<AddIcon fontSize="small" />
					Thêm thương hiệu
				</button>
			</div>

			<div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
				<div className="w-full">
					<label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tìm kiếm thương hiệu</label>
					<input
						type="text"
						placeholder="Tìm theo tên thương hiệu..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
					/>
				</div>
			</div>

			{loading ? (
				<TableSkeleton rows={5} columns={3} />
			) : brands.length === 0 ? (
				<BrandList
					brands={[]}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
				/>
			) : filteredBrands.length === 0 ? (
				<AdminEmptyState title="Không tìm thấy thương hiệu phù hợp" />
			) : (
				<>
					<BrandList
						brands={paginatedBrands}
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

			<BrandFormModal
				open={isFormOpen}
				brand={editingBrand}
				onClose={handleFormClose}
				onSuccess={() => { handleFormClose(); fetchBrands(); }}
			/>

			<ConfirmationModal
				isOpen={isDeleteOpen}
				onClose={() => {
					setIsDeleteOpen(false);
					setDeletingId(null);
				}}
				onConfirm={doDelete}
				title="Xóa thương hiệu"
				message="Bạn có chắc chắn muốn xóa thương hiệu này không? Hành động này không thể hoàn tác và các sản phẩm thuộc thương hiệu này có thể bị ảnh hưởng."
				confirmLabel="Xóa"
			/>
		</div>
	);
}
