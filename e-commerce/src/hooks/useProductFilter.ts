"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { Product } from "~/types/product";

interface UseProductFilterOptions {
	itemsPerPage?: number;
}

const SYSTEM_PARAMS = ["page", "sort", "itemsPerPage", "categoryId", "name"];

export const useProductFilter = (data: Product[] = [], { itemsPerPage = 9 }: UseProductFilterOptions = {}) => {
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

	const updateURL = (newParams: URLSearchParams) => {
		router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
	};

	const toggleFilter = (filterKey: string, itemValue: string) => {
		const currentParams = new URLSearchParams(searchParams.toString());
		const currentValues = currentParams.get(filterKey)?.split(",") || [];

		let newValues: string[];
		if (currentValues.includes(itemValue)) {
			newValues = currentValues.filter(v => v !== itemValue);
		} else {
			newValues = [...currentValues, itemValue];
		}

		if (newValues.length > 0) {
			currentParams.set(filterKey, newValues.join(","));
		} else {
			currentParams.delete(filterKey);
		}
		currentParams.delete("page");
		updateURL(currentParams);
	};

	const handleChangePage = (page: number) => {
		const currentParams = new URLSearchParams(searchParams.toString());
		if (page > 1) currentParams.set("page", page.toString());
		else currentParams.delete("page");
		updateURL(currentParams);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const { paginatedProducts, totalPages, totalCount } = useMemo(() => {
		let result = [...data];
		const activeFilterKeys = Object.keys(selectedFilters);

		if (activeFilterKeys.length > 0) {
			activeFilterKeys.forEach(filterKey => {
				const requiredValues = selectedFilters[filterKey];

				if (requiredValues && requiredValues.length > 0) {
					result = result.filter(product => {
						if (!product.attributes || typeof product.attributes !== "object") {
							return false;
						}

						const attributeKeyInProduct = Object.keys(product.attributes).find(
							k => k.toLowerCase() === filterKey.toLowerCase(),
						);
						if (!attributeKeyInProduct) return false;
						const productAttributeValue = product.attributes[attributeKeyInProduct];
						return requiredValues.some(val => productAttributeValue.toLowerCase().includes(val.toLowerCase()));
					});
				}
			});
		}

		const totalCount = result.length;
		const totalPages = Math.ceil(totalCount / itemsPerPage);
		const validPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
		const startIndex = (validPage - 1) * itemsPerPage;
		const paginatedProducts = totalCount > 0 ? result.slice(startIndex, startIndex + itemsPerPage) : [];

		return { paginatedProducts, totalPages, totalCount };
	}, [selectedFilters, currentPage, data, itemsPerPage]);

	return {
		paginatedProducts,
		selectedFilters,
		toggleFilter,
		totalPages,
		currentPage,
		handleChangePage,
		totalCount,
	};
};
