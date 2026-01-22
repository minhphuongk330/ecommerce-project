import Link from "next/link";
import Image from "next/image";
import { OrderItem } from "~/types/order";
import { router } from "~/utils/router";
import { formatPrice } from "~/utils/format";

interface OrderItemsProps {
	items: OrderItem[];
}

export default function OrderItems({ items }: OrderItemsProps) {
	return (
		<div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
			<div className="p-4 border-b border-gray-100 bg-gray-50">
				<h3 className="font-bold text-gray-800">Order Items</h3>
			</div>
			<div className="p-4 flex flex-col gap-4">
				{items.map(item => (
					<div key={item.id} className="flex gap-4 py-2">
						<Link
							href={router.product(item.productId)}
							className="relative w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden border border-gray-200 block hover:opacity-80 transition-opacity"
						>
							{item.product?.mainImageUrl ? (
								<Image
									src={item.product.mainImageUrl}
									alt={item.product.name}
									fill
									sizes="80px"
									className="object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
							)}
						</Link>

						<div className="flex-1">
							<Link href={router.product(item.productId)} className="hover:underline">
								<h4 className="font-medium text-black line-clamp-2">{item.product?.name || "Product Name"}</h4>
							</Link>
							{item.colorId && <p className="text-sm text-gray-500 mt-1">Color: {item.colorId}</p>}
							<p className="text-sm text-gray-500">Qty: {item.quantity}</p>
						</div>

						<div className="text-right">
							<p className="font-bold text-black">{formatPrice(Number(item.unitPrice))}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
