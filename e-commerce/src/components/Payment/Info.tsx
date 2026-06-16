import { Address } from "~/types/address";
import { ShippingMethod } from "~/types/shipping";
import { formatDate } from "~/utils/format";

interface SummaryInfoProps {
	address?: Address | null;
	shipmentLabel: string;
	shippingMethod?: ShippingMethod | null;
	scheduledDate?: string | null;
}

export default function SummaryInfo({ address, shipmentLabel, shippingMethod, scheduledDate }: SummaryInfoProps) {
	const displayDate = shippingMethod?.type === "schedule" 
		? (scheduledDate ? formatDate(scheduledDate) : null) 
		: (shippingMethod?.estimatedDate ? formatDate(shippingMethod.estimatedDate) : null);

	return (
		<div className="flex flex-col gap-[24px] mb-[24px]">
			<div className="flex flex-col gap-[8px]">
				<span className="text-[14px] text-[#717171]">Địa chỉ nhận hàng</span>
				<span className="text-[16px] text-black">{address?.address || "Chưa chọn địa chỉ"}</span>
			</div>

			<div className="flex flex-col gap-[8px]">
				<span className="text-[14px] text-[#717171]">Phương thức vận chuyển</span>
				<span className="text-[16px] text-black">
					{shippingMethod?.name || "Chưa chọn"} {displayDate ? `(${displayDate})` : ""}
				</span>
			</div>
		</div>
	);
}
