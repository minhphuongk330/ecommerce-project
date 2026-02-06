"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { Product } from "~/types/product";

interface UseProductFilterOptions {
	itemsPerPage?: number;
}

const SYSTEM_PARAMS = ["page", "sort", "itemsPerPage"];

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

	const toggleFilter = (categoryId: string, itemValue: string) => {
		const currentParams = new URLSearchParams(searchParams.toString());
		const currentValues = currentParams.get(categoryId)?.split(",") || [];

		let newValues: string[];
		if (currentValues.includes(itemValue)) {
			newValues = currentValues.filter(v => v !== itemValue);
		} else {
			newValues = [...currentValues, itemValue];
		}

		if (newValues.length > 0) {
			currentParams.set(categoryId, newValues.join(","));
		} else {
			currentParams.delete(categoryId);
		}

		currentParams.delete("page");
		updateURL(currentParams);
	};

	const handleChangePage = (page: number) => {
		const currentParams = new URLSearchParams(searchParams.toString());
		if (page > 1) {
			currentParams.set("page", page.toString());
		} else {
			currentParams.delete("page");
		}
		updateURL(currentParams);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const { paginatedProducts, totalPages, totalCount } = useMemo(() => {
		let result = [...data];
		const activeCategories = Object.keys(selectedFilters);

		if (activeCategories.length > 0) {
			activeCategories.forEach(categoryId => {
				const selectedValues = selectedFilters[categoryId];
				if (selectedValues && selectedValues.length > 0) {
					result = result.filter(product => {
						const productAttr = (product as any)[categoryId];
						let productAttrValue = "";

						if (productAttr) {
							productAttrValue = String(productAttr);
						} else if (Array.isArray((product as any).attributes)) {
							const attr = (product as any).attributes.find(
								(a: any) => a.name?.toLowerCase() === categoryId.toLowerCase() || a.id?.toString() === categoryId,
							);
							if (attr) productAttrValue = String(attr.value);
						}

						if (!productAttrValue) {
							const productText = `${product.name} ${product.shortDescription || ""}`.toLowerCase();
							return selectedValues.some(val => productText.includes(val.toLowerCase()));
						}

						return selectedValues.some(val => productAttrValue.toLowerCase().trim() === val.toLowerCase().trim());
					});
				}
			});
		}

		const totalCount = result.length;
		const totalPages = Math.ceil(totalCount / itemsPerPage);

		const validPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
		const startIndex = (validPage - 1) * itemsPerPage;
		const paginatedProducts = result.slice(startIndex, startIndex + itemsPerPage);

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
