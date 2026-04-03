"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import OrderEmptyState from "~/components/Order/EmptyState";
import OrderItem from "~/components/Order/OrderItem";
import { TableSkeleton } from "~/components/Skeletons";
import PaginationComponent from "~/components/atoms/Pagination";
import { useOrders } from "~/hooks/useOrders";

const ITEMS_PER_PAGE = 5;

function OrderListContent() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { orders, isLoading } = useOrders();
	const currentPage = searchParams.get("page") ? Math.max(1, parseInt(searchParams.get("page")!, 10)) : 1;
	const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
	const paginatedOrders = orders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		if (page > 1) params.set("page", page.toString());
		else params.delete("page");
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	if (isLoading) {
		return (
			<div className="w-full max-w-[800px] mx-auto py-6 md:py-[40px] px-4 md:px-6">
				<h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">My Orders</h1>
				<TableSkeleton rows={5} columns={4} />
			</div>
		);
	}

	if (orders.length === 0) {
		return <OrderEmptyState />;
	}

	return (
		<div className="w-full max-w-[800px] mx-auto py-6 md:py-[40px] px-4 md:px-6">
			<h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">My Orders</h1>
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
		<Suspense
			fallback={
				<div className="w-full max-w-[800px] mx-auto py-6 md:py-[40px] px-4 md:px-6">
					<h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">My Orders</h1>
					<TableSkeleton rows={5} columns={4} />
				</div>
			}
		>
			<OrderListContent />
		</Suspense>
	);
}
