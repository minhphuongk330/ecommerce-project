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
	const subtotal = Number(order.subtotal);
	const tax = Number(order.taxAmount);
	const shippingCost = Number(order.shippingCost);
	const discount = Number(order.discount ?? 0);
	const shippingDiscount = Number(order.shippingDiscount ?? 0);
	const total = Number(order.totalAmount);

	const isCOD = order.paymentMethod !== "VNPAY";
	const paymentLabel = isCOD ? "Thanh toán khi nhận hàng (COD)" : "Đã thanh toán qua VNPay ✓";
	const paymentColor = isCOD ? "text-amber-500" : "text-green-600";

	return (
		<div className="bg-white p-6 rounded-lg border border-gray-200">
			<h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Order Summary</h3>

			<div className="space-y-3 text-sm">
				<div className="flex justify-between text-gray-600">
					<span>Subtotal</span>
					<span className="font-medium">{formatPrice(subtotal)}</span>
				</div>

				<div className="flex justify-between text-gray-600">
					<span>Tax</span>
					<span className="font-medium">{formatPrice(tax)}</span>
				</div>

				<div className="flex justify-between text-gray-600">
					<span>Shipping & Handling</span>
					<span className="font-medium">{shippingCost === 0 && shippingDiscount === 0 ? "Free" : formatPrice(shippingCost)}</span>
				</div>

				{shippingDiscount > 0 && (
					<div className="flex justify-between text-green-600">
						<span>Giảm phí ship</span>
						<span className="font-medium">-{formatPrice(shippingDiscount)}</span>
					</div>
				)}

				{discount > 0 && (
					<div className="flex justify-between text-green-600">
						<span>Giảm giá sản phẩm</span>
						<span className="font-medium">-{formatPrice(discount)}</span>
					</div>
				)}

				{/* Phương thức thanh toán */}
				<div className="flex justify-between items-center">
					<span className="text-gray-600">Phương thức TT</span>
					<span className={`font-semibold text-xs ${paymentColor}`}>{paymentLabel}</span>
				</div>

				<div className="border-t pt-3 flex justify-between font-bold text-lg text-black">
					<span>Total</span>
					<span>{formatPrice(total)}</span>
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
