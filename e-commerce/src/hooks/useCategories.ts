import { useCallback, useEffect, useState } from "react";
import { categoryService } from "~/services/category";
import { Category } from "~/types/category";
import { categoryCache } from "~/utils/lruCache";

export const useCategories = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const fetchCategories = useCallback(async () => {
		try {
			setIsLoading(true);
			const cached = categoryCache.get("categories");
			if (cached) {
				setCategories(cached);
				setIsLoading(false);
				return;
			}

			const data = await categoryService.getCategories();

			categoryCache.set("categories", data);
			setCategories(data);
		} catch (err: any) {
			console.error("Failed to load categories:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	return { categories, isLoading };
};
