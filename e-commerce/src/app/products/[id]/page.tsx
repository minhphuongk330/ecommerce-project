"use client";
import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import MainInfo from "~/components/Products/DetailPage/MainInfo";
import DetailsSection from "~/components/Products/DetailPage/DetailsSection";
import SectionProductList from "~/components/Products/SectionProductList";
import { useBreadcrumb } from "~/contexts/BreadcrumbContext";
import { routerPaths } from "~/utils/router";
import { ProductDetailUI } from "~/types/component";
import { useProductDetail } from "~/hooks/useProductDetail";
import ProductReviews from "~/components/Products/DetailPage/Reviews/Index";

export default function ProductDetailsPage() {
	const params = useParams();
	const productId = params?.id as string;
	const { setBreadcrumbs } = useBreadcrumb();
	const { product, relatedProducts, isLoading } = useProductDetail(productId);

	useEffect(() => {
		if (product) {
			const categoryId = product.categoryId;
			const categoryName = product.category?.name || "Sản phẩm";

			setBreadcrumbs([
				{ label: "Home", href: routerPaths.index },
				{ label: categoryName, href: `${routerPaths.productDetail}?categoryId=${categoryId}` },
				{ label: product.name, href: "#" },
			]);
		}
	}, [product, setBreadcrumbs]);

	const uiProduct: ProductDetailUI | null = useMemo(() => {
		if (!product) return null;

		const rawImages = product.productImages || [];
		const rawColors = product.productColors || [];

		return {
			...product,
			images: rawImages.map(img => img.url),
			colors: rawColors.map(col => ({
				id: col.id,
				name: col.colorName,
				hex: col.colorHex || "#000000",
			})),
			capacities: product.capacities || [],
			specs: product.specs,
		};
	}, [product]);

	if (isLoading) {
		return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
	}

	if (!product || !uiProduct) {
		return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
	}

	return (
		<div className="w-full bg-white min-h-screen flex flex-col items-center px-4 md:px-0">
			<MainInfo product={uiProduct} />

			<DetailsSection product={product} />

			<ProductReviews productId={Number(product.id)} />

			<SectionProductList title="Related Products" products={relatedProducts} />
		</div>
	);
}
