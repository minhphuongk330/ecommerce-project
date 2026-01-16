import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { productService } from "~/services/product";
import { Product } from "~/types/product";

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

	const fetchProducts = async () => {
		try {
			setIsLoading(true);
			const data = await productService.getAll({ sort });
			if (SORTERS[sort]) {
				data.sort(SORTERS[sort]);
			}
			setProducts(data);
		} catch (error) {
			console.error("Failed to fetch products:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, [sort]);

	return { products, isLoading };
};
