import { useState, useMemo } from "react";
import { Product } from "~/types/product";

interface UseProductFilterOptions {
	itemsPerPage?: number;
}

export const useProductFilter = (data: Product[], { itemsPerPage = 9 }: UseProductFilterOptions = {}) => {
	const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
	const [currentPage, setCurrentPage] = useState(1);

	const toggleFilter = (categoryId: string, itemValue: string) => {
		setSelectedFilters(prev => {
			const currentList = prev[categoryId] || [];
			const isSelected = currentList.includes(itemValue);

			const newList = isSelected ? currentList.filter(item => item !== itemValue) : [...currentList, itemValue];

			if (newList.length === 0) {
				const { [categoryId]: _, ...rest } = prev;
				return rest;
			}
			return { ...prev, [categoryId]: newList };
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
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

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
