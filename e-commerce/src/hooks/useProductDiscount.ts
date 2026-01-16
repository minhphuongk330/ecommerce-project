import { useState, useEffect } from "react";
import { productService } from "~/services/product";
import { Product } from "~/types/product";

export const useDiscountProducts = () => {
	const [discountData, setDiscountData] = useState<Product[]>([]);
	const [isLoadingProducts, setIsLoadingProducts] = useState(true);

	const fetchProducts = async () => {
		try {
			setIsLoadingProducts(true);
			const allProducts = await productService.getAll();
			setDiscountData(allProducts.slice(0, 4));
		} catch (error) {
			console.error("Failed to fetch discount products:", error);
		} finally {
			setIsLoadingProducts(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	return { discountData, isLoadingProducts };
};
