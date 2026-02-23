"use client";
import Close from "@mui/icons-material/Close";
import React, { useState } from "react";
import ConfirmationModal from "~/components/atoms/Confirmation";
import { CartListProps } from "~/types/cart";
import CommonIconButton from "../atoms/IconButton";
import QuantitySelector from "../atoms/QuantitySelection";

const CartList: React.FC<CartListProps> = ({ items, onRemove, onIncrease, onDecrease }) => {
	const [deleteId, setDeleteId] = useState<number | null>(null);

	const handleConfirmDelete = async () => {
		if (!deleteId) return;
		try {
			await onRemove(deleteId);
			setDeleteId(null);
		} catch (error) {
			console.error("Delete from cart failed:", error);
		}
	};

	return (
		<div className="flex flex-col">
			{items.map((item, index) => {
				const selectedVariant = item.variants?.find((v: any) => Number(v.id) === Number(item.variantId));

				return (
					<div
						key={`${item.cartItemId}-${index}`}
						className="relative w-full flex flex-row items-start sm:items-center py-4 md:py-6 border-b border-[#ECECEC] last:border-0 gap-4 sm:gap-0"
					>
						<div className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] flex-shrink-0 flex items-center justify-center sm:mr-[15px]">
							<img
								src={item.mainImageUrl}
								alt={item.name}
								className="max-w-full max-h-full object-contain mix-blend-multiply"
							/>
						</div>

						<div className="flex-1 w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center justify-between min-h-[80px] sm:min-h-0">
							<div className="w-full sm:w-[191px] flex flex-col gap-1 sm:gap-2 pr-8 sm:pr-0">
								<h3 className="text-sm sm:text-base font-medium text-black line-clamp-2 leading-tight sm:leading-6">
									{item.name}
								</h3>
								<div className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-1">
									{item.selectedColor && <span>{item.selectedColor}</span>}
									{selectedVariant && <span>{selectedVariant.sku}</span>}
								</div>
							</div>

							<div className="w-full sm:w-[240px] flex flex-row items-center justify-start gap-4 sm:gap-0 sm:justify-between mt-auto sm:mt-0">
								<QuantitySelector
									quantity={item.quantity}
									onIncrease={() => onIncrease(item.cartItemId!)}
									onDecrease={() => (item.quantity > 1 ? onDecrease(item.cartItemId!) : setDeleteId(item.cartItemId!))}
								/>
								<span className="text-base sm:text-xl font-medium text-black">
									${selectedVariant ? selectedVariant.price : item.price}
								</span>
								<div className="absolute top-4 right-0 sm:static">
									<CommonIconButton
										onClick={() => setDeleteId(item.cartItemId!)}
										className="w-6 h-6 flex items-center justify-center text-black hover:text-red-500 transition-colors"
										icon={<Close sx={{ fontSize: 20 }} />}
									/>
								</div>
							</div>
						</div>
					</div>
				);
			})}

			<ConfirmationModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleConfirmDelete}
				title="Remove Product"
				message="Do you want to remove this item from your cart?"
				confirmLabel="Remove"
				confirmButtonColor="!bg-red-600 hover:!bg-red-700"
			/>
		</div>
	);
};

export default CartList;
