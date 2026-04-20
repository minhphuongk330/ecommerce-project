"use client";
import { useParams, useRouter } from "next/navigation";
import SingleBtn from "~/components/atoms/SingleBtn";
import OrderAddress from "~/components/Order/Detail/Address";
import OrderHeader from "~/components/Order/Detail/Header";
import OrderItems from "~/components/Order/Detail/Item";
import OrderSummary from "~/components/Order/Detail/Summary";
import { DetailPageSkeleton } from "~/components/Skeletons";
import { useOrderDetail } from "~/hooks/useOrderDetail";
import { routerPaths } from "~/utils/router";

export default function OrderDetailPage() {
	const router = useRouter();
	const params = useParams();
	const orderId = params?.id ? Number(params.id) : null;
	const { order, isLoading, cancelOrder } = useOrderDetail(orderId);
	const handleBack = () => {
		router.push(routerPaths.order);
	};

	if (isLoading) {
		return (
			<div className="w-full max-w-[1120px] mx-auto py-8 px-4">
				<div className="mb-6">
					<div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
				</div>
				<DetailPageSkeleton />
			</div>
		);
	}
	if (!order) return <div className="p-10 text-center text-red-500">Order not found.</div>;

	return (
		<div className="w-full max-w-[1120px] mx-auto py-8 px-4">
			<div className="inline-flex items-center mb-6 gap-2 cursor-pointer group" onClick={handleBack}>
				<SingleBtn direction="left" onClick={handleBack} />
				<span className="text-gray-500 group-hover:text-black transition-colors">Back to My Orders</span>
			</div>

			<div className="flex flex-col lg:flex-row gap-8">
				<div className="flex-1">
					<OrderHeader order={order} />
					<OrderItems items={order.orderItems} />
				</div>

				<div className="w-full lg:w-[360px] flex flex-col gap-6">
					<OrderAddress address={order.address} />
					<OrderSummary order={order} onCancelOrder={cancelOrder} />
				</div>
			</div>
		</div>
	);
}
