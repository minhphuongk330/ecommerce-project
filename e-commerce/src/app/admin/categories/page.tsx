"use client";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useClientPagination, paginateItems } from "~/hooks/usePagination";
import CategoryFormModal from "~/components/Admin/Categories/FormModal";
import CategoryList from "~/components/Admin/Categories/List";
import AdminFilter from "~/components/Admin/AdminFilter";
import ConfirmationModal from "~/components/atoms/Confirmation";
import PaginationComponent from "~/components/atoms/Pagination";
import AdminEmptyState from "~/components/Admin/AdminEmptyState";
import { TableSkeleton } from "~/components/Skeletons";
import { useNotification } from "~/contexts/Notification";
import { adminService } from "~/services/admin";
import { AdminCategory } from "~/types/admin";
import { FilterField } from "~/types/filter";
import { categoryCache } from "~/utils/lruCache";

const ITEMS_PER_PAGE = 6;

const FILTER_FIELDS: FilterField[] = [
	{
		name: "name",
		label: "Tên danh mục",
		type: "text",
		placeholder: "Nhập tên danh mục...",
	},
];

export default function CategoriesPage() {
	const [categories, setCategories] = useState<AdminCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [categoryIdToDelete, setCategoryIdToDelete] = useState<number | null>(null);
	const [filterState, setFilterState] = useState<Record<string, any>>({ name: "" });
	const { showNotification } = useNotification();

	const handleFilterChange = (fieldName: string, value: any) => {
		setFilterState(prev => ({ ...prev, [fieldName]: value }));
		setCurrentPage(1);
	};

	const handleResetFilters = () => {
		setFilterState({ name: "" });
		setCurrentPage(1);
	};

	const isFiltered = Boolean(filterState.name);

	const filteredCategories = useMemo(() => {
		return categories.filter(category => {
			const nameMatch = filterState.name
				? category.name.toLowerCase().includes(String(filterState.name).trim().toLowerCase())
				: true;
			return nameMatch;
		});
	}, [categories, filterState]);

	const { currentPage, totalPages, setCurrentPage } = useClientPagination(
		filteredCategories.length,
		ITEMS_PER_PAGE,
		[],
	);
	const paginatedCategories = paginateItems(filteredCategories, currentPage, ITEMS_PER_PAGE);

	const fetchCategories = useCallback(async () => {
		try {
			setLoading(true);
			const data = await adminService.getCategories();
			setCategories(data);
		} catch {
			showNotification("Không thể tải danh sách danh mục", "error");
		} finally {
			setLoading(false);
		}
	}, [showNotification]);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	const handleDelete = (id: number) => {
		setCategoryIdToDelete(id);
		setDeleteConfirmOpen(true);
	};

	const confirmDelete = async () => {
		if (categoryIdToDelete === null) return;
		try {
			await adminService.deleteCategory(categoryIdToDelete);
			categoryCache.clear();
			showNotification("Đã xóa danh mục thành công", "success");
			fetchCategories();
		} catch (err: any) {
			const msg = err?.response?.data?.message || "Xóa thất bại";
			showNotification(msg, "error");
		}
	};

	const handleEdit = (category: AdminCategory) => {
		setEditingCategory(category);
		setIsFormOpen(true);
	};

	const handleFormClose = () => {
		setIsFormOpen(false);
		setEditingCategory(null);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
						<CategoryIcon className="!text-emerald-600" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-800">Danh mục sản phẩm</h1>
						<p className="text-sm text-gray-500">
							{categories.length} danh mục phân loại ngành hàng
						</p>
					</div>
				</div>
				<button
					onClick={() => { setEditingCategory(null); setIsFormOpen(true); }}
					className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
				>
					<AddIcon fontSize="small" />
					Thêm danh mục
				</button>
			</div>
			<AdminFilter
				fields={FILTER_FIELDS}
				filterState={filterState}
				onFilterChange={handleFilterChange}
				onReset={handleResetFilters}
				isFiltered={isFiltered}
				loading={loading}
			/>

			{loading ? (
				<TableSkeleton rows={5} columns={3} />
			) : categories.length === 0 ? (
				<CategoryList
					categories={[]}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			) : filteredCategories.length === 0 ? (
				<AdminEmptyState title="Không tìm thấy danh mục phù hợp" />
			) : (
				<>
					<CategoryList
						categories={paginatedCategories}
						onEdit={handleEdit}
						onDelete={handleDelete}
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
			<CategoryFormModal
				open={isFormOpen}
				category={editingCategory}
				onClose={handleFormClose}
				onSuccess={() => { handleFormClose(); fetchCategories(); }}
			/>

			<ConfirmationModal
				isOpen={deleteConfirmOpen}
				onClose={() => {
					setDeleteConfirmOpen(false);
					setCategoryIdToDelete(null);
				}}
				onConfirm={confirmDelete}
				title="Xóa danh mục"
				message="Bạn có chắc chắn muốn xóa danh mục sản phẩm này? Hành động này không thể hoàn tác."
				confirmLabel="Xóa"
				confirmButtonColor="!bg-red-600 hover:!bg-red-700"
			/>
		</div>
	);
}
