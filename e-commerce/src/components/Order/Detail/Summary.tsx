"use client";
import { useState } from "react";
import ConfirmationModal from "~/components/atoms/Confirmation";
import StepButton from "~/components/checkout/Button";
import { Order } from "~/types/order";
import { formatPrice } from "~/utils/format";

interface OrderSummaryProps {
	order: Order;
	onCancelOrder: () => void;
}

export default function OrderSummary({ order, onCancelOrder }: OrderSummaryProps) {
	const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
	const isPending = order.status === "Pending";

	return (
		<div className="bg-white p-6 rounded-lg border border-gray-200">
			<h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Order Summary</h3>
			<div className="space-y-3 text-sm">
				<div className="flex justify-between text-gray-600">
					<span>Subtotal</span>
					<span>{formatPrice(Number(order.totalAmount))}</span>
				</div>
				<div className="flex justify-between text-gray-600">
					<span>Discount</span>
					<span className="text-green-600">-{formatPrice(Number(order.discount))}</span>
				</div>
				<div className="border-t pt-3 flex justify-between font-bold text-lg text-black">
					<span>Total</span>
					<span>{formatPrice(Number(order.totalAmount))}</span>
				</div>
			</div>

			{isPending && (
				<div className="mt-6">
					<StepButton
						primaryLabel="Cancel Order"
						onPrimaryClick={() => setIsCancelModalOpen(true)}
						className="!w-full !bg-white !text-red-600 border-red-200"
					/>
				</div>
			)}

			<ConfirmationModal
				isOpen={isCancelModalOpen}
				onClose={() => setIsCancelModalOpen(false)}
				title="Cancel Order"
				message="Are you sure you want to cancel this order? This action cannot be undone."
				onConfirm={onCancelOrder}
			/>
		</div>
	);
}
