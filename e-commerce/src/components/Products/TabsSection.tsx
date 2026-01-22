"use client";
import React from "react";
import ProductCard from "./Card";
import CommonTabs from "~/components/atoms/Tabs";
import { useProductTabs } from "~/hooks/useProductTabs";

const TABS = ["New Arrival", "Bestseller", "Featured Products"];

const ProductTabsSection: React.FC = () => {
	const { activeTab, setActiveTab, filteredProducts, isLoading } = useProductTabs(TABS[0]);

	return (
		<div className="w-full bg-white">
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-1 md:py-[5px]">
				<CommonTabs options={TABS} value={activeTab} onChange={setActiveTab} className="mb-6 md:mb-8" />

				{isLoading ? (
					<div className="w-full h-[400px] flex items-center justify-center text-gray-400">Loading products...</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[16px] w-full">
						{filteredProducts.map(product => (
							<div key={product.id} className="h-full">
								<ProductCard product={product} />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductTabsSection;
