"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "~/types/product";

interface UseProductFilterOptions {
	itemsPerPage?: number;
}

const parseFiltersFromURL = (searchParams: URLSearchParams): Record<string, string[]> => {
	const filters: Record<string, string[]> = {};
	searchParams.forEach((value, key) => {
		if (key.startsWith("filter_")) {
			const categoryId = key.replace("filter_", "");
			filters[categoryId] = value.split(",").filter(Boolean);
		}
	});
	return filters;
};

const parsePageFromURL = (searchParams: URLSearchParams): number => {
	const page = searchParams.get("page");
	return page ? Math.max(1, parseInt(page, 10)) : 1;
};

export const useProductFilter = (data: Product[], { itemsPerPage = 9 }: UseProductFilterOptions = {}) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const isUpdatingRef = useRef(false);

	const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() =>
		parseFiltersFromURL(searchParams)
	);
	const [currentPage, setCurrentPage] = useState(() => parsePageFromURL(searchParams));

	const updateURL = (filters: Record<string, string[]>, page: number) => {
		isUpdatingRef.current = true;
		const params = new URLSearchParams(searchParams.toString());
		params.forEach((_, key) => {
			if (key.startsWith("filter_")) {
				params.delete(key);
			}
		});
		Object.entries(filters).forEach(([categoryId, values]) => {
			if (values.length > 0) {
				params.set(`filter_${categoryId}`, values.join(","));
			}
		});
		if (page > 1) {
			params.set("page", page.toString());
		} else {
			params.delete("page");
		}
		router.push(`?${params.toString()}`, { scroll: false });
		setTimeout(() => {
			isUpdatingRef.current = false;
		}, 100);
	};

	const toggleFilter = (categoryId: string, itemValue: string) => {
		setSelectedFilters(prev => {
			const currentList = prev[categoryId] || [];
			const isSelected = currentList.includes(itemValue);
			const newList = isSelected ? currentList.filter(item => item !== itemValue) : [...currentList, itemValue];
			let newFilters: Record<string, string[]>;
			if (newList.length === 0) {
				const { [categoryId]: _, ...rest } = prev;
				newFilters = rest;
			} else {
				newFilters = { ...prev, [categoryId]: newList };
			}
			updateURL(newFilters, 1);

			return newFilters;
		});
		setCurrentPage(1);
	};

	const { paginatedProducts, totalPages, totalCount } = useMemo(() => {
		let result = data;
		const activeCategories = Object.keys(selectedFilters);
		if (activeCategories.length > 0) {
			activeCategories.forEach(categoryId => {
				const selectedValues = selectedFilters[categoryId];
				if (selectedValues && selectedValues.length > 0) {
					result = result.filter(product => {
						const productText = `${product.name} ${product.shortDescription || ""}`.toLowerCase();
						return selectedValues.some(val => productText.includes(val.toLowerCase()));
					});
				}
			});
		}
		const totalCount = result.length;
		const totalPages = Math.ceil(totalCount / itemsPerPage);
		const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
		const startIndex = (validCurrentPage - 1) * itemsPerPage;
		const safeStartIndex = startIndex >= 0 ? startIndex : 0;
		const paginatedProducts = result.slice(safeStartIndex, safeStartIndex + itemsPerPage);
		return { paginatedProducts, totalPages, totalCount };
	}, [selectedFilters, currentPage, data, itemsPerPage]);

	const handleChangePage = (page: number) => {
		setCurrentPage(page);
		updateURL(selectedFilters, page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	useEffect(() => {
		if (isUpdatingRef.current) return;
		const urlFilters = parseFiltersFromURL(searchParams);
		const urlPage = parsePageFromURL(searchParams);
		const filtersChanged = JSON.stringify(urlFilters) !== JSON.stringify(selectedFilters);
		const pageChanged = urlPage !== currentPage;
		if (filtersChanged) {
			setSelectedFilters(urlFilters);
		}
		if (pageChanged) {
			setCurrentPage(urlPage);
		}
	}, [searchParams]);

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
