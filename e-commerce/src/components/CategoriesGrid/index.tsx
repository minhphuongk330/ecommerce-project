"use client";
import Link from "next/link";
import React from "react";
import { useCategories } from "~/hooks/useCategories";
import { Category } from "~/types/category";

const CategoriesGrid: React.FC = () => {
	const { categories, isLoading } = useCategories();

	if (isLoading) {
		return (
			<div className="w-full bg-white border-b border-gray-100">
				<div className="max-w-[1440px] mx-auto px-4 md:px-[160px] py-4">
					<div className="flex items-center justify-center flex-wrap gap-6 w-full">
						{Array.from({ length: 8 }).map((_, i) => (
							<div key={i} className="flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-gray-200">
								<div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
								<div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (categories.length === 0) return null;

	return (
		<div className="w-full bg-white border-b border-gray-100">
			<div className="flex items-center justify-center flex-wrap gap-8 w-full">
				<div className="flex items-center justify-center flex-wrap gap-8 w-full">
					{categories.slice(0, 8).map((category: Category) => (
						<Link
							key={category.id}
							href={`/products?categoryId=${category.id}`}
							className="flex items-center gap-2 py-2 cursor-pointer hover:-translate-y-0.5 transition-transform duration-200 group"
						>
							<div className="w-5 h-5 flex items-center justify-center">
								{category.thumbnailUrl ? (
									<img
										src={category.thumbnailUrl}
										alt={category.name}
										className="w-5 h-5 object-contain group-hover:opacity-80 transition-opacity"
									/>
								) : (
									<span className="text-[10px] text-white font-bold">
										{category.name.charAt(0).toUpperCase()}
									</span>
								)}
							</div>
							<span className="text-sm text-gray-700 group-hover:text-blue-600 font-medium whitespace-nowrap">
								{category.name}
							</span>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default CategoriesGrid;
