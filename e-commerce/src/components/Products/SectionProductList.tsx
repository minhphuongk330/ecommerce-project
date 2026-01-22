"use client";
import React from "react";
import ProductCard from "~/components/Products/Card";
import { SectionProductListProps } from "~/types/component";

const SectionProductList: React.FC<SectionProductListProps> = ({
	title,
	products,
	className = "py-10 md:py-[20px]",
}) => {
	return (
		<div className={`w-full bg-white ${className}`}>
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px]">
				<div className="mb-6 md:mb-[32px]">
					<h2 className="text-xl md:text-[24px] font-medium text-black">{title}</h2>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[16px] w-full">
					{products.map(product => (
						<div key={product.id} className="h-full">
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SectionProductList;
