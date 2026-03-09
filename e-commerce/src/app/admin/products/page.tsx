"use client";
import { useEffect, useState } from "react";
import AdminFilter from "~/components/Admin/AdminFilter";
import CreateProduct from "~/components/Admin/Products/Modal/Create";
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

	if (loading) {
		return <div className="p-8 text-gray-500">Loading data...</div>;
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl md:text-2xl font-bold text-gray-800">Product Management</h1>
				<CreateProduct categories={categories} onSuccess={fetchProducts} />
			</div>

			<AdminFilter
				fields={filterConfig.fields}
				filterState={filterState}
				onFilterChange={setFilterValue}
				onReset={resetFilters}
				isFiltered={isFiltered}
				loading={loading}
			/>

			<ProductsTable products={filteredProducts} categories={categories} onRefresh={fetchProducts} />
		</div>
	);
}
