"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminFilter from "~/components/Admin/AdminFilter";
import AdminPageHeader from "~/components/Admin/AdminPageHeader";
import CreateProduct from "~/components/Admin/Products/Modal/Create";
import { TableSkeleton } from "~/components/Skeletons";
import ProductsTable from "~/components/Table/Products";
import { useNotification } from "~/contexts/Notification";
import { useAdminTableManager } from "~/hooks/useAdminTableManager";
import { adminService } from "~/services/admin";
import { AdminCategory, AdminProduct } from "~/types/admin";
import AdminEmptyState from "~/components/Admin/AdminEmptyState";
import {
	getProductFilterConfig,
	PRODUCT_EXPORT_COLUMNS,
	PRODUCT_FILTER_PREDICATES,
} from "~/utils/admin/productConfigs";

export default function ProductsPage() {
	const [categories, setCategories] = useState<AdminCategory[]>([]);
	const [isMobileSelectMode, setIsMobileSelectMode] = useState(false);
	const { showNotification } = useNotification();
	const filterConfig = useMemo(() => getProductFilterConfig(categories), [categories]);
	const fetchProductsFn = useCallback(() => adminService.getProducts(), []);

	const onFetchError = useCallback(
		(error: any) => {
			console.error(error);
			showNotification("Lỗi khi tải danh sách sản phẩm", "error");
		},
		[showNotification],
	);

	const {
		filteredData: filteredProducts,
		loading,
		selectCount,
		selectedIds,
		filterState,
		isFiltered,
		setFilterValue,
		resetFilters,
		handleSelectChange,
		handleSelectAllVisible,
		fetchData: fetchProducts,
		clearSelection,
	} = useAdminTableManager<AdminProduct>({
		filterConfig,
		predicates: PRODUCT_FILTER_PREDICATES,
		fetchFn: fetchProductsFn,
		onFetchError,
	});

	const fetchCategories = useCallback(async () => {
		try {
			const data = await adminService.getCategories();
			setCategories(data);
		} catch (error) {
			console.error(error);
			showNotification("Lỗi khi tải danh mục", "error");
		}
	}, [showNotification]);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	const handleBulkDelete = async (ids: number[]) => {
		try {
			await Promise.all(ids.map(id => adminService.deleteProduct(id)));
			showNotification("Xóa sản phẩm thành công", "success");
		} catch (error) {
			showNotification("Lỗi khi xóa một số sản phẩm", "error");
		} finally {
			clearSelection();
			setIsMobileSelectMode(false);
			fetchProducts();
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
				<TableSkeleton rows={8} columns={5} />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<AdminPageHeader
				title="Quản lý sản phẩm"
				selectCount={selectCount}
				totalCount={filteredProducts.length}
				allData={filteredProducts}
				exportColumns={PRODUCT_EXPORT_COLUMNS}
				exportFilename="products"
				exportLabel="Xuất Excel"
				actions={<CreateProduct categories={categories} onSuccess={fetchProducts} />}
				selectedIds={selectedIds}
				onBulkDelete={handleBulkDelete}
				isMobileSelectMode={isMobileSelectMode}
				onToggleMobileSelect={() => {
					if (isMobileSelectMode) clearSelection();
					setIsMobileSelectMode(!isMobileSelectMode);
				}}
			/>

			<AdminFilter
				fields={filterConfig.fields}
				filterState={filterState}
				onFilterChange={setFilterValue}
				onReset={resetFilters}
				isFiltered={isFiltered}
				loading={loading}
			/>

			{filteredProducts.length === 0 && isFiltered ? (
				<AdminEmptyState title="Không tìm thấy sản phẩm phù hợp" />
			) : (
				<ProductsTable
					products={filteredProducts}
					categories={categories}
					onRefresh={fetchProducts}
					selectedIds={selectedIds}
					onSelectChange={handleSelectChange}
					onSelectAll={handleSelectAllVisible}
					isMobileSelectMode={isMobileSelectMode}
				/>
			)}
		</div>
	);
}
