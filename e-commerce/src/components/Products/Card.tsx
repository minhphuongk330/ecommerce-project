"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ProductCardProps } from "~/types/component";
import Button from "~/components/atoms/Button";
import FavoriteBtn from "~/components/atoms/FavoriteBtn";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
	const router = useRouter();
	const handleBuyNow = () => {
		router.push(`/products/${product.id}`);
	};

	return (
		<div className="w-full min-h-[290px] md:min-h-[432px] h-full flex flex-col items-center bg-[#F6F6F6] rounded-[9px] p-3 md:p-6 text-center transition-all duration-300">
			<div className="w-full flex justify-end mb-1 md:mb-4">
				<FavoriteBtn productId={product.id} iconSize="medium" />
			</div>

			<div
				className="h-[120px] md:h-[160px] w-full flex justify-center items-center mb-2 md:mb-4 cursor-pointer"
				onClick={handleBuyNow}
			>
				<img
					src={product.mainImageUrl}
					alt={product.name}
					className="h-full w-auto object-contain max-w-full mix-blend-multiply"
				/>
			</div>

			<div className="flex-grow flex flex-col items-center w-full mb-2 md:mb-4">
				<h3 className="text-sm md:text-base font-medium text-black mb-1 md:mb-2 line-clamp-2 leading-tight min-h-[36px] md:min-h-[48px] flex items-center">
					{product.name}
				</h3>
				<p className="text-lg md:text-2xl font-semibold text-black tracking-wide">${product.price}</p>
			</div>

			<Button
				theme="dark"
				onClick={handleBuyNow}
				className="!w-full !rounded-lg !bg-black !text-white !text-xs md:!text-base font-medium"
			>
				Buy Now
			</Button>
		</div>
	);
};

export default ProductCard;
