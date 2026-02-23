"use client";
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import { adminService } from "~/services/admin";

dayjs.extend(isBetween);

interface DateRange {
	startDate: Dayjs;
	endDate: Dayjs;
}

interface TopSellingProps {
	dateRange: DateRange;
}

interface ProductStat {
	id: number;
	name: string;
	quantity: number;
	revenue: number;
	rank: number;
}

export default function TopSellingProducts({ dateRange }: TopSellingProps) {
	const [data, setData] = useState<ProductStat[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTopProducts = async () => {
			try {
				setLoading(true);

				const [products, orders] = await Promise.all([adminService.getProducts(), adminService.getOrders()]);

				const filteredOrders = orders.filter(order =>
					dayjs(order.createdAt).isBetween(dateRange.startDate, dateRange.endDate, null, "[]"),
				);

				const productSalesMap = new Map<number, { quantity: number; revenue: number }>();

				filteredOrders.forEach(order => {
					if (order.orderItems && Array.isArray(order.orderItems)) {
						order.orderItems.forEach(item => {
							if (item.productId) {
								const existing = productSalesMap.get(item.productId) || {
									quantity: 0,
									revenue: 0,
								};

								const itemQuantity = item.quantity || 0;

								const unitPrice = typeof item.unitPrice === "string" ? parseFloat(item.unitPrice) : item.unitPrice;

								existing.quantity += itemQuantity;
								existing.revenue += unitPrice * itemQuantity;

								productSalesMap.set(item.productId, existing);
							}
						});
					}
				});

				const topProducts = products
					.map(product => ({
						id: product.id,
						name: product.name,
						quantity: productSalesMap.get(product.id)?.quantity || 0,
						revenue: productSalesMap.get(product.id)?.revenue || 0,
					}))
					.filter(p => p.quantity > 0)
					.sort((a, b) => b.quantity - a.quantity)
					.slice(0, 5)
					.map((product, index) => ({
						...product,
						rank: index + 1,
					}));

				setData(topProducts);
			} catch (error) {
				console.error("Error fetching top products:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchTopProducts();
	}, [dateRange]);

	if (loading) {
		return (
			<div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center min-h-[350px]">
				<div className="flex flex-col items-center gap-2">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<div className="text-gray-500 text-sm">Calculating top sales...</div>
				</div>
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
				<div className="flex items-center gap-2 mb-6">
					<TrendingUpOutlined className="text-blue-600 text-2xl" />
					<h2 className="text-xl font-bold text-gray-800">Top 5 Selling Products</h2>
				</div>
				<div className="flex-1 flex items-center justify-center text-gray-500">No sales data in this period</div>
			</div>
		);
	}

	const maxQuantity = data[0]?.quantity || 1;

	return (
		<div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
			<div className="flex items-center gap-2 mb-6">
				<TrendingUpOutlined className="text-blue-600 text-2xl" />
				<h2 className="text-xl font-bold text-gray-800">Top 5 Selling Products</h2>
			</div>

			<div className="space-y-3 flex-1">
				{data.map(product => (
					<div
						key={product.id}
						className="group p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md transition-all"
					>
						<div className="flex items-start justify-between mb-2">
							<div className="flex items-center gap-3 flex-1">
								<div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm shadow-sm">
									{product.rank}
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="font-semibold text-gray-800 truncate" title={product.name}>
										{product.name}
									</h3>
									<p className="text-xs text-gray-500 mt-1">{product.quantity} units sold</p>
								</div>
							</div>
						</div>

						<div className="flex items-end justify-between gap-4 px-11">
							<div className="flex-1">
								<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
									<div
										className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
										style={{
											width: `${(product.quantity / maxQuantity) * 100}%`,
										}}
									></div>
								</div>
							</div>
							<div className="text-right">
								<p className="text-sm font-bold text-gray-800">
									$
									{product.revenue.toLocaleString(undefined, {
										minimumFractionDigits: 0,
										maximumFractionDigits: 2,
									})}
								</p>
								<p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">Revenue</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
