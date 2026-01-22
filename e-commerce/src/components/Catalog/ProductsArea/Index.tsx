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
}) => {
	return (
		<div className="flex-1 w-full">
			<div className="mb-4 md:mb-[24px]">
				<ListHeader count={totalCount} />
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-[16px] mb-6 md:mb-[40px]">
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
