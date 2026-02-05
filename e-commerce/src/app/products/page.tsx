"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import Filters from "~/components/Catalog/Filters/Index";
import ProductListArea from "~/components/Catalog/ProductsArea/Index";
import { useBreadcrumb } from "~/contexts/BreadcrumbContext";
import { MobileFilterProvider } from "~/contexts/MobileFilterContext";
import { useProductFilter } from "~/hooks/useProductFilter";
import { useProducts } from "~/hooks/useProducts";
import { routerPaths } from "~/utils/router";

function ProductsContent() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 1023px)");
		setIsMobile(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	const searchParams = useSearchParams();
	const categoryIdParam = searchParams.get("categoryId");
	const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;
	const nameParam = searchParams.get("name");
	const { products: allProducts, isLoading } = useProducts();
	const { setBreadcrumbs } = useBreadcrumb();

	const filteredProducts = useMemo(() => {
		let result = allProducts || [];
		if (categoryId) {
			result = result.filter(p => Number(p.categoryId) === categoryId);
		}
		if (nameParam) {
			const lowerName = nameParam.toLowerCase();
			result = result.filter(p => p.name.toLowerCase().includes(lowerName));
		}
		return result;
	}, [allProducts, categoryId, nameParam]);

	const categoryLabel = useMemo(() => {
		if (categoryId && allProducts.length > 0) {
			const foundProduct = allProducts.find(p => Number(p.categoryId) === categoryId);
			return foundProduct?.category?.name || "Products";
		}
		return "Products";
	}, [categoryId, allProducts]);

	const { selectedFilters, toggleFilter, paginatedProducts, totalCount, totalPages, currentPage, handleChangePage } =
		useProductFilter(filteredProducts, { itemsPerPage: isMobile ? 10 : 9 });

	useEffect(() => {
		setBreadcrumbs([
			{ label: "Home", href: routerPaths.index },
			{ label: categoryLabel, href: routerPaths.productDetail },
		]);
	}, [categoryLabel, setBreadcrumbs]);

	if (isLoading) {
		return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
	}

	return (
		<MobileFilterProvider>
			<div className="w-full max-w-[1440px] mx-auto">
				<div className="flex flex-col md:flex-row gap-4 md:gap-[32px] pt-4 md:pt-[24px] pb-8 md:pb-[56px] px-4 md:px-[160px]">
					<div className="w-full md:w-[256px] md:min-w-[256px] flex-shrink-0">
						<Filters selectedFilters={selectedFilters} toggleFilter={toggleFilter} categoryId={categoryId} />
					</div>

					<ProductListArea
						products={paginatedProducts}
						totalCount={totalCount}
						totalPages={totalPages}
						currentPage={currentPage}
						onPageChange={handleChangePage}
					/>
				</div>
			</div>
		</MobileFilterProvider>
	);
}

export default function ProductsPage() {
	return (
		<Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
			<ProductsContent />
		</Suspense>
	);
}
