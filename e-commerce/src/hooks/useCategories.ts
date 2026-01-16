import { useState, useEffect } from "react";
import { categoryService } from "~/services/category";
import { Category } from "~/types/category";

export const useCategories = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const fetchCategories = async () => {
		try {
			setIsLoading(true);
			const data = await categoryService.getCategories();
			setCategories(data);
		} catch (err: any) {
			console.error("Failed to load categories:", err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	return { categories, isLoading };
};
