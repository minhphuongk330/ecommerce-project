"use client";
import { useRouter } from "next/navigation";
import React from "react";
import FavoriteBtn from "~/components/atoms/FavoriteBtn";
import { ProductCardProps } from "~/types/component";

interface ExtendedProductCardProps extends ProductCardProps {
	preselectedSku?: string;
	variantId?: number;
	/** Flash Sale stock information */
	quantity?: number;
	soldQuantity?: number;
}

const formatPrice = (price: number | string): string => {
	const num = typeof price === "string" ? parseFloat(price) : price;
	if (isNaN(num)) return "Liên hệ";
	return num.toLocaleString("vi-VN") + "₫";
};

const calcDiscount = (original: number | string, sale: number | string): number => {
	const orig = typeof original === "string" ? parseFloat(original) : original;
	const s = typeof sale === "string" ? parseFloat(sale) : sale;
	if (!orig || !s || orig <= s) return 0;
	return Math.round(((orig - s) / orig) * 100);
};

const ProductCard: React.FC<ExtendedProductCardProps> = ({
	product,
	preselectedSku,
	variantId,
	quantity,
	soldQuantity,
}) => {
	const router = useRouter();

	const handleClick = (e?: React.MouseEvent) => {
		e?.stopPropagation();
		const url = preselectedSku ? `/products/${product.id}?sku=${preselectedSku}` : `/products/${product.id}`;
		router.push(url);
	};

	// Auto-detect sale logic - Clean single source of truth
	const isFlashSale = (product as any).isFlashSale || false;
	const flashSaleDiscount = (product as any).flashSaleDiscount || 0;

	// Calculate display prices based on sale condition
	const getDisplayPrices = () => {
		const basePrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
		const originalPrice = product.originalPrice ?
			(typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : product.originalPrice) :
			basePrice;

		if (isFlashSale && flashSaleDiscount > 0) {
			// Flash Sale: apply discount percentage
			const salePrice = basePrice * (1 - flashSaleDiscount / 100);
			return { displayPrice: salePrice, displayOriginal: originalPrice, discountPct: flashSaleDiscount };
		}

		// Regular pricing
		return { displayPrice: basePrice, displayOriginal: originalPrice, discountPct: 0 };
	};

	const { displayPrice, displayOriginal, discountPct } = getDisplayPrices();

	// Flash Sale stock calculation
	const remainingStock = quantity && soldQuantity !== undefined ? quantity - soldQuantity : null;
	const stockPercentage = quantity && soldQuantity !== undefined ? (soldQuantity / quantity) * 100 : null;
	const isLowStock = remainingStock !== null && remainingStock <= 3 && remainingStock > 0;
	const isSoldOut = remainingStock === 0;

	const installment = product.installmentPrice
		? `${formatPrice(product.installmentPrice)} x 6T`
		: null;

	const memberPrice = product.memberPrice ? formatPrice(product.memberPrice) : null;

	const stockStatus = product.stockStatus ?? (product.stock > 0 ? "in_stock" : "out_of_stock");
	const isContact = stockStatus === "contact";
	const isInStock = stockStatus === "in_stock";

	return (
		<div
			className="w-full h-full flex flex-col bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden group"
			onClick={handleClick}
		>
			{/* Image */}
			<div className="relative w-full pt-[100%] bg-white overflow-hidden">
				<img
					src={product.mainImageUrl}
					alt={product.name}
					className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-110"
				/>
				{product.badgeLabel && (
					<span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
						{product.badgeLabel}
					</span>
				)}
				{discountPct > 0 && (
					<span className="absolute top-2 right-2 bg-red-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
						-{discountPct}%
					</span>
				)}
				<div className="absolute bottom-2 right-2" onClick={e => e.stopPropagation()}>
					<FavoriteBtn productId={Number(product.id)} variantId={variantId} iconSize="small" />
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-col flex-1 px-3 pb-3 pt-2 gap-1">
				<h3 className="text-[13px] font-medium text-gray-800 line-clamp-2 leading-snug min-h-[36px]">
					{product.name}
				</h3>

				<div className="flex items-baseline gap-1.5 flex-wrap">
					<span className="text-[15px] font-bold text-red-600">{formatPrice(displayPrice)}</span>
					{displayOriginal && Number(displayOriginal) > Number(displayPrice) && (
						<span className="text-[12px] text-gray-400 line-through">{formatPrice(displayOriginal)}</span>
					)}
				</div>

				{installment && (
					<p className="text-[11px] text-gray-500">
						Hoặc <span className="font-medium text-gray-700">{installment}</span>
					</p>
				)}

				{memberPrice && (
					<p className="text-[11px] text-blue-600">
						Giá Member: <span className="font-semibold">{memberPrice}</span>
					</p>
				)}

				{/* Flash Sale Stock Indicator - Style Thế Giới Di Động */}
				{isFlashSale && remainingStock !== null && (
					<div className="mt-2">
						<div className="flex items-center justify-between mb-1">
							<span className={`text-[11px] font-medium ${isSoldOut ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'
								}`}>
								{isSoldOut ? 'Đã bán hết' : `Còn lại ${remainingStock} sản phẩm`}
							</span>
							{stockPercentage !== null && (
								<span className="text-[11px] text-gray-500">
									Đã bán {Math.round(stockPercentage)}%
								</span>
							)}
						</div>
						<div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
							<div
								className={`h-full transition-all duration-500 ease-out ${isSoldOut ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-green-500'
									}`}
								style={{ width: `${Math.min(stockPercentage || 0, 100)}%` }}
							/>
						</div>
						{isLowStock && !isSoldOut && (
							<p className="text-[10px] text-orange-600 mt-1">⚡ Sắp hết hàng</p>
						)}
					</div>
				)}

				<div className="flex items-center justify-between mt-auto pt-2 gap-2">
					<span
						className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${isInStock
							? "bg-green-50 text-green-600"
							: isContact
								? "bg-blue-50 text-blue-600"
								: "bg-gray-100 text-gray-500"
							}`}
					>
						{isInStock ? "Sẵn hàng" : isContact ? "Liên hệ" : "Hết hàng"}
					</span>

					<button
						onClick={e => { e.stopPropagation(); handleClick(); }}
						className={`text-[12px] font-semibold px-3 py-1.5 rounded-md flex-shrink-0 transition-colors ${isContact
							? "bg-blue-600 hover:bg-blue-700 text-white"
							: isInStock
								? "bg-red-600 hover:bg-red-700 text-white"
								: "bg-gray-300 text-gray-500 cursor-not-allowed"
							}`}
					>
						{isContact ? "Liên hệ" : "Mua ngay"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
