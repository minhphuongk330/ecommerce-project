"use client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useMemo, useState } from "react";
import OrderDetailsModal from "~/components/Admin/OrderDetailsModal";
import PaginationComponent from "~/components/atoms/Pagination";
import PeriodDropdown, { Period } from "~/components/atoms/PeriodDropdown";
import { AdminOrder } from "~/types/admin";
import { formatPrice } from "~/utils/format";
import { getDateRangeByPeriod } from "~/utils/admin/dashboardUtils";

dayjs.extend(isBetween);

const ITEMS_PER_PAGE = 5;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
	pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
	processing: { bg: "bg-blue-100", text: "text-blue-700" },
	shipped: { bg: "bg-purple-100", text: "text-purple-700" },
	delivered: { bg: "bg-green-100", text: "text-green-700" },
	cancelled: { bg: "bg-red-100", text: "text-red-700" },
};

export default function RecentOrders({ allOrders }: { allOrders: AdminOrder[] }) {
	const [period, setPeriod] = useState<Period>("weekly");
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

	useEffect(() => {
		setCurrentPage(1);
	}, [period]);

	const filteredAndSortedOrders = useMemo(() => {
		const { startDate, endDate } = getDateRangeByPeriod(period);
		return allOrders
			.filter(order => dayjs(order.createdAt).isBetween(startDate, endDate, null, "[]"))
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}, [period, allOrders]);

	const totalPages = Math.ceil(filteredAndSortedOrders.length / ITEMS_PER_PAGE);
	const paginatedOrders = filteredAndSortedOrders.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	return (
		<>
			<div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
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
											<td className="py-3 px-3 text-right font-bold text-gray-800">{formatPrice(order.totalAmount)}</td>
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

			<OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
		</>
	);
}
