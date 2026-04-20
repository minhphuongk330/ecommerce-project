import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { productService, ProductResponse, PRODUCT_SYSTEM_PARAMS } from "~/services/product";
import { Product } from "~/types/product";
import { productCache } from "~/utils/lruCache";

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
			if (!PRODUCT_SYSTEM_PARAMS.includes(key)) {
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
				const cached = productCache.get(cacheKey) as ProductResponse | undefined;

				if (cached && cached.items) {
					setProducts(cached.items);
					setTotalCount(cached.total);
					setIsLoading(false);
					return;
				}

				const response = await productService.getAll(params);
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
