import { Address } from "~/types/address";
import { ShippingMethod } from "~/types/shipping";

interface SummaryInfoProps {
	address?: Address | null;
	shipmentLabel: string;
	shippingMethod?: ShippingMethod | null;
	scheduledDate?: string | null;
}

export default function SummaryInfo({ address, shipmentLabel, shippingMethod, scheduledDate }: SummaryInfoProps) {
	return (
		<div className="flex flex-col gap-[24px] mb-[24px]">
			<div className="flex flex-col gap-[8px]">
				<span className="text-[14px] text-[#717171]">Address</span>
				<span className="text-[16px] text-black">{address?.address || "No address selected"}</span>
			</div>

			<div className="flex flex-col gap-[8px]">
				<span className="text-[14px] text-[#717171]">Shipment method</span>
				<span className="text-[16px] text-black">
					{shipmentLabel}
					{shippingMethod?.type === "schedule" && scheduledDate && ` (${scheduledDate})`}
				</span>
			</div>
		</div>
	);
}
