import { formatPrice } from "~/hooks/usePaymentSummary";

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
				<span className="font-medium">Subtotal</span>
				<span className="font-medium">{formatPrice(subtotal)}</span>
			</div>
			<div className="flex justify-between">
				<span className="text-[#717171]">Estimated Tax</span>
				<span className="font-medium">{formatPrice(tax)}</span>
			</div>
			<div className="flex justify-between">
				<span className="text-[#717171]">Estimated shipping & Handling</span>
				<span className="font-medium">{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
			</div>
			<div className="flex justify-between mt-[8px]">
				<span className="font-bold">Total</span>
				<span className="font-bold">{formatPrice(total)}</span>
			</div>
		</div>
	);
}
