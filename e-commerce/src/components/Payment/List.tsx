import { CartItem } from "~/hooks/usePaymentSummary";
import SummaryItem from "./Item";

interface SummaryListProps {
	items: { item: CartItem; total: number }[];
}

export default function SummaryList({ items }: SummaryListProps) {
	if (!items.length) return <p className="text-gray-500 text-sm text-center">Cart is empty</p>;

	return (
		<div className="flex flex-col gap-[16px] mb-[24px]">
			{items.map(({ item, total }) => (
				<SummaryItem key={item.id} item={item} total={total} />
			))}
		</div>
	);
}
