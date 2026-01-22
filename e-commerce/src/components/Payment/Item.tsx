import Image from "next/image";
import { CartItem, formatPrice } from "~/hooks/usePaymentSummary";

interface SummaryItemProps {
	item: CartItem;
	total: number;
}

export default function SummaryItem({ item, total }: SummaryItemProps) {
	return (
		<div className="flex items-center justify-between p-[16px] bg-[#F6F6F6] rounded-[10px]">
			<div className="flex items-center gap-[16px]">
				<div className="relative w-[48px] h-[48px] mix-blend-multiply flex-shrink-0">
					<Image src={item.mainImageUrl} alt={item.name} fill sizes="48px" className="object-contain" />
				</div>
				<div className="flex flex-col">
					<span className="text-[14px] lg:text-[16px] font-medium text-black truncate max-w-[150px]">{item.name}</span>
					<span className="text-[12px] text-gray-500">
						x{item.quantity} {item.selectedColor && `| ${item.selectedColor}`}
					</span>
				</div>
			</div>
			<span className="text-[14px] lg:text-[16px] font-bold text-black">{formatPrice(total)}</span>
		</div>
	);
}
