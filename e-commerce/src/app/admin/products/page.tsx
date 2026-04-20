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
			showNotification("Failed to load product list", "error");
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
			showNotification("Error loading catalog", "error");
		}
	}, [showNotification]);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	const handleBulkDelete = async (ids: number[]) => {
		try {
			await Promise.all(ids.map(id => adminService.deleteProduct(id)));
			showNotification("Products deleted successfully", "success");
		} catch (error) {
			showNotification("Failed to delete some products", "error");
		} finally {
			clearSelection();
			setIsMobileSelectMode(false);
			fetchProducts();
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
				<TableSkeleton rows={8} columns={5} />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<AdminPageHeader
				title="Product Management"
				selectCount={selectCount}
				totalCount={filteredProducts.length}
				allData={filteredProducts}
				exportColumns={PRODUCT_EXPORT_COLUMNS}
				exportFilename="products"
				exportLabel="Export"
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

			<ProductsTable
				products={filteredProducts}
				categories={categories}
				onRefresh={fetchProducts}
				selectedIds={selectedIds}
				onSelectChange={handleSelectChange}
				onSelectAll={handleSelectAllVisible}
				isMobileSelectMode={isMobileSelectMode}
			/>
		</div>
	);
}
