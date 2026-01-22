"use client";
import React, { useRef } from "react";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CategoryCard from "./Card";
import ArrowButton from "../atoms/ArrowButton";
import { useRouter } from "next/navigation";
import { routerPaths } from "~/utils/router";
import { useCategories } from "~/hooks/useCategories";

const CategoryBrowser: React.FC = () => {
	const router = useRouter();
	const { categories, isLoading } = useCategories();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const handleCategoryClick = (id: number) => {
		router.push(`${routerPaths.productDetail}?categoryId=${id}`);
	};

	return (
		<div className="flex flex-col w-full max-w-[1440px] mx-auto py-10 md:py-10 px-4 md:px-40 gap-4 md:gap-8">
			<div className="flex justify-between items-center w-full h-auto">
				<Typography variant="h5" className="!font-medium !text-xl md:!text-2xl !text-black !leading-8">
					Browse By Category
				</Typography>
				<ArrowButton scrollContainerRef={scrollContainerRef} />
			</div>

			{isLoading ? (
				<div className="flex justify-center w-full py-10">
					<CircularProgress color="inherit" />
				</div>
			) : (
				<div
					ref={scrollContainerRef}
					className="flex space-x-8 overflow-x-auto flex-nowrap pb-5 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
					style={{
						display: "flex",
						flexDirection: "row",
					}}
				>
					{categories?.length > 0 ? (
						categories.map(category => (
							<div
								key={category.id}
								onClick={() => handleCategoryClick(category.id)}
								className="cursor-pointer transition-transform hover:scale-105 flex-shrink-0"
							>
								<CategoryCard name={category.name} thumbnailUrl={category.thumbnailUrl} />
							</div>
						))
					) : (
						<div className="w-full text-center text-gray-500 py-4">No categories found.</div>
					)}
				</div>
			)}
		</div>
	);
};

export default CategoryBrowser;
