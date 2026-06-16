import { formatPrice } from "~/utils/format";

interface SummaryTotalsProps {
	subtotal: number;
	tax: number;
	shippingCost: number;
	total: number;
	discount?: number;
	shippingDiscount?: number;
}

export default function SummaryTotals({ subtotal, tax, shippingCost, total, discount = 0, shippingDiscount = 0 }: SummaryTotalsProps) {
	return (
		<div className="flex flex-col gap-[16px]">
			<div className="flex justify-between">
				<span className="text-black">Tạm tính</span>
				<span className="text-black">{formatPrice(subtotal)}</span>
			</div>
			<div className="flex justify-between">
				<span className="text-[#717171]">Thuế (10%)</span>
				<span className="text-[#717171]">{formatPrice(tax)}</span>
			</div>
			<div className="flex justify-between">
				<span className="text-[#717171]">Phí vận chuyển</span>
				<span className="text-[#717171]">{shippingCost === 0 && shippingDiscount === 0 ? "Miễn phí" : formatPrice(shippingCost)}</span>
			</div>
			{shippingDiscount > 0 && (
				<div className="flex justify-between">
					<span className="text-green-600">Giảm phí ship</span>
					<span className="text-green-600">-{formatPrice(shippingDiscount)}</span>
				</div>
			)}
			{discount > 0 && (
				<div className="flex justify-between">
					<span className="text-green-600">Giảm giá sản phẩm</span>
					<span className="text-green-600">-{formatPrice(discount)}</span>
				</div>
			)}
			<div className="flex justify-between mt-[8px] pt-[16px] border-t border-[#EBEBEB]">
				<span className="font-semibold text-black">Tổng cộng</span>
				<span className="font-semibold text-black">{formatPrice(total)}</span>
			</div>
		</div>
	);
}
