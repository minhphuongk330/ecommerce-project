"use client";
import WarningAmber from "@mui/icons-material/WarningAmber";
import { useEffect, useState } from "react";
import { adminService } from "~/services/admin";

export default function LowStockAlert() {
	const [products, setProducts] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const LOW_STOCK_THRESHOLD = 10;

	useEffect(() => {
		const fetchLowStockProducts = async () => {
			try {
				setLoading(true);
				const allProducts = await adminService.getProducts();
				const lowStockProducts = allProducts
					.filter(p => p.stock < LOW_STOCK_THRESHOLD && p.isActive)
					.sort((a, b) => a.stock - b.stock)
					.slice(0, 10);
				setProducts(lowStockProducts);
			} catch (error) {
				console.error("Error fetching low stock products:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchLowStockProducts();
	}, []);

	if (loading) {
		return (
			<div className="bg-white p-6 rounded-lg shadow-md">
				<div className="flex items-center gap-2 mb-4">
					<WarningAmber className="text-yellow-500" />
					<h2 className="text-xl font-bold text-gray-800">Cảnh báo kho hàng</h2>
				</div>
				<div className="text-gray-500">Loading...</div>
			</div>
		);
	}

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="flex items-center gap-2 mb-4">
				<WarningAmber className="text-yellow-500" />
				<h2 className="text-xl font-bold text-gray-800">Low Stock Alert</h2>
				{products.length > 0 && (
					<span className="ml-auto bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
						{products.length} products
					</span>
				)}
			</div>

			{products.length === 0 ? (
				<div className="text-center py-8">
					<div className="text-green-500 text-4xl mb-2">✓</div>
					<p className="text-gray-600">All products have sufficient stock!</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-200">
								<th className="text-left py-2 px-3 font-semibold text-gray-600">Product</th>
								<th className="text-center py-2 px-3 font-semibold text-gray-600">Stock</th>
								<th className="text-center py-2 px-3 font-semibold text-gray-600">Status</th>
							</tr>
						</thead>
						<tbody>
							{products.map(product => (
								<tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
									<td className="py-3 px-3 text-gray-800">
										<div className="font-medium">{product.name}</div>
										<div className="text-xs text-gray-500">ID: {product.id}</div>
									</td>
									<td className="py-3 px-3 text-center">
										<span className={`font-bold ${product.stock === 0 ? "text-red-600" : "text-yellow-600"}`}>
											{product.stock}
										</span>
									</td>
									<td className="py-3 px-3 text-center">
										{product.stock === 0 ? (
											<span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
												Out of stock
											</span>
										) : (
											<span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
												Almost out of stock
											</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
