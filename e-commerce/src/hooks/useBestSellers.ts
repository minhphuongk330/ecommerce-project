import { useCallback, useEffect, useState } from "react";
import { productService } from "~/services/product";
import { Product } from "~/types/product";

export const useBestSellers = (limit: number = 8) => {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchBestSellers = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);


			const data = await productService.getBestSellers(limit);
			setProducts(data);
		} catch (err) {
			console.error("Error fetching best sellers:", err);
			setError("Không thể tải sản phẩm bán chạy");
		} finally {
			setIsLoading(false);
		}
	}, [limit]);

	useEffect(() => {
		fetchBestSellers();
	}, [fetchBestSellers]);

	return {
		products,
		isLoading,
		error,
		refetch: fetchBestSellers,
	};
};
