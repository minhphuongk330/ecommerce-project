"use client";
import { useEffect, useMemo, useState } from "react";
import AdminTableFilter, { FilterConfig } from "~/components/Admin/AdminTableFilter";
import CreateProduct from "~/components/Admin/Products/Modal/Create";
import ProductsTable from "~/components/Table/Products";
import { useNotification } from "~/contexts/Notification";
import { adminService } from "~/services/admin";
import { AdminCategory, AdminProduct } from "~/types/admin";

export default function ProductsPage() {
	const [allProducts, setAllProducts] = useState<AdminProduct[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<AdminProduct[]>([]);
	const [categories, setCategories] = useState<AdminCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const { showNotification } = useNotification();

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

	useMemo(() => {
		const filtered = allProducts.filter(product => {
			const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory = !categoryFilter || product.category?.name === categoryFilter;
			return matchesSearch && matchesCategory;
		});
		setFilteredProducts(filtered);
	}, [allProducts, searchTerm, categoryFilter]);

	if (loading) {
		return <div className="p-8 text-gray-500">Loading data...</div>;
	}

	const filterConfig: FilterConfig = {
		searchPlaceholder: "Search by product name...",
		filterOptions: {
			Category: categories.map(cat => ({
				value: cat.name,
				label: cat.name,
			})),
		},
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl md:text-2xl font-bold text-gray-800">Product Management</h1>
				<CreateProduct categories={categories} onSuccess={fetchProducts} />
			</div>
			<AdminTableFilter
				config={filterConfig}
				onSearch={setSearchTerm}
				onFilterChange={(filterKey, value) => {
					if (filterKey === "Category") setCategoryFilter(value);
				}}
			/>
			<ProductsTable products={filteredProducts} categories={categories} onRefresh={fetchProducts} />
		</div>
	);
}
