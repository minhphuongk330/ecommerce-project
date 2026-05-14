"use client";
import Link from "next/link";
import React from "react";
import ProductCard from "~/components/Products/Card";
import { ProductGridSkeleton } from "~/components/Skeletons";
import { useBestSellers } from "~/hooks/useBestSellers";

const BestSellers: React.FC = () => {
	const { products, isLoading, error } = useBestSellers(8); // Lấy sản phẩm bán chạy nhiều nhất

	// Debug: Log data để kiểm tra
	React.useEffect(() => {
		console.log("Best sellers data:", { products, isLoading, error });
		if (products.length > 0) {
			console.log("First product structure:", products[0]);
			console.log("Products soldCount:", products.map(p => ({ id: p.id, name: p.name, soldCount: (p as any).soldCount })));
		}
	}, [products, isLoading, error]);

	if (isLoading) {
		return (
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-1 h-6 bg-red-600 rounded-full" />
						<h2 className="text-lg md:text-xl font-bold text-gray-900">Gợi ý cho bạn</h2>
					</div>
				</div>
				<ProductGridSkeleton count={8} />
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8">
				<div className="text-center py-8">
					<p className="text-gray-500">{error}</p>
				</div>
			</div>
		);
	}

	if (products.length === 0) {
		return (
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8">
				<div className="text-center py-8">
					<p className="text-gray-400 text-sm">Chưa có sản phẩm bán chạy.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<div className="w-1 h-6 bg-red-600 rounded-full" />
					<h2 className="text-lg md:text-xl font-bold text-gray-900">Gợi ý cho bạn</h2>
					<span className="text-sm text-gray-500">(Sản phẩm bán chạy)</span>
				</div>
				<Link
					href="/products?sort=soldCount&order=desc"
					className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1"
				>
					Xem tất cả
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</Link>
			</div>

			{/* Products Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
};

export default BestSellers;
