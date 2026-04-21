import { formatPrice } from "~/utils/format";

interface SummaryTotalsProps {
	subtotal: number;
	tax: number;
	shippingCost: number;
	total: number;
}

export default function SummaryTotals({ subtotal, tax, shippingCost, total }: SummaryTotalsProps) {
	return (
		<div className="flex flex-col gap-[16px]">
			<div className="flex justify-between">
				<span className="text-black">Subtotal</span>
				<span className="text-black">{formatPrice(subtotal)}</span>
			</div>
			<div className="flex justify-between">
				<span className="text-[#717171]">Tax (10%)</span>
				<span className="text-[#717171]">{formatPrice(tax)}</span>
			</div>
			<div className="flex justify-between">
				<span className="text-[#717171]">Shipping & Handling</span>
				<span className="text-[#717171]">{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
			</div>
			<div className="flex justify-between mt-[8px] pt-[16px] border-t border-[#EBEBEB]">
				<span className="font-semibold text-black">Total</span>
				<span className="font-semibold text-black">{formatPrice(total)}</span>
			</div>
		</div>
	);
}

