"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ProductCard from "~/components/Products/Card";
import { useFlashSale } from "~/hooks/useFlashSale";
import { FlashSaleItem } from "~/types/flashSale";
import CountdownTimer from "./CountdownTimer";


const LightningIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
	</svg>
);

const FireIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M12 2L12 7"></path>
		<path d="M12 22C16 22 20 18 20 14C20 12 18 10 16 9C16 11 14 13 12 13C10 13 8 11 8 9C6 10 4 12 4 14C4 18 8 22 12 22Z"></path>
	</svg>
);

const CATEGORY_TABS = ["Tất cả", "Điện thoại/Tablet", "Laptop", "Âm thanh/Phụ kiện"];

const TAB_CATEGORY_MAP: Record<string, number | null> = {
	"Tất cả": null,
	"Điện thoại/Tablet": 1,
	Laptop: 2,
	"Âm thanh/Phụ kiện": 3,
};

const FlashSaleSection: React.FC = () => {
	const { flashSale, isLoading, timeLeft } = useFlashSale();
	const [activeTab, setActiveTab] = useState("Tất cả");
	const [progress, setProgress] = useState(0);


	useEffect(() => {
		if (timeLeft) {
	const totalSeconds = 24 * 60 * 60;
			const elapsedSeconds = totalSeconds - (timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds);
			const progressPercentage = (elapsedSeconds / totalSeconds) * 100;
			setProgress(Math.min(progressPercentage, 100));
		}
	}, [timeLeft]);

	if (isLoading) {
		return (
			<div className="w-full bg-gradient-to-r from-red-600 to-orange-600 py-6 px-4 md:px-[160px]">
				<div className="max-w-[1440px] mx-auto">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse" />
						<div className="h-8 w-48 bg-white/20 animate-pulse rounded" />
						<div className="ml-auto h-8 w-24 bg-white/20 animate-pulse rounded" />
					</div>
					<div className="flex gap-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="w-[160px] md:w-[190px] h-[280px] bg-white/10 animate-pulse rounded-xl flex-shrink-0" />
						))}
					</div>
				</div>
			</div>
		);
	}

	if (!flashSale) return null;

	const filteredItems: FlashSaleItem[] =
		activeTab === "Tất cả"
			? flashSale.items
			: flashSale.items.filter(item => {
				const categoryName = item.product?.category?.name?.toLowerCase() || "";
				if (activeTab === "Điện thoại/Tablet") {
					return categoryName.includes("điện thoại") || categoryName.includes("tablet") || categoryName.includes("máy tính bảng") || categoryName.includes("phone") || categoryName.includes("ipad");
				}
				if (activeTab === "Laptop") {
					return categoryName.includes("laptop") || categoryName.includes("máy tính xách tay");
				}
				if (activeTab === "Âm thanh/Phụ kiện") {
					return categoryName.includes("tai nghe") || categoryName.includes("loa") || categoryName.includes("âm thanh") || categoryName.includes("phụ kiện") || categoryName.includes("sạc") || categoryName.includes("cáp");
				}
				return false;
			});

	const totalSold = flashSale.items?.reduce((acc, item) => {
		const soldCount = (item.product as any)?.soldCount || 0;
		return acc + soldCount;
	}, 0) || 0;
	const totalStock = flashSale.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
	const stockProgress = totalStock > 0 ? Math.min((totalSold / totalStock) * 100, 100) : 0;




	return (
		<div className="w-full bg-gradient-to-r from-red-600 to-orange-600 relative overflow-hidden">

			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mt-16" />
				<div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full -mr-24 -mb-24" />
			</div>

			<div className="relative max-w-[1440px] mx-auto px-4 md:px-[160px] py-6">

				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
							<LightningIcon />
						</div>
						<div>
							<h1 className="text-white font-bold text-2xl md:text-3xl uppercase tracking-wide flex items-center gap-2">
								{flashSale.title}
								<span className="inline-flex items-center gap-1 text-xs bg-yellow-400 text-red-900 px-2 py-1 rounded-full font-bold">
									<FireIcon />
									HOT
								</span>
							</h1>
							<p className="text-white/80 text-sm">Ưu đãi có hạn - Số lượng có hạn</p>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<span className="text-white/80 text-xs">Kết thúc trong</span>
							<CountdownTimer hours={timeLeft.hours} minutes={timeLeft.minutes} seconds={timeLeft.seconds} />
						</div>
						<Link
							href="/products?flashSale=true"
							className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 hover:text-red-700 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
						>
							Xem tất cả
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<line x1="5" y1="12" x2="19" y2="12"></line>
								<polyline points="12 5 19 12 12 19"></polyline>
							</svg>
						</Link>
					</div>
				</div>



				<div className="flex gap-2 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
					{CATEGORY_TABS.map(tab => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`flex-shrink-0 text-sm px-4 py-2 rounded-full font-medium transition-all duration-300 ${activeTab === tab
								? "bg-white text-red-600 shadow-lg transform scale-105"
								: "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
								}`}
						>
							{tab}
						</button>
					))}
				</div>


				<div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
					{filteredItems.length === 0 ? (
						<div className="w-full text-center py-8">
							<p className="text-white text-sm">Không có sản phẩm trong danh mục này.</p>
						</div>
					) : (
						filteredItems.map((item, index) => {
							const enrichedProduct = {
								...item.product,
								isFlashSale: true,
								flashSalePrice: Number(item.salePrice),
								flashSaleOriginalPrice: Number(item.originalPrice),
							};

							return (
								<div
									key={item.id}
									className="flex-shrink-0 w-[160px] md:w-[190px] transform hover:scale-105 transition-transform duration-300"
									style={{ animationDelay: `${index * 100}ms` }}
								>
									<ProductCard
										product={enrichedProduct}
										quantity={item.quantity}
										soldQuantity={item.soldQuantity}
									/>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
};

export default FlashSaleSection;
