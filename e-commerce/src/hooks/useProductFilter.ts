"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { Product } from "~/types/product";

interface UseProductFilterOptions {
	itemsPerPage?: number;
}

const SYSTEM_PARAMS = ["page", "sort", "itemsPerPage", "categoryId", "name", "minPrice", "maxPrice"];

export const useProductFilter = (
	data: Product[] = [],
	total: number,
	{ itemsPerPage = 9 }: UseProductFilterOptions = {},
) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const selectedFilters = useMemo(() => {
		const filters: Record<string, string[]> = {};
		searchParams.forEach((value, key) => {
			if (!SYSTEM_PARAMS.includes(key)) {
				filters[key] = value.split(",").filter(Boolean);
			}
		});
		return filters;
	}, [searchParams]);
	const currentPage = useMemo(() => {
		const page = searchParams.get("page");
		return page ? Math.max(1, parseInt(page, 10)) : 1;
	}, [searchParams]);

	const toggleFilter = (filterKey: string, itemValue: string) => {
		const currentParams = new URLSearchParams(searchParams.toString());
		const currentValues = currentParams.get(filterKey)?.split(",") || [];

		let newValues = currentValues.includes(itemValue)
			? currentValues.filter(v => v !== itemValue)
			: [...currentValues, itemValue];

		if (newValues.length > 0) currentParams.set(filterKey, newValues.join(","));
		else currentParams.delete(filterKey);

		currentParams.delete("page");
		router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
	};

	const handleChangePage = (page: number) => {
		const currentParams = new URLSearchParams(searchParams.toString());
		if (page > 1) currentParams.set("page", page.toString());
		else currentParams.delete("page");
		router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return {
		paginatedProducts: data,
		selectedFilters,
		toggleFilter,
		totalPages: Math.ceil(total / itemsPerPage),
		currentPage,
		handleChangePage,
		totalCount: total,
	};
};
