"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminFilter from "~/components/Admin/AdminFilter";
import ExportButton from "~/components/Admin/ExportButton";
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
		selectedItems,
		filterState,
		isFiltered,
		setFilterValue,
		resetFilters,
		handleSelectChange,
		handleSelectAllVisible,
		fetchData: fetchProducts,
	} = useAdminTableManager<AdminProduct>({
		filterConfig,
		predicates: PRODUCT_FILTER_PREDICATES,
		fetchFn: fetchProductsFn,
		onFetchError,
	});

	const fetchCategories = async () => {
		try {
			const data = await adminService.getCategories();
			setCategories(data);
		} catch (error) {
			console.error(error);
			showNotification("Error loading catalog", "error");
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

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
			<div className="flex justify-between items-center">
				<h1 className="text-2xl md:text-2xl font-bold text-gray-800">Product Management</h1>
				<div className="flex items-center gap-4">
					<div className="text-sm text-gray-500">
						{selectCount > 0 && (
							<span className="mr-4 font-semibold">
								Selected: <span className="text-blue-600">{selectCount}</span> / {filteredProducts.length}
							</span>
						)}
					</div>
					<div className="flex gap-2">
						<ExportButton
							data={selectCount > 0 ? selectedItems : filteredProducts}
							columns={PRODUCT_EXPORT_COLUMNS}
							filename="products"
							label={selectCount > 0 ? `Export Selected (${selectCount})` : "Export"}
							variant="both"
							showCount={false}
							disabled={selectCount === 0}
						/>
						<CreateProduct categories={categories} onSuccess={fetchProducts} />
					</div>
				</div>
			</div>

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
			/>
		</div>
	);
}
