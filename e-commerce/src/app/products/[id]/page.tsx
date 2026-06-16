"use client";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import DetailsSection from "~/components/Products/DetailPage/DetailsSection";
import MainInfo, { COLOR_MAP } from "~/components/Products/DetailPage/MainInfo";
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

		const images: string[] = [];
		if (product.mainImageUrl) images.push(product.mainImageUrl);
		if (product.extraImage1) images.push(product.extraImage1);
		if (product.extraImage2) images.push(product.extraImage2);
		if (product.extraImage3) images.push(product.extraImage3);
		if (product.extraImage4) images.push(product.extraImage4);

		const colorHexMap = product.specifications?.colorHex || {};
		const colors = product.color
			? product.color.split(",").map((c, idx) => {
				const trimmed = c.trim();
				return {
					id: idx + 1,
					name: trimmed,
					hex: colorHexMap[trimmed] || COLOR_MAP[trimmed] || "#CCCCCC",
				};
			})
			: [];
		return {
			...product,
			images,
			colors,
			specs: product.specifications || {},
		};
	}, [product]);

	if (isLoading) {
		return (
			<div className="w-full bg-white min-h-screen flex flex-col items-center font-sans">
				<ProductDetailSkeleton />
			</div>
		);
	}

	if (!product || !uiProduct) {
		return <div className="min-h-screen flex items-center justify-center font-sans">Không tìm thấy sản phẩm</div>;
	}

	return (
		<div className="w-full bg-white min-h-screen flex flex-col items-center pt-8 md:px-0 pb-8 font-sans">
			<MainInfo product={uiProduct} />
			<DetailsSection product={product} />
			<ProductReviews productId={product.id} />
			<SectionProductList title="Sản phẩm tương tự" products={relatedProducts} />
		</div>
	);
}
