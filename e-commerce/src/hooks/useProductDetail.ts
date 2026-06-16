import { useEffect, useState, useCallback } from "react";
import { productService } from "~/services/product";
import { flashSaleService } from "~/services/flashSale";
import { Product, ProductDetail } from "~/types/product";

export const useProductDetail = (productId: string) => {
	const [product, setProduct] = useState<ProductDetail | null>(null);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const fetchData = useCallback(async () => {
		if (!productId) return;

		try {
			setIsLoading(true);
			const [productData, productResponse, flashSaleData] = await Promise.all([
				productService.getById(productId),
				productService.getAll(),
				flashSaleService.getActive(),
			]);

			const flashSaleItem = flashSaleData?.items?.find(
				(item) => String(item.productId) === String(productId)
			);

			if (flashSaleItem) {
				const isSaleAvailable = flashSaleItem.soldQuantity < flashSaleItem.quantity;
				(productData as any).isFlashSale = isSaleAvailable;
				(productData as any).flashSalePrice = Number(flashSaleItem.salePrice);
				(productData as any).flashSaleOriginalPrice = Number(flashSaleItem.originalPrice);
			}

			setProduct(productData);
			const allProducts = productResponse.items;
			const related = allProducts
				.filter(p => Number(p.categoryId) === Number(productData.categoryId) && Number(p.id) !== Number(productId))
				.slice(0, 4);
			setRelatedProducts(related.length > 0 ? related : allProducts.slice(0, 4));
		} catch (error) {
			console.error("Failed to fetch product detail:", error);
		} finally {
			setIsLoading(false);
		}
	}, [productId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { product, relatedProducts, isLoading, refetch: fetchData };
};
