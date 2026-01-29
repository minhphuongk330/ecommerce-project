"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "~/types/product";

interface UseProductFilterOptions {
	itemsPerPage?: number;
}

const SYSTEM_PARAMS = ["page", "sort", "categoryId", "name", "itemsPerPage"];

const parseFiltersFromURL = (searchParams: URLSearchParams): Record<string, string[]> => {
	const filters: Record<string, string[]> = {};
	searchParams.forEach((value, key) => {
		if (!SYSTEM_PARAMS.includes(key)) {
			filters[key] = value.split(",").filter(Boolean);
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
		parseFiltersFromURL(searchParams),
	);
	const [currentPage, setCurrentPage] = useState(() => parsePageFromURL(searchParams));

	const updateURL = (filters: Record<string, string[]>, page: number) => {
		isUpdatingRef.current = true;
		const params = new URLSearchParams(searchParams.toString());

		const currentKeys = Array.from(params.keys());
		currentKeys.forEach(key => {
			if (!SYSTEM_PARAMS.includes(key)) {
				params.delete(key);
			}
		});

		Object.entries(filters).forEach(([categoryId, values]) => {
			if (values.length > 0) {
				params.set(categoryId, values.join(","));
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
		let result = data || [];
		const activeCategories = Object.keys(selectedFilters);

		if (activeCategories.length > 0) {
			activeCategories.forEach(categoryId => {
				const selectedValues = selectedFilters[categoryId];
				if (selectedValues && selectedValues.length > 0) {
					result = result.filter(product => {
						let productAttrValue = "";

						if ((product as any)[categoryId]) {
							productAttrValue = String((product as any)[categoryId]);
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
		if (totalPages > 0 && currentPage > totalPages) {
			setCurrentPage(1);
			setTimeout(() => updateURL(selectedFilters, 1), 0);
		}
	}, [totalPages, currentPage, selectedFilters]);

	useEffect(() => {
		if (isUpdatingRef.current) return;

		const urlFilters = parseFiltersFromURL(searchParams);
		const urlPage = parsePageFromURL(searchParams);

		if (JSON.stringify(urlFilters) !== JSON.stringify(selectedFilters)) {
			setSelectedFilters(urlFilters);
		}
		if (urlPage !== currentPage) {
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
