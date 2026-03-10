"use client";
import { useEffect, useState } from "react";
import AdminFilter from "~/components/Admin/AdminFilter";
import ExportButton from "~/components/Admin/ExportButton";
import CreateProduct from "~/components/Admin/Products/Modal/Create";
import { TableSkeleton } from "~/components/Skeletons";
import ProductsTable from "~/components/Table/Products";
import { useNotification } from "~/contexts/Notification";
import { useTableFilter } from "~/hooks/useTableFilter";
import { adminService } from "~/services/admin";
import { AdminCategory, AdminProduct } from "~/types/admin";
import { FilterConfig } from "~/types/filter";

export default function ProductsPage() {
	const [allProducts, setAllProducts] = useState<AdminProduct[]>([]);
	const [categories, setCategories] = useState<AdminCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
	const selectCount = selectedIds.size;
	const { showNotification } = useNotification();

	const filterConfig: FilterConfig = {
		fields: [
			{
				name: "name",
				label: "Product Name",
				type: "text",
				placeholder: "Search by product name...",
			},
			{
				name: "category.name",
				label: "Category",
				type: "select",
				options: categories.map(cat => ({
					label: cat.name,
					value: cat.name,
				})),
			},
		],
	};

	const {
		filteredData: filteredProducts,
		filterState,
		setFilterValue,
		resetFilters,
		isFiltered,
	} = useTableFilter({
		data: allProducts,
		config: filterConfig,
		predicates: {
			name: (item, filters) => {
				const searchTerm = filters.name;
				if (!searchTerm) return true;
				return item.name.toLowerCase().includes(searchTerm.toLowerCase());
			},
			"category.name": (item, filters) => {
				const categoryFilter = filters["category.name"];
				if (!categoryFilter) return true;
				return item.category?.name === categoryFilter;
			},
		},
	});

	const fetchProducts = async () => {
		try {
			const data = await adminService.getProducts();
			setAllProducts(data);
		} catch (error) {
			console.error(error);
			showNotification("Failed to load product list", "error");
		}
	};

	const fetchCategories = async () => {
		try {
			const data = await adminService.getCategories();
			setCategories(data);
		} catch (error) {
			console.error(error);
			showNotification("Error loading catalog", "error");
		}
	};

	const initData = async () => {
		setLoading(true);
		await Promise.all([fetchProducts(), fetchCategories()]);
		setLoading(false);
	};

	useEffect(() => {
		initData();
	}, []);

	const handleSelectChange = (id: number) => {
		setSelectedIds(prev => {
			const newSet = new Set(prev);
			if (newSet.has(id)) newSet.delete(id);
			else newSet.add(id);
			return newSet;
		});
	};

	const handleSelectAllVisible = (selected: boolean, visibleIds: number[]) => {
		setSelectedIds(prev => {
			const newSet = new Set(prev);
			if (selected) {
				visibleIds.forEach(id => newSet.add(id));
			} else {
				visibleIds.forEach(id => newSet.delete(id));
			}
			return newSet;
		});
	};

	const selectedItems = filteredProducts.filter(product => selectedIds.has(product.id));

	const productExportColumns = [
		{ key: "name" as const, label: "Product Name" },
		{ key: "category.name" as any, label: "Category" },
		{
			key: "price" as const,
			label: "Price",
			formatter: (value: any) => (value != null && !isNaN(value) ? `$${Number(value).toFixed(2)}` : ""),
		},
		{ key: "stock" as const, label: "Stock" },
	];

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
							columns={productExportColumns}
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
