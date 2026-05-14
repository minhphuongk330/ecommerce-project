"use client";
import React, { useState } from "react";
import Link from "next/link";
import ProductCard from "~/components/Products/Card";
import { ProductGridSkeleton } from "~/components/Skeletons";
import { useBrandProducts } from "~/hooks/useBrandProducts";

interface Category {
	id: number;
	name: string;
	thumbnailUrl?: string;
}

interface CategoryProductSectionProps {
	categories: Category[];
}

const CategoryTab: React.FC<{
	category: Category;
	isActive: boolean;
	onClick: () => void;
}> = ({ category, isActive, onClick }) => (
	<button
		onClick={onClick}
		className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
			isActive
				? "bg-red-600 text-white shadow-sm"
				: "bg-gray-100 text-gray-600 hover:bg-gray-200"
		}`}
	>
		{category.thumbnailUrl && (
			<img src={category.thumbnailUrl} alt={category.name} className="w-4 h-4 object-contain" />
		)}
		{category.name}
	</button>
);

const ProductGrid: React.FC<{ categoryId: number; viewAllHref: string }> = ({
	categoryId,
	viewAllHref,
}) => {
	const { products, isLoading } = useBrandProducts(categoryId, 8);

	if (isLoading) return <ProductGridSkeleton count={4} />;

	if (products.length === 0) {
		return (
			<div className="py-12 text-center text-gray-400 text-sm">
				Chưa có sản phẩm trong danh mục này.
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
			<div className="flex justify-center mt-6">
				<Link
					href={viewAllHref}
					className="px-8 py-2.5 border-2 border-gray-200 text-gray-600 hover:border-red-600 hover:text-red-600 rounded-full text-sm font-medium transition-colors"
				>
					Xem tất cả →
				</Link>
			</div>
		</>
	);
};

const CategoryProductSection: React.FC<CategoryProductSectionProps> = ({ categories }) => {
	const [activeId, setActiveId] = useState(categories[0]?.id ?? 0);

	if (categories.length === 0) return null;

	const activeCategory = categories.find((c) => c.id === activeId) ?? categories[0];

	return (
		<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-5">
				<div className="flex items-center gap-3">
					<div className="w-1 h-6 bg-red-600 rounded-full" />
					<h2 className="text-lg md:text-xl font-bold text-gray-900">Sản phẩm theo danh mục</h2>
				</div>
			</div>

			{/* Category tabs */}
			<div className="flex gap-2 overflow-x-auto pb-3 mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
				{categories.map((cat) => (
					<CategoryTab
						key={cat.id}
						category={cat}
						isActive={cat.id === activeId}
						onClick={() => setActiveId(cat.id)}
					/>
				))}
			</div>

			{/* Products */}
			<ProductGrid
				categoryId={activeId}
				viewAllHref={`/products?categoryId=${activeId}`}
			/>
		</div>
	);
};

export default CategoryProductSection;
