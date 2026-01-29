"use client";
import FilterListIcon from "@mui/icons-material/FilterList";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useMobileFilter } from "~/contexts/MobileFilterContext";
import { ListHeaderProps } from "~/types/catalog";

const SORT_OPTIONS = [
	{ value: "newest", label: "Newest" },
	{ value: "rating", label: "Rating" },
];

const ListHeader: React.FC<ListHeaderProps> = ({ count }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentSort = searchParams.get("sort") || null;

	const currentPrice =
		searchParams.get("sort") === "price_asc" || searchParams.get("sort") === "price_desc"
			? searchParams.get("sort")
			: null;

	const mobileContext = useMobileFilter();

	const handleSortChange = (newValue: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("sort", newValue);
		router.push(`?${params.toString()}`, { scroll: false });
	};

	const handlePriceToggle = () => {
		const params = new URLSearchParams(searchParams.toString());
		if (!currentPrice) {
			params.set("sort", "price_asc");
		} else if (currentPrice === "price_asc") {
			params.set("sort", "price_desc");
		} else {
			params.delete("sort");
		}
		router.push(`?${params.toString()}`, { scroll: false });
	};

	const renderPriceIcon = () => (
		<div className="flex flex-col">
			{!currentPrice && <UnfoldMoreIcon sx={{ fontSize: 16 }} className="opacity-50" />}
			{currentPrice === "price_asc" && <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />}
			{currentPrice === "price_desc" && <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
		</div>
	);

	return (
		<div className="w-full relative z-20 mb-4">
			<div className="md:hidden w-full bg-white border-b border-t border-gray-200 sticky top-0">
				<div className="flex items-center h-12 text-sm text-gray-700 divide-x divide-gray-200">
					{SORT_OPTIONS.map(option => {
						const isActive = currentSort === option.value;
						return (
							<button
								key={option.value}
								onClick={() => handleSortChange(option.value)}
								className={`flex-1 h-full px-2 font-medium transition-colors ${
									isActive ? "text-red-500 font-bold bg-gray-50" : "text-gray-600 hover:bg-gray-50"
								}`}
							>
								{option.label}
							</button>
						);
					})}

					<button
						onClick={handlePriceToggle}
						className={`flex-1 h-full px-2 font-medium flex items-center justify-center gap-1 transition-colors ${
							currentPrice ? "text-red-500 font-bold bg-gray-50" : "text-gray-600 hover:bg-gray-50"
						}`}
					>
						<span>Price</span>
						{renderPriceIcon()}
					</button>

					<button
						onClick={() => mobileContext?.setIsMobileDrawerOpen(true)}
						className="w-[80px] h-full flex items-center justify-center gap-1 text-gray-600 hover:bg-gray-50 hover:text-black font-medium"
					>
						<span>Filter</span>
						<FilterListIcon sx={{ fontSize: 18 }} />
					</button>
				</div>
			</div>

			<div className="hidden md:flex items-center w-full min-h-[40px] gap-4">
				<span className="text-sm text-gray-600 font-medium whitespace-nowrap shrink-0">Sort by</span>

				<div className="grid grid-cols-3 gap-3 flex-1">
					{SORT_OPTIONS.map(option => (
						<button
							key={option.value}
							onClick={() => handleSortChange(option.value)}
							className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
								currentSort === option.value
									? "bg-black text-white border-black"
									: "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
							}`}
						>
							{option.label}
						</button>
					))}

					<button
						onClick={handlePriceToggle}
						className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 border ${
							currentPrice
								? "bg-teal-500 text-white border-teal-500"
								: "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
						}`}
					>
						<span>Price</span>
						{renderPriceIcon()}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ListHeader;
