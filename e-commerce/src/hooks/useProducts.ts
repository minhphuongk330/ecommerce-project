import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { productService } from "~/services/product";
import { Product } from "~/types/product";
import { productCache } from "~/utils/lruCache";

const SYSTEM_PARAMS = ["page", "sort", "itemsPerPage", "categoryId", "name", "minPrice", "maxPrice"];

export const useProducts = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const searchParams = useSearchParams();
	const searchParamsString = searchParams.toString();

	useEffect(() => {
		const sort = searchParams.get("sort") || "newest";
		const categoryId = searchParams.get("categoryId");
		const name = searchParams.get("name");
		const page = searchParams.get("page") || "1";
		const minPrice = searchParams.get("minPrice");
		const maxPrice = searchParams.get("maxPrice");
		const attributeFilters: Record<string, string> = {};
		searchParams.forEach((value, key) => {
			if (!SYSTEM_PARAMS.includes(key)) {
				attributeFilters[key] = value;
			}
		});

		const fetchProducts = async () => {
			try {
				setIsLoading(true);
				const params = {
					sort,
					categoryId: categoryId ? Number(categoryId) : undefined,
					name: name || undefined,
					page: Number(page),
					limit: 9,
					minPrice: minPrice ? Number(minPrice) : undefined,
					maxPrice: maxPrice ? Number(maxPrice) : undefined,
					...attributeFilters,
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
		};

		fetchProducts();
	}, [searchParamsString]);

	return { products, totalCount, isLoading };
};
