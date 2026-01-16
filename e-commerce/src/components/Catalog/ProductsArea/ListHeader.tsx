"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Dropdown, { DropdownOption } from "~/components/atoms/Dropdown";
import { ListHeaderProps } from "~/types/catalog";

const SORT_OPTIONS: DropdownOption[] = [
	{ value: "rating", label: "By Rating" },
	{ value: "price_asc", label: "Price: Low to High" },
	{ value: "price_desc", label: "Price: High to Low" },
	{ value: "newest", label: "Newest" },
];

const ListHeader: React.FC<ListHeaderProps> = ({ count }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentSort = searchParams.get("sort") || "rating";

	const handleSortChange = (newValue: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("sort", newValue);
		router.push(`?${params.toString()}`, { scroll: false });
	};

	return (
		<div className="w-full h-[40px] flex justify-between items-center">
			<div className="text-sm text-gray-500 font-normal">
				Selected Products:
				<span className="ml-1 text-base font-bold text-gray-900">{count}</span>
			</div>
			<Dropdown value={currentSort} options={SORT_OPTIONS} onChange={handleSortChange} className="w-[200px]" />
		</div>
	);
};

export default ListHeader;
