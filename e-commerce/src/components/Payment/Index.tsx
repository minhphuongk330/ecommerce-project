"use client";
import { usePaymentSummary } from "~/hooks/usePaymentSummary";
import SummaryTotals from "./Totals";
import SummaryInfo from "./Info";
import SummaryList from "./List";

export default function PaymentSummary() {
	const {
		itemsWithTotal,
		selectedAddress,
		selectedShippingMethod,
		scheduledDate,
		shipmentLabel,
		subtotal,
		taxAmount,
		shippingCost,
		total,
	} = usePaymentSummary();

	return (
		<div className="w-full border border-[#EBEBEB] rounded-[10px] p-4 md:p-[24px] lg:p-[32px] bg-white h-fit shadow-sm">
			<h3 className="text-lg md:text-[20px] font-medium text-black mb-4 md:mb-[24px]">Summary</h3>

			<SummaryList items={itemsWithTotal} />

			<SummaryInfo
				address={selectedAddress}
				shipmentLabel={shipmentLabel}
				shippingMethod={selectedShippingMethod}
				scheduledDate={scheduledDate}
			/>

			<SummaryTotals subtotal={subtotal} tax={taxAmount} shippingCost={shippingCost} total={total} />
		</div>
	);
}
