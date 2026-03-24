import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { productService } from "~/services/product";
import { Product } from "~/types/product";
import { productCache } from "~/utils/lruCache";

export const useProducts = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const searchParams = useSearchParams();
	const sort = searchParams.get("sort") || "newest";
	const categoryId = searchParams.get("categoryId");
	const name = searchParams.get("name");
	const page = searchParams.get("page") || "1";

	const fetchProducts = useCallback(async () => {
		try {
			setIsLoading(true);
			const params = {
				sort,
				categoryId: categoryId ? Number(categoryId) : undefined,
				name: name || undefined,
				page: Number(page),
				limit: 9,
			};

			const cacheKey = `products_${JSON.stringify(params)}`;
			const cached = productCache.get(cacheKey) as any;

			if (cached && cached.items) {
				setProducts(cached.items);
				setTotalCount(cached.total);
				setIsLoading(false);
				return;
			}

			const response: any = await productService.getAll(params);
			const data = Array.isArray(response) ? response : response?.items || [];
			const total = response?.total !== undefined ? response.total : data.length;
			productCache.set(cacheKey, { items: data, total });
			setProducts(data);
			setTotalCount(total);
		} catch (error) {
			console.error("Failed to fetch products:", error);
			setProducts([]);
			setTotalCount(0);
		} finally {
			setIsLoading(false);
		}
	}, [sort, categoryId, name, page]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	return { products, totalCount, isLoading };
};
