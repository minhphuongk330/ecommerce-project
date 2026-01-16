"use client";
import { Close } from "@mui/icons-material";
import React, { useState } from "react";
import ConfirmationModal from "~/components/atoms/Confirmation";
import { CartListProps } from "~/types/cart";
import CommonIconButton from "../atoms/IconButton";
import QuantitySelector from "../atoms/QuantitySelection";

const CartList: React.FC<CartListProps> = ({ items, onRemove, onIncrease, onDecrease }) => {
	const [deleteId, setDeleteId] = useState<number | null>(null);
	const handleConfirmDelete = async () => {
		if (!deleteId) return;
		await onRemove(deleteId);
		setDeleteId(null);
	};

	return (
		<div className="flex flex-col">
			{items.map(item => (
				<div key={item.id} className="w-full flex flex-col sm:flex-row items-start sm:items-center py-4 md:py-6 border-b border-[#ECECEC] last:border-0 gap-4 sm:gap-0">
					<div className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] flex-shrink-0 flex items-center justify-center sm:mr-[15px]">
						<img
							src={item.mainImageUrl}
							alt={item.name}
							className="max-w-full max-h-full object-contain mix-blend-multiply"
						/>
					</div>

					<div className="flex-1 w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
						<div className="w-full sm:w-[191px] flex flex-col gap-2">
							<h3 className="text-sm sm:text-base font-medium text-black line-clamp-2 leading-6">{item.name}</h3>
							{item.sku && <span className="text-xs sm:text-sm text-gray-500">#{item.sku}</span>}
						</div>

						<div className="w-full sm:w-[240px] flex flex-row items-center justify-between sm:justify-between">
							<QuantitySelector
								quantity={item.quantity}
								onIncrease={() => onIncrease(item.id)}
								onDecrease={() => (item.quantity > 1 ? onDecrease(item.id) : setDeleteId(item.id))}
							/>
							<span className="text-lg sm:text-xl font-medium text-black">${item.price}</span>
							<CommonIconButton
								onClick={() => setDeleteId(item.id)}
								className="w-6 h-6 flex items-center justify-center text-black hover:text-red-500 transition-colors"
								icon={<Close sx={{ fontSize: 24 }} />}
							/>
						</div>
					</div>
				</div>
			))}

			<ConfirmationModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={handleConfirmDelete}
				title="Remove Product"
				message="Do you want to remove this product from your cart?"
				confirmLabel="Remove"
				confirmButtonColor="!bg-red-600 hover:!bg-red-700"
			/>
		</div>
	);
};

export default CartList;
