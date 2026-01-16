import { useState, useEffect, useMemo } from "react";
import { productService } from "~/services/product";
import { Product } from "~/types/product";

export const useProductTabs = (defaultTab: string) => {
	const [activeTab, setActiveTab] = useState<string>(defaultTab);
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const fetchProducts = async () => {
		try {
			setIsLoading(true);
			const data = await productService.getAll();
			setProducts(data);
		} catch (error) {
			console.error("Failed to fetch products for tabs:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const filteredProducts = useMemo(() => {
		if (!products.length) return [];

		const list = products.filter(p => p.collection === activeTab);
		return list.length > 0 ? list.slice(0, 8) : products.slice(0, 4);
	}, [activeTab, products]);

	return { activeTab, setActiveTab, filteredProducts, isLoading };
};
