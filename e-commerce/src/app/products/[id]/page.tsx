"use client";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import DetailsSection from "~/components/Products/DetailPage/DetailsSection";
import MainInfo from "~/components/Products/DetailPage/MainInfo";
import ProductReviews from "~/components/Products/DetailPage/Reviews/Index";
import SectionProductList from "~/components/Products/SectionProductList";
import { ProductDetailSkeleton } from "~/components/Skeletons";
import { useBreadcrumb } from "~/contexts/BreadcrumbContext";
import { useProductDetail } from "~/hooks/useProductDetail";
import { ProductDetailUI } from "~/types/component";
import { routerPaths } from "~/utils/router";

export default function ProductDetailsPage() {
	const params = useParams();
	const productId = params?.id as string;
	const { setBreadcrumbs } = useBreadcrumb();
	const { product, relatedProducts, isLoading } = useProductDetail(productId);

	useEffect(() => {
		if (product) {
			const categoryId = product.category?.id;
			const categoryName = product.category?.name || "Products";

			setBreadcrumbs([
				{ label: "Home", href: routerPaths.index },
				{ label: categoryName, href: `/products?categoryId=${categoryId}` },
				{ label: product.name, href: "#" },
			]);
		}
	}, [product, setBreadcrumbs]);

	const uiProduct: ProductDetailUI | null = useMemo(() => {
		if (!product) return null;

		// Build images array from mainImageUrl and extra images
		const images: string[] = [];
		if (product.mainImageUrl) images.push(product.mainImageUrl);
		if (product.extraImage1) images.push(product.extraImage1);
		if (product.extraImage2) images.push(product.extraImage2);
		if (product.extraImage3) images.push(product.extraImage3);
		if (product.extraImage4) images.push(product.extraImage4);

		// Build colors array from single color string
		const colors = product.color ? [{ id: 1, name: product.color, hex: "#000000" }] : [];

		return {
			...product,
			images,
			colors,
			specs: product.specifications || {},
		};
	}, [product]);

	if (isLoading) {
		return (
			<div className="w-full bg-white min-h-screen flex flex-col items-center">
				<ProductDetailSkeleton />
			</div>
		);
	}

	if (!product || !uiProduct) {
		return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
	}

	return (
		<div className="w-full bg-white min-h-screen flex flex-col items-center pt-8 md:px-0 pb-8">
			<MainInfo product={uiProduct} />
			<DetailsSection product={product} />
			<ProductReviews productId={product.id} />
			<SectionProductList title="Related Products" products={relatedProducts} />
		</div>
	);
}
