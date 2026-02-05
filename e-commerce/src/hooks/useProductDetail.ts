import { useEffect, useState } from "react";
import { productService } from "~/services/product";
import { Product, ProductDetail } from "~/types/product";

export const useProductDetail = (productId: string) => {
	const [product, setProduct] = useState<ProductDetail | null>(null);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const fetchData = async () => {
		if (!productId) return;

		try {
			setIsLoading(true);

			const [productData, allProducts] = await Promise.all([
				productService.getById(productId),
				productService.getAll(),
			]);

			setProduct(productData);

			const related = allProducts
				.filter(p => Number(p.categoryId) === Number(productData.categoryId) && Number(p.id) !== Number(productId))
				.slice(0, 4);

			setRelatedProducts(related.length > 0 ? related : allProducts.slice(0, 4));
		} catch (error) {
			console.error("Failed to fetch product detail:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [productId]);

	return { product, relatedProducts, isLoading };
};
