"use client";
import { useMemo } from "react";
import BannerSlider, { SliderItem } from "~/components/Banner/Slider";
import Banner from "~/components/Banner";
import CategoryBrowser from "~/components/Category/Browser";
import ProductTabsSection from "~/components/Products/TabsSection";
import SectionProductList from "~/components/Products/SectionProductList";
import { useBanners } from "~/hooks/useBanner";
import { useDiscountProducts } from "~/hooks/useProductDiscount";
import { router } from "~/utils/router";

const GRID_STYLES = [
	{ bg: "bg-white", text: "text-black", btn: "dark" as const },
	{ bg: "bg-[#F9F9F9]", text: "text-black", btn: "dark" as const },
	{ bg: "bg-[#EFEFEF]", text: "text-black", btn: "dark" as const },
	{ bg: "bg-[#2C2C2C]", text: "text-white", btn: "light" as const },
];

export default function Home() {
	const { heroBanner, splitBanners, gridBanners, bottomBanner, isLoading } = useBanners();
	const { discountData } = useDiscountProducts();

	const mainSliderItems = useMemo(() => {
		const list: SliderItem[] = [];
		if (heroBanner) list.push({ type: "hero", data: heroBanner });
		if (splitBanners && splitBanners.length >= 2) list.push({ type: "split", data: splitBanners });
		if (bottomBanner) list.push({ type: "bottom", data: bottomBanner });
		return list;
	}, [heroBanner, splitBanners, bottomBanner]);

	const gridSliderItems = useMemo(() => {
		const list: SliderItem[] = [];
		if (gridBanners && gridBanners.length > 0) {
			gridBanners.forEach((banner, index) => {
				list.push({
					type: "grid",
					data: banner,
					index: index,
				});
			});
		}
		return list;
	}, [gridBanners]);

	if (isLoading) {
		return <div className="w-full h-screen flex justify-center items-center">Loading...</div>;
	}

	return (
		<div className="w-full bg-white">
			<BannerSlider items={mainSliderItems} />

			{splitBanners && (
				<div className="flex flex-col md:flex-row w-full h-auto md:h-[600px]">
					{splitBanners[1] && (
						<Banner
							data={splitBanners[1]}
							className="hidden md:block md:w-1/2 h-full relative overflow-hidden"
							buttonText=""
							imageClass="h-full w-full object-cover"
							link={router.product(30)}
						/>
					)}
					{splitBanners[0] && (
						<Banner
							data={splitBanners[0]}
							className="w-full md:w-1/2 bg-[#EDEDED] h-full relative overflow-hidden"
							titleClass="text-black text-3xl md:text-6xl lg:text-7xl font-medium whitespace-normal w-[60%] md:w-full"
							descClass="max-w-[300px] md:max-w-sm line-clamp-3 text-sm md:text-base font-medium text-[#555]"
							btnTheme="dark"
							contentClass="p-6 md:p-10 items-start text-left h-full justify-center flex flex-col relative z-10"
							imageClass="absolute bottom-0 right-[-20px] h-[75%] w-[70%] object-contain 
                            md:right-0 md:h-full md:w-full md:translate-x-10 md:scale-90 
                            pointer-events-none"
							link={router.product(30)}
							buttonClass="w-[190px] h-[56px] flex items-center justify-center text-base font-medium !p-0 mt-6 md:mt-8"
						/>
					)}
				</div>
			)}

			<CategoryBrowser />
			<ProductTabsSection />

			{gridBanners && gridBanners.length > 0 && (
				<div className="w-full pb-8 md:pb-16">
					<div className="block md:hidden">
						<BannerSlider items={gridSliderItems} />
					</div>

					<div className="hidden md:block">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
							{gridBanners.map((banner, index) => {
								const style = GRID_STYLES[index] || GRID_STYLES[0];
								return (
									<Banner
										key={banner.id}
										data={banner}
										className={`${style.bg} col-span-1 h-auto`}
										contentClass="flex flex-col-reverse h-full justify-end px-4 md:px-8 py-8 md:py-16"
										titleClass={`${style.text} text-2xl md:text-3xl font-light mb-4 px-3`}
										descClass={`text-sm mb-6 md:mb-10 leading-relaxed font-medium opacity-60 px-3 ${style.text}`}
										btnTheme={style.btn}
										imageClass="relative h-[250px] md:h-[350px] w-full object-contain mb-6"
										link={router.product(30)}
									/>
								);
							})}
						</div>
					</div>
				</div>
			)}

			<SectionProductList title="Discount up to -50%" products={discountData} />

			{bottomBanner && (
				<Banner
					data={bottomBanner}
					className="h-[300px] md:h-[448px] bg-[#2C2C2C]"
					titleClass="text-white text-3xl md:text-5xl lg:text-7xl"
					contentClass="justify-center items-center text-center px-4 md:px-20"
					link={router.product(30)}
				/>
			)}
		</div>
	);
}
