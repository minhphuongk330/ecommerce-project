"use client";
import React from "react";
import Link from "next/link";
import { useBrandProducts } from "~/hooks/useBrandProducts";
import ProductCard from "~/components/Products/Card";

interface BrandSectionProps {
	brandName: string;
	bannerImageUrl: string;
	bannerBg?: string;
	categoryId: number;
	viewAllHref?: string;
	limit?: number;
}

export type { BrandSectionProps };

const BrandSection: React.FC<BrandSectionProps> = ({
	brandName,
	bannerImageUrl,
	bannerBg = "#f5f5f5",
	categoryId,
	viewAllHref = "/products",
	limit = 8,
}) => {
	const { products, isLoading } = useBrandProducts(categoryId, limit);

	return (
		<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg md:text-xl font-bold text-gray-900">{brandName}</h2>
				<Link href={viewAllHref} className="text-sm text-red-600 font-medium hover:underline">
					XEM TẤT CẢ →
				</Link>
			</div>

			<div className="flex flex-col md:flex-row gap-4">
				{/* Banner */}
				<Link
					href={viewAllHref}
					className="flex-shrink-0 w-full md:w-[200px] rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 min-h-[180px]"
					style={{ backgroundColor: bannerBg }}
				>
					<img src={bannerImageUrl} alt={brandName} className="w-full max-w-[160px] object-contain" />
					<span className="mt-3 text-xs font-semibold text-gray-700 text-center">Chuyên trang {brandName}</span>
					<span className="mt-1 text-xs text-red-600 font-medium border border-red-600 px-3 py-0.5 rounded-full">
						XEM CHI TIẾT
					</span>
				</Link>

				{/* Products */}
				<div className="flex-1 overflow-hidden">
					{isLoading ? (
						<div className="flex gap-3">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="flex-shrink-0 w-[160px] md:w-[190px] h-[260px] bg-gray-100 animate-pulse rounded-lg" />
							))}
						</div>
					) : (
						<div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
							{products.map(product => (
								<div key={product.id} className="flex-shrink-0 w-[160px] md:w-[190px]">
									<ProductCard product={product} />
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default BrandSection;
