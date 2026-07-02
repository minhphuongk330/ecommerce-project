"use client";
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import ConfirmationModal from "~/components/atoms/Confirmation";
import StepButton from "~/components/checkout/Button";
import { Order } from "~/types/order";
import { formatPrice } from "~/utils/format";
import { exportInvoicePdf } from "~/utils/pdf";
import InvoiceTemplate from "./InvoiceTemplate";

interface OrderSummaryProps {
	order: Order;
	onCancelOrder: () => void;
}

export default function OrderSummary({ order, onCancelOrder }: OrderSummaryProps) {
	const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
	const [isExporting, setIsExporting] = useState(false);

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

	const canExportInvoice = order.paymentStatus === "paid" || order.status === "Completed";

	const handleExportInvoice = async () => {
		setIsExporting(true);
		try {
			await exportInvoicePdf(`invoice-${order.orderNo}`, `hoa-don-${order.orderNo}`);
		} catch (err) {
			console.error("Export invoice error:", err);
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg border border-gray-200 relative">
			<h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Tóm tắt đơn hàng</h3>

			<div className="space-y-3 text-sm">
				<div className="flex justify-between text-gray-600">
					<span>Tạm tính</span>
					<span className="font-medium">{formatPrice(subtotal)}</span>
				</div>

				<div className="flex justify-between text-gray-600">
					<span>Thuế (VAT)</span>
					<span className="font-medium">{formatPrice(tax)}</span>
				</div>

				<div className="flex justify-between text-gray-600">
					<span>Phí vận chuyển</span>
					<span className="font-medium">{shippingCost === 0 && shippingDiscount === 0 ? "Miễn phí" : formatPrice(shippingCost)}</span>
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

				<div className="flex justify-between items-center">
					<span className="text-gray-600">Phương thức TT</span>
					<span className={`font-semibold text-xs ${paymentColor}`}>{paymentLabel}</span>
				</div>

				<div className="border-t pt-3 flex justify-between font-bold text-lg text-black">
					<span>Tổng cộng</span>
					<span>{formatPrice(total)}</span>
				</div>
			</div>

			{canExportInvoice && (
				<div className="mt-6">
					<button
						onClick={handleExportInvoice}
						disabled={isExporting}
						className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-md transition-colors text-sm cursor-pointer shadow-sm"
					>
						{isExporting ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>Đang xuất PDF...</span>
							</>
						) : (
							<>
								<Download className="w-4 h-4" />
								<span>Xuất hóa đơn PDF</span>
							</>
						)}
					</button>
				</div>
			)}

			{isPending && (
				<div className="mt-6">
					<StepButton
						primaryLabel="Hủy đơn hàng"
						onPrimaryClick={() => setIsCancelModalOpen(true)}
						className="!w-full !bg-white !text-red-600 border-red-200"
					/>
				</div>
			)}

			<ConfirmationModal
				isOpen={isCancelModalOpen}
				onClose={() => setIsCancelModalOpen(false)}
				title="Hủy đơn hàng"
				message="Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác."
				onConfirm={onCancelOrder}
			/>

			<div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
				<InvoiceTemplate order={order} id={`invoice-${order.orderNo}`} />
			</div>
		</div>
	);
}
