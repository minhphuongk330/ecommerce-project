"use client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import PeriodDropdown, { Period } from "~/components/atoms/PeriodDropdown";
import { adminService } from "~/services/admin";
import { AdminProduct } from "~/types/admin";
import { formatPrice } from "~/utils/format";

dayjs.extend(isBetween);

export default function TopSellingProducts() {
	const [allProducts, setAllProducts] = useState<AdminProduct[]>([]);
	const [allOrders, setAllOrders] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [period, setPeriod] = useState<Period>("weekly");

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			const [products, orders] = await Promise.all([adminService.getProducts(), adminService.getOrders()]);
			setAllProducts(products);
			setAllOrders(orders);
		} catch (error) {
			console.error("Error fetching top products:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const data = useMemo(() => {
		let startDate: dayjs.Dayjs;
		const endDate = dayjs().endOf("day");
		if (period === "yearly") {
			startDate = dayjs().startOf("year");
		} else if (period === "monthly") {
			startDate = dayjs().startOf("month");
		} else {
			startDate = dayjs().subtract(6, "day").startOf("day");
		}
		const filteredOrders = allOrders.filter(order => dayjs(order.createdAt).isBetween(startDate, endDate, null, "[]"));
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

		const topProducts = allProducts
			.map(product => {
				const imageUrl = product.mainImageUrl || "/images/placeholder-product.png";

				return {
					id: product.id,
					name: product.name,
					image: imageUrl,
					price: typeof product.price === "string" ? parseFloat(product.price) : product.price,
					quantity: productSalesMap.get(product.id)?.quantity || 0,
					revenue: productSalesMap.get(product.id)?.revenue || 0,
				};
			})
			.filter(p => p.quantity > 0)
			.sort((a, b) => b.quantity - a.quantity)
			.slice(0, 5)
			.map((product, index) => ({
				...product,
				rank: index + 1,
			}));

		return topProducts;
	}, [period, allOrders, allProducts]);

	if (loading) {
		return (
			<div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center min-h-[400px]">
				<div className="flex flex-col items-center gap-2">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<div className="text-gray-500 text-sm font-medium">Calculating top sales...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white p-6 md:p-8 rounded-xl shadow-md h-full flex flex-col relative">
			<div className="flex justify-between items-start mb-6 relative">
				<h2 className="text-2xl font-bold text-gray-900">Top sale</h2>
				<PeriodDropdown period={period} onPeriodChange={setPeriod} />
			</div>
			{data.length === 0 ? (
				<div className="flex-1 flex items-center justify-center text-gray-500 font-medium">
					No sales data in this period
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{data.map(product => {
						const productLink = `/products/${product.id}`;
						return (
							<div
								key={product.id}
								className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0 group"
							>
								<div className="flex items-center gap-4 flex-1">
									<Link href={productLink} className="flex-shrink-0 cursor-pointer">
										<div
											className="rounded-xl bg-gray-50 overflow-hidden border border-gray-100 shadow-sm"
											style={{ width: "64px", height: "64px", minWidth: "64px" }}
										>
											<img
												src={product.image}
												alt={product.name}
												className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
												onError={e => {
													(e.target as HTMLImageElement).src = "/images/placeholder-product.png";
												}}
											/>
										</div>
									</Link>

									<div className="flex flex-col">
										<Link href={productLink}>
											<h3 className="text-base font-bold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer">
												{product.name}
											</h3>
										</Link>
										<p className="text-sm font-semibold text-gray-500 mt-1">{formatPrice(product.price)}</p>
									</div>
								</div>

								<div className="flex flex-col items-end min-w-[60px]">
									<span className="text-base font-bold text-gray-900">{product.quantity}</span>
									<span className="text-xs text-gray-500 font-medium mt-0.5">Sales</span>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
