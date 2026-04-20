import { useEffect, useState } from "react";
import { productService } from "~/services/product";
import { Product } from "~/types/product";

const STALE_TIME = 5 * 60 * 1000;
let cache: Product[] = [];
let lastFetched = 0;
let fetchPromise: Promise<void> | null = null;

export const useDiscountProducts = () => {
	const [discountData, setDiscountData] = useState<Product[]>(cache);
	const [isLoadingProducts, setIsLoadingProducts] = useState(!cache.length);

	const fetchProducts = async (force = false) => {
		const now = Date.now();
		if (!force && cache.length && now - lastFetched < STALE_TIME) return;
		if (fetchPromise) return fetchPromise;

		fetchPromise = (async () => {
			try {
				setIsLoadingProducts(true);
				const response = await productService.getAll();
				const allProducts = Array.isArray(response) ? response : response?.items || [];
				cache = allProducts.slice(0, 4);
				lastFetched = Date.now();
				setDiscountData(cache);
			} catch (error) {
				console.error("Failed to fetch discount products:", error);
			} finally {
				setIsLoadingProducts(false);
				fetchPromise = null;
			}
		})();

		return fetchPromise;
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	return { discountData, isLoadingProducts, refetch: () => fetchProducts(true) };
};
