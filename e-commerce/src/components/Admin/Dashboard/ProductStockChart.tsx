"use client";
import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { adminService } from "~/services/admin";

export default function ProductStockChart() {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchProductStock = useCallback(async () => {
		try {
			setLoading(true);
			const products = await adminService.getProducts();
			setData(
				products
					.sort((a, b) => b.stock - a.stock)
					.slice(0, 8)
					.map(product => ({
						name: product.name.length > 15 ? product.name.substring(0, 15) + "..." : product.name,
						stock: product.stock,
						price: product.price,
					})),
			);
		} catch (error) {
			console.error("Error fetching product stock:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProductStock();
	}, [fetchProductStock]);

	if (loading) {
		return (
			<div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center min-h-[330px]">
				<div className="text-gray-500">Loading...</div>
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center min-h-[330px]">
				<div className="text-gray-500">No product data available</div>
			</div>
		);
	}

	return (
		<div className="bg-white p-6 rounded-xl shadow-md">
			<h2 className="text-xl font-bold text-gray-800 mb-4">Top 8 Products by Stock Level</h2>
			<ResponsiveContainer width="100%" height={220}>
				<BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
					<YAxis />
					<Tooltip />
					<Bar dataKey="stock" fill="#42A5F5" name="Stock Level" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
