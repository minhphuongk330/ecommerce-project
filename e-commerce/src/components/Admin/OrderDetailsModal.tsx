"use client";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AdminOrder } from "~/types/admin";
import { formatDate, formatPrice } from "~/utils/format";
import { router } from "~/utils/router";

interface OrderDetailsModalProps {
	order: AdminOrder | null;
	onClose: () => void;
}

interface OrderItemRowProps {
	item: Exclude<AdminOrder["orderItems"], undefined>[number];
}

const OrderItemRow = ({ item }: OrderItemRowProps) => {
	const selectedVariant = (item.product as any)?.variants?.find(
		(v: any) => Number(v.id) === Number((item as any).variantId),
	);
	const variantDisplay = selectedVariant?.sku || (item as any)?.variant?.sku;
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
							Qty: {item.quantity}
						</span>
						{item.colorId && (
							<span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
								Color: {item.colorId}
							</span>
						)}
						{variantDisplay && (
							<span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
								Variant: {variantDisplay}
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
		<p className="text-xs text-gray-400 italic">Address info not available</p>
	);

	return (
		<div className="mb-6">
			<h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Delivery Address</h4>
			{addressContent}
		</div>
	);
};

const OrderProductsSection = ({ items = [] }: { items?: AdminOrder["orderItems"] }) => {
	return (
		<div>
			<h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Products in this order</h4>
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
				<h3 className="text-xl font-bold text-gray-800">Order Details</h3>
				<p className="text-sm text-gray-500 mt-1">Order #{orderNo}</p>
				<p className="text-sm text-gray-500 mt-1">Placed on: {formatDate(createdAt)}</p>
				<p className="text-sm text-gray-700 mt-1">
					Expected Delivery: {scheduledDeliveryDate ? formatDate(scheduledDeliveryDate) : "Not scheduled"}
				</p>
			</div>
			<button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
				<CloseIcon />
			</button>
		</div>
	);
};

const ModalFooter = ({ onClose }: { onClose: () => void }) => {
	return (
		<div className="p-4 border-t border-gray-100 flex justify-end bg-white">
			<button
				onClick={onClose}
				className="px-8 py-2 bg-[#111827] text-white font-bold rounded-md hover:bg-black active:scale-95 transition-all"
			>
				Close
			</button>
		</div>
	);
};

const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);
	useEffect(() => {
		if (order) {
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
	}, [order]);

	if (!mounted || !order) return null;

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

				<ModalFooter onClose={onClose} />
			</div>
		</div>,
		document.body,
	);
};

export default OrderDetailsModal;
