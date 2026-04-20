"use client";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useCategories } from "~/hooks/useCategories";
import { routerPaths } from "~/utils/router";
import ArrowButton from "../atoms/ArrowButton";
import CategoryCard from "./Card";

const CategoryBrowser = () => {
	const router = useRouter();
	const { categories, isLoading } = useCategories();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	return (
		<div className="flex flex-col w-full max-w-[1440px] mx-auto pt-8 px-4 md:px-[160px] gap-4 md:gap-8">
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
					className="flex flex-row space-x-4 md:space-x-8 overflow-x-auto flex-nowrap pb-5 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
				>
					{categories?.length > 0 ? (
						categories.map(category => (
							<div
								key={category.id}
								onClick={() => router.push(`${routerPaths.productDetail}?categoryId=${category.id}`)}
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
