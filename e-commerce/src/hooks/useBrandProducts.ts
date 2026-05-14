import { useEffect, useState } from "react";
import { productService } from "~/services/product";
import { Product } from "~/types/product";

const cache: Record<number, Product[]> = {};

export const useBrandProducts = (categoryId: number, limit = 8) => {
	const [products, setProducts] = useState<Product[]>(cache[categoryId] ?? []);
	const [isLoading, setIsLoading] = useState(!cache[categoryId]);

	useEffect(() => {
		if (cache[categoryId]) {
			setProducts(cache[categoryId]);
			setIsLoading(false);
			return;
		}
		let cancelled = false;
		setIsLoading(true);
		productService
			.getAll({ categoryId, limit, sort: "newest" })
			.then(res => {
				if (cancelled) return;
				const items = Array.isArray(res) ? res : res?.items ?? [];
				cache[categoryId] = items;
				setProducts(items);
			})
			.catch(console.error)
			.finally(() => { if (!cancelled) setIsLoading(false); });
		return () => { cancelled = true; };
	}, [categoryId, limit]);

	return { products, isLoading };
};
