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
		<div className="w-full min-h-[400px] md:min-h-[432px] h-full flex flex-col items-center bg-[#F6F6F6] rounded-[9px] p-4 md:p-6 text-center transition-all duration-300">
			<div className="w-full flex justify-end mb-3 md:mb-4">
				<FavoriteBtn productId={product.id} iconSize="medium" />
			</div>

			<div
				className="h-[140px] md:h-[160px] w-full flex justify-center items-center mb-3 md:mb-4 cursor-pointer"
				onClick={handleBuyNow}
			>
				<img
					src={product.mainImageUrl}
					alt={product.name}
					className="h-full w-auto object-contain max-w-full mix-blend-multiply"
				/>
			</div>

			<div className="flex-grow flex flex-col items-center w-full mb-3 md:mb-4">
				<h3 className="text-sm md:text-base font-medium text-black mb-2 line-clamp-2 leading-tight min-h-[40px] md:h-[48px] flex items-center">
					{product.name}
				</h3>
				<p className="text-xl md:text-2xl font-semibold text-black tracking-wide">${product.price}</p>
			</div>

			<Button
				theme="dark"
				onClick={handleBuyNow}
				className="!px-4 md:!px-5 !py-2.5 md:!py-3 !w-full !rounded-lg !bg-black !text-white !text-sm md:!text-base"
			>
				Buy Now
			</Button>
		</div>
	);
};

export default ProductCard;
