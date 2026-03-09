"use client";
import CloseIcon from "@mui/icons-material/Close";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Link from "next/link";
import { memo, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import PaginationComponent from "~/components/atoms/Pagination";
import PeriodDropdown, { Period } from "~/components/atoms/PeriodDropdown";
import { adminService } from "~/services/admin";
import { AdminOrder } from "~/types/admin";
import { router } from "~/utils/router";

dayjs.extend(isBetween);

interface RecentOrdersProps {
	dateRange?: { startDate: Dayjs; endDate: Dayjs };
}

const RecentOrders = memo(({ dateRange }: RecentOrdersProps) => {
	const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [mounted, setMounted] = useState(false);

	const [period, setPeriod] = useState<Period>("weekly");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

	const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
		pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
		processing: { bg: "bg-blue-100", text: "text-blue-700" },
		shipped: { bg: "bg-purple-100", text: "text-purple-700" },
		delivered: { bg: "bg-green-100", text: "text-green-700" },
		cancelled: { bg: "bg-red-100", text: "text-red-700" },
	};

	useEffect(() => {
		setMounted(true);
		const fetchRecentOrders = async () => {
			try {
				setLoading(true);
				const orders = await adminService.getOrders();
				setAllOrders(orders);
			} catch (error) {
				console.error("Error fetching recent orders:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchRecentOrders();
	}, []);

	useEffect(() => {
		if (selectedOrder) {
			const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = `${scrollBarWidth}px`;
		} else {
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
		}
		return () => {
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
		};
	}, [selectedOrder]);

	const filteredAndSortedOrders = useMemo(() => {
		let startDate: dayjs.Dayjs;
		const endDate = dayjs().endOf("day");
		if (period === "yearly") startDate = dayjs().startOf("year");
		else if (period === "monthly") startDate = dayjs().startOf("month");
		else startDate = dayjs().subtract(6, "day").startOf("day");

		return allOrders
			.filter(order => dayjs(order.createdAt).isBetween(startDate, endDate, null, "[]"))
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}, [period, allOrders]);

	useEffect(() => {
		setCurrentPage(1);
	}, [period]);

	const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
	const paginatedOrders = filteredAndSortedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	if (loading) return <div className="bg-white p-6 rounded-lg shadow-md min-h-[465px]">Loading...</div>;

	return (
		<>
			<div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
				<div className="flex justify-between items-start mb-4">
					<h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
					<PeriodDropdown period={period} onPeriodChange={setPeriod} />
				</div>

				{filteredAndSortedOrders.length === 0 ? (
					<div className="text-center py-8 text-gray-500">No orders found</div>
				) : (
					<div className="flex flex-col h-full justify-between">
						<div className="overflow-x-auto mb-6">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-gray-200">
										<th className="text-left py-2 px-3 font-semibold text-gray-600">Order #</th>
										<th className="text-left py-2 px-3 font-semibold text-gray-600">Customer</th>
										<th className="text-right py-2 px-3 font-semibold text-gray-600">Total</th>
										<th className="text-center py-2 px-3 font-semibold text-gray-600">Status</th>
										<th className="text-left py-2 px-3 font-semibold text-gray-600">Date</th>
									</tr>
								</thead>
								<tbody>
									{paginatedOrders.map(order => (
										<tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
											<td className="py-3 px-3 font-medium text-blue-600">
												<button onClick={() => setSelectedOrder(order)} className="hover:underline">
													#{order.orderNo}
												</button>
											</td>
											<td className="py-3 px-3">
												<div className="font-medium text-gray-800">{order.customer?.fullName || "Unknown"}</div>
												<div className="text-xs text-gray-500">{order.customer?.email}</div>
											</td>
											<td className="py-3 px-3 text-right font-bold text-gray-800">
												${Number(order.totalAmount).toFixed(2)}
											</td>
											<td className="py-3 px-3 text-center">
												<span
													className={`${STATUS_COLORS[order.status.toLowerCase()]?.bg} ${STATUS_COLORS[order.status.toLowerCase()]?.text} px-3 py-1 rounded-full text-xs font-semibold uppercase`}
												>
													{order.status}
												</span>
											</td>
											<td className="py-3 px-3 text-gray-600 text-xs">
												{dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="mt-auto pt-4 border-t border-gray-100">
							<PaginationComponent
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={page => setCurrentPage(page)}
							/>
						</div>
					</div>
				)}
			</div>

			{mounted &&
				selectedOrder &&
				createPortal(
					<div
						className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
						onClick={() => setSelectedOrder(null)}
					>
						<div
							className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
							onClick={e => e.stopPropagation()}
						>
							<div className="p-6 border-b border-gray-100 flex justify-between items-start">
								<div>
									<h3 className="text-xl font-bold text-gray-800">Order Details</h3>
									<p className="text-sm text-gray-500 mt-1">Order #{selectedOrder.orderNo}</p>
								</div>
								<button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
									<CloseIcon />
								</button>
							</div>

							<div className="p-6 overflow-y-auto flex-1 bg-gray-50/20 custom-scrollbar">
								<div className="mb-6">
									<h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
										Delivery Address
									</h4>
									{selectedOrder.address ? (
										<div className="bg-white p-4 rounded-lg border border-gray-200">
											<p className="text-sm font-semibold text-gray-900 mb-2">{selectedOrder.address.receiverName}</p>
											<p className="text-xs text-gray-600 mb-2">{selectedOrder.address.address}</p>
											<p className="text-xs text-gray-600">{selectedOrder.address.phone}</p>
										</div>
									) : (
										<p className="text-xs text-gray-400 italic">Address info not available</p>
									)}
								</div>

								<h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
									Products in this order
								</h4>
								<ul className="flex flex-col gap-3">
									{selectedOrder.orderItems?.map(item => {
										const variant = (item.product as any)?.variants?.find(
											(v: any) => Number(v.id) === Number((item as any).variantId),
										);
										const productLink = router.product(item.productId);

										return (
											<li
												key={item.id}
												className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
											>
												<div className="flex items-center gap-4">
													<Link
														href={productLink}
														className="w-16 h-16 rounded border border-gray-100 overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
													>
														<img
															src={item.product?.mainImageUrl}
															className="w-full h-full object-cover"
															onError={e => {
																(e.target as HTMLImageElement).src = "/images/placeholder-product.png";
															}}
														/>
													</Link>

													<div className="flex flex-col gap-1">
														<Link
															href={productLink}
															className="font-bold text-gray-800 text-sm hover:text-blue-600 hover:underline transition-colors"
														>
															{item.product?.name}
														</Link>

														<div className="flex gap-2">
															<span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
																Qty: {item.quantity}
															</span>
															{item.colorId && (
																<span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
																	Color: {item.colorId}
																</span>
															)}
															{variant?.sku && (
																<span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
																	Variant: {variant.sku}
																</span>
															)}
														</div>
													</div>
												</div>
												<span className="font-bold text-gray-900 text-sm">${Number(item.unitPrice).toFixed(2)}</span>
											</li>
										);
									})}
								</ul>
							</div>

							<div className="p-4 border-t border-gray-100 flex justify-end">
								<button
									onClick={() => setSelectedOrder(null)}
									className="px-8 py-2 bg-[#111827] text-white font-bold rounded-md active:scale-95 transition-transform"
								>
									Close
								</button>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
});

RecentOrders.displayName = "RecentOrders";
export default RecentOrders;
