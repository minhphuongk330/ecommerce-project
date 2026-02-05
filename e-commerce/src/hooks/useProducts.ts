import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { productService } from "~/services/product";
import { Product } from "~/types/product";
import { productCache } from "~/utils/lruCache";

const SORTERS: Record<string, (a: Product, b: Product) => number> = {
	price_asc: (a, b) => Number(a.price) - Number(b.price),
	price_desc: (a, b) => Number(b.price) - Number(a.price),
	newest: (a, b) => Number(b.id) - Number(a.id),
	rating: (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0),
};

export const useProducts = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const searchParams = useSearchParams();
	const sort = searchParams.get("sort") || "";

	const fetchProducts = useCallback(async () => {
		try {
			setIsLoading(true);

			const cacheKey = `products_sort_${sort}`;
			const cached = productCache.get(cacheKey);
			if (cached) {
				setProducts(cached);
				setIsLoading(false);
				return;
			}

			let data = await productService.getAll({ sort });

			if (SORTERS[sort]) {
				data = [...data].sort(SORTERS[sort]);
			}

			productCache.set(cacheKey, data);
			setProducts(data);
		} catch (error) {
			console.error("Failed to fetch products:", error);
		} finally {
			setIsLoading(false);
		}
	}, [sort]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	return { products, isLoading };
};
