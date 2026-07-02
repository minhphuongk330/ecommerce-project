"use client";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Loader2 } from "lucide-react";
import { AdminOrder } from "~/types/admin";
import { formatDate, formatPrice } from "~/utils/format";
import { useScrollLock } from "~/hooks/useScrollLock";
import { router } from "~/utils/router";
import { exportInvoicePdf } from "~/utils/pdf";
import InvoiceTemplate from "~/components/Order/Detail/InvoiceTemplate";

interface OrderDetailsModalProps {
	order: AdminOrder | null;
	onClose: () => void;
}

interface OrderItemRowProps {
	item: Exclude<AdminOrder["orderItems"], undefined>[number];
}

const OrderItemRow = ({ item }: OrderItemRowProps) => {
	const variantDisplay = item.variant?.sku;
	const productLink = router.product(item.productId);

	return (
		<li className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
			<div className="flex items-center gap-4">
				<Link
					href={productLink}
					className="w-16 h-16 rounded border border-gray-100 overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
				>
					<img
						src={item.product?.mainImageUrl || "/images/placeholder-product.png"}
						className="w-full h-full object-cover"
						onError={e => {
							(e.target as HTMLImageElement).src = "/images/placeholder-product.png";
						}}
						alt={item.product?.name || "Product image"}
					/>
				</Link>

				<div className="flex flex-col gap-1">
					<Link
						href={productLink}
						className="font-bold text-gray-800 text-sm hover:text-blue-600 hover:underline transition-colors"
					>
						{item.product?.name}
					</Link>

					<div className="flex flex-wrap items-center gap-2">
						<span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
							SL: {item.quantity}
						</span>
						{item.colorId && (
							<span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
								Màu: {item.colorId}
							</span>
						)}
						{variantDisplay && (
							<span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
								Phân loại: {variantDisplay}
							</span>
						)}
					</div>
				</div>
			</div>
			<span className="font-bold text-gray-900 text-sm">{formatPrice(item.unitPrice)}</span>
		</li>
	);
};

const DeliveryAddressSection = ({ address }: { address: AdminOrder["address"] }) => {
	const addressContent = address ? (
		<div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
			<p className="text-sm font-semibold text-gray-900 mb-2">{address.receiverName}</p>
			<p className="text-xs text-gray-600 mb-2">{address.address}</p>
			<p className="text-xs text-gray-600">{address.phone}</p>
		</div>
	) : (
		<p className="text-xs text-gray-400 italic">Thông tin địa chỉ không có sẵn</p>
	);

	return (
		<div className="mb-6">
			<h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Địa chỉ giao hàng</h4>
			{addressContent}
		</div>
	);
};

const OrderProductsSection = ({ items = [] }: { items?: AdminOrder["orderItems"] }) => {
	return (
		<div>
			<h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Sản phẩm trong đơn hàng</h4>
			<ul className="flex flex-col gap-3">
				{items.map(item => (
					<OrderItemRow key={item.id} item={item} />
				))}
			</ul>
		</div>
	);
};

const ModalHeader = ({
	orderNo,
	createdAt,
	scheduledDeliveryDate,
	onClose,
}: {
	orderNo: string | number;
	createdAt: string;
	scheduledDeliveryDate?: string;
	onClose: () => void;
}) => {
	return (
		<div className="p-6 border-b border-gray-100 flex justify-between items-start">
			<div>
				<h3 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h3>
				<p className="text-sm text-gray-500 mt-1">Đơn hàng #{orderNo}</p>
				<p className="text-sm text-gray-500 mt-1">Ngày đặt: {formatDate(createdAt)}</p>
				<p className="text-sm text-gray-700 mt-1">
					Dự kiến giao hàng: {scheduledDeliveryDate ? formatDate(scheduledDeliveryDate) : "Chưa lên lịch"}
				</p>
			</div>
			<button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
				<CloseIcon />
			</button>
		</div>
	);
};

interface ModalFooterProps {
	onClose: () => void;
	order: AdminOrder;
	isExporting: boolean;
	onExport: () => void;
}

const ModalFooter = ({ onClose, order, isExporting, onExport }: ModalFooterProps) => {
	const canExportInvoice = (order as any).paymentStatus === "paid" || order.status === "Completed";

	return (
		<div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
			{canExportInvoice && (
				<button
					onClick={onExport}
					disabled={isExporting}
					className="px-6 py-2 border border-blue-600 text-blue-600 font-bold rounded-md hover:bg-blue-50 active:scale-95 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
				>
					{isExporting ? (
						<>
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Đang xuất HĐ...</span>
						</>
					) : (
						<>
							<Download className="w-4 h-4" />
							<span>Xuất hóa đơn</span>
						</>
					)}
				</button>
			)}
			<button
				onClick={onClose}
				className="px-8 py-2 bg-[#111827] text-white font-bold rounded-md hover:bg-black active:scale-95 transition-all text-sm"
			>
				Đóng
			</button>
		</div>
	);
};

const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
	const [mounted, setMounted] = useState(false);
	const [isExporting, setIsExporting] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useScrollLock(!!order);

	if (!mounted || !order) return null;

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

	return createPortal(
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 transition-all"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
				onClick={e => e.stopPropagation()}
			>
				<ModalHeader
					orderNo={order.orderNo || order.id}
					createdAt={order.createdAt}
					scheduledDeliveryDate={order.scheduledDeliveryDate}
					onClose={onClose}
				/>

				<div className="p-6 overflow-y-auto flex-1 bg-gray-50/20 custom-scrollbar">
					<DeliveryAddressSection address={order.address} />
					<OrderProductsSection items={order.orderItems || []} />
				</div>

				<ModalFooter
					onClose={onClose}
					order={order}
					isExporting={isExporting}
					onExport={handleExportInvoice}
				/>

				<div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
					<InvoiceTemplate order={order as any} id={`invoice-${order.orderNo}`} />
				</div>
			</div>
		</div>,
		document.body,
	);
};

export default OrderDetailsModal;
