"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCategories } from "~/hooks/useCategories";
import { routerPaths } from "~/utils/router";
import Skeleton from "@mui/material/Skeleton";

const CategoryList: React.FC<{ showTitle?: boolean }> = ({ showTitle = false }) => {
	const router = useRouter();
	const { categories, isLoading } = useCategories();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2 w-full">
				<p className="text-sm font-semibold text-black mb-2">Categories</p>
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="flex items-center gap-3 py-2">
						<Skeleton variant="rounded" width={28} height={28} />
						<Skeleton width={100} height={16} />
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-1 w-full">
			{showTitle && <p className="text-sm font-semibold text-black mb-2">Categories</p>}
			{categories.map(category => (
				<button
					key={category.id}
					onClick={() => router.push(`${routerPaths.productDetail}?categoryId=${category.id}`)}
					className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-100 transition-colors text-left w-full group"
				>
					{category.thumbnailUrl && (
						<div className="relative w-7 h-7 flex-shrink-0">
							<Image src={category.thumbnailUrl} alt={category.name} fill sizes="28px" className="object-contain" />
						</div>
					)}
					<span className="text-sm text-gray-700 group-hover:text-black transition-colors">{category.name}</span>
				</button>
			))}
		</div>
	);
};

export default CategoryList;
