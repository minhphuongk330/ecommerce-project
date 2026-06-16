"use client";
import React from "react";
import ProductCard from "./Card";
import CommonTabs from "~/components/atoms/Tabs";
import { useProductTabs } from "~/hooks/useProductTabs";


const TAB_MAP: Record<string, string> = {
	"New Arrival": "Hàng mới về",
	Bestseller: "Bán chạy",
	"Featured Products": "Nổi bật",
};
const TAB_KEYS = Object.keys(TAB_MAP);
const TAB_LABELS = Object.values(TAB_MAP);

const ProductTabsSection: React.FC = () => {
	const { activeTab, setActiveTab, filteredProducts, isLoading } = useProductTabs(TAB_KEYS[0]);

	const handleTabChange = (label: string) => {
		const key = TAB_KEYS.find(k => TAB_MAP[k] === label) ?? label;
		setActiveTab(key);
	};

	const activeLabel = TAB_MAP[activeTab] ?? activeTab;

	return (
		<div className="w-full bg-white">
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] pt-8">
				<CommonTabs
					options={TAB_LABELS}
					value={activeLabel}
					onChange={handleTabChange}
					className="mb-6 md:mb-8"
				/>
				{isLoading ? (
					<div className="w-full h-[400px] flex items-center justify-center text-gray-400">
						Đang tải sản phẩm...
					</div>
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
