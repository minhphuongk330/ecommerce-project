"use client";
import { Suspense } from "react";
import OrderEmptyState from "~/components/Order/EmptyState";
import OrderItem from "~/components/Order/OrderItem";
import { TableSkeleton } from "~/components/Skeletons";
import PaginationComponent from "~/components/atoms/Pagination";
import { useOrders } from "~/hooks/useOrders";
import { useUrlPagination, paginateItems } from "~/hooks/usePagination";

const ITEMS_PER_PAGE = 5;

function OrderListSkeleton() {
	return (
		<div className="w-full max-w-[800px] mx-auto py-6 md:py-[40px] px-4 md:px-6 font-sans">
			<h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Đơn hàng của tôi</h1>
			<TableSkeleton rows={5} columns={4} />
		</div>
	);
}

function OrderListContent() {
	const { orders, isLoading } = useOrders();
	const { currentPage, totalPages, handlePageChange } = useUrlPagination(orders.length, ITEMS_PER_PAGE);
	const paginatedOrders = paginateItems(orders, currentPage, ITEMS_PER_PAGE);

	if (isLoading) return <OrderListSkeleton />;

	if (orders.length === 0) {
		return <OrderEmptyState />;
	}

	return (
		<div className="w-full max-w-[800px] mx-auto py-6 md:py-[40px] px-4 md:px-6 font-sans">
			<h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Đơn hàng của tôi</h1>
			<div className="flex flex-col">
				{paginatedOrders.map(order => (
					<OrderItem key={order.id} order={order} />
				))}
			</div>
			{totalPages > 1 && (
				<div className="mt-6">
					<PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
				</div>
			)}
		</div>
	);
}

export default function OrderListPage() {
	return (
		<Suspense fallback={<OrderListSkeleton />}>
			<OrderListContent />
		</Suspense>
	);
}
