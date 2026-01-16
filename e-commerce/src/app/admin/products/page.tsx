"use client";
import { useEffect, useState } from "react";
import { adminService } from "~/services/admin";
import { useNotification } from "~/contexts/Notification";
import { AdminCategory, AdminProduct } from "~/types/admin";
import ProductsTable from "~/components/Table/Products";
import CreateProduct from "~/components/Admin/Products/Modal/Create";

export default function ProductsPage() {
	const [products, setProducts] = useState<AdminProduct[]>([]);
	const [categories, setCategories] = useState<AdminCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const { showNotification } = useNotification();

	const fetchProducts = async () => {
		try {
			const data = await adminService.getProducts();
			setProducts(data);
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
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
				<CreateProduct categories={categories} onSuccess={fetchProducts} />
			</div>
			<ProductsTable products={products} categories={categories} onRefresh={fetchProducts} />
		</div>
	);
}
