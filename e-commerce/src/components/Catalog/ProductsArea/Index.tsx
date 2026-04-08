"use client";
import React from "react";
import ListHeader from "./ListHeader";
import Pagination from "../../atoms/Pagination";
import ProductCard from "~/components/Products/Card";
import { ProductListAreaProps } from "~/types/component";

const ProductListArea: React.FC<ProductListAreaProps> = ({
	products,
	totalCount,
	currentPage,
	totalPages,
	onPageChange,
	isLoading,
}) => {
	return (
		<div className="flex-1 w-full relative">
			{isLoading && (
				<div className="absolute inset-0 bg-white/60 z-10 flex items-start justify-center pt-20">
					<div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
				</div>
			)}
			<div className="mb-4 md:mb-[24px]">
				<ListHeader count={totalCount} />
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-[16px] mb-4 md:mb-[40px]">
				{products.map((product, index) => (
					<div key={`${product.id}-${index}`} className="w-full">
						<ProductCard product={product} />
					</div>
				))}
			</div>

			<div className="w-full">
				<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
			</div>
		</div>
	);
};

export default ProductListArea;
