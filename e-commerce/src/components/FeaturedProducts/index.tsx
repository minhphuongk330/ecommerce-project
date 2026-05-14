"use client";

import React from "react";

import Link from "next/link";

import ProductCard from "~/components/Products/Card";

import { ProductGridSkeleton } from "~/components/Skeletons";

import { useProductTabs } from "~/hooks/useProductTabs";



interface FeaturedProductsProps {

	title: string;

	collection: "New Arrival" | "Bestseller" | "Featured Products";

	viewAllHref?: string;

	limit?: number;

}



const FeaturedProducts: React.FC<FeaturedProductsProps> = ({

	title,

	collection,

	viewAllHref = "/products",

	limit = 8,

}) => {

	const { filteredProducts, isLoading } = useProductTabs(collection);

	const displayProducts = filteredProducts.slice(0, limit);



	return (

		<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8">

			{/* Header */}

			<div className="flex items-center justify-between mb-6">

				<div className="flex items-center gap-3">

					<div className="w-1 h-6 bg-red-600 rounded-full" />

					<h2 className="text-lg md:text-xl font-bold text-gray-900">{title}</h2>

				</div>

				<Link

					href={viewAllHref}

					className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1"

				>

					Xem tất cả

					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />

					</svg>

				</Link>

			</div>



			{isLoading ? (

				<ProductGridSkeleton count={4} />

			) : displayProducts.length === 0 ? (

				<p className="text-gray-400 text-sm py-4">Chưa có sản phẩm.</p>

			) : (

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

					{displayProducts.map((product) => (

						<ProductCard key={product.id} product={product} />

					))}

				</div>

			)}

		</div>

	);

};



export default FeaturedProducts;

