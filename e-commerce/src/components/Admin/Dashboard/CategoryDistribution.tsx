"use client";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { adminService } from "~/services/admin";

export default function CategoryDistribution() {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCategoryData = async () => {
			try {
				setLoading(true);
				const [products, categories] = await Promise.all([adminService.getProducts(), adminService.getCategories()]);
				const categoryCount: Record<number, number> = {};
				const categoryNames: Record<number, string> = {};
				categories.forEach(cat => {
					categoryNames[cat.id] = cat.name;
					categoryCount[cat.id] = 0;
				});

				products.forEach(product => {
					if (product.categoryId) {
						categoryCount[product.categoryId]++;
					}
				});

				const chartData = Object.entries(categoryCount)
					.map(([catId, count]) => ({
						category: categoryNames[parseInt(catId)] || "Unknown",
						products: count,
					}))
					.filter(item => item.products > 0)
					.sort((a, b) => b.products - a.products);

				setData(chartData);
			} catch (error) {
				console.error("Error fetching category data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategoryData();
	}, []);

	if (loading) {
		return (
			<div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center min-h-[330px]">
				<div className="text-gray-500">Loading...</div>
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center min-h-[330px]">
				<div className="text-gray-500">No category data available</div>
			</div>
		);
	}

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-xl font-bold text-gray-800 mb-4">Products by Category</h2>
			<ResponsiveContainer width="100%" height={220}>
				<BarChart data={data} layout="vertical" margin={{ left: 100, right: 30 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis type="number" />
					<YAxis dataKey="category" type="category" width={95} />
					<Tooltip />
					<Bar dataKey="products" fill="#FFA726" name="Product Count" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
