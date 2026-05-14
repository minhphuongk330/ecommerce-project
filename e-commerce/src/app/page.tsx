"use client";

import dynamic from "next/dynamic";

import { Suspense, useMemo } from "react";

import Banner from "~/components/Banner";

import BannerSlider, { SliderItem } from "~/components/Banner/Slider";

import BestSellers from "~/components/BestSellers";

import BrandPartners from "~/components/BrandPartners";

import HeroCarousel from "~/components/HeroCarousel";
import PromoBanners from "~/components/PromoBanners";

import { ProductGridSkeleton } from "~/components/Skeletons";

import StatsSection from "~/components/StatsSection";

import Testimonials from "~/components/Testimonials";

import TrustBar from "~/components/TrustBar";

import VoucherSection from "~/components/VoucherSection";

import { useBanners } from "~/hooks/useBanner";

import { useCategories } from "~/hooks/useCategories";

import { router } from "~/utils/router";



const FlashSaleLazy = dynamic(() => import("~/components/FlashSale"), {

	ssr: false,

	loading: () => <div className="w-full bg-red-600 h-[120px] animate-pulse" />,

});







export default function Home() {

	const { heroBanner, splitBanners, gridBanners, bottomBanner, isLoading } = useBanners();




	const mainSliderItems = useMemo(() => {

		const list: SliderItem[] = [];

		if (heroBanner) list.push({ type: "hero", data: heroBanner });

		if (splitBanners && splitBanners.length >= 2) list.push({ type: "split", data: splitBanners });

		return list;

	}, [heroBanner, splitBanners]);



	if (isLoading) {

		return (

			<div className="w-full bg-white">

				<div className="h-[400px] md:h-[600px] bg-gray-100 animate-pulse" />

				<div className="h-[72px] bg-gray-50 animate-pulse" />

				<div className="py-12 px-4 md:px-[160px]">

					<ProductGridSkeleton count={8} />

				</div>

			</div>

		);

	}



	return (

		<div className="w-full bg-white">



			{/* 1. Categories Grid - Gắn với header */}




			{/* 2. Hero Banner */}

			<BannerSlider items={mainSliderItems} />



			{/* 3. Trust Bar */}

			<TrustBar />



			{/* 4. Flash Sale */}

			<Suspense fallback={null}>

				<FlashSaleLazy />

			</Suspense>



			{/* 5. Promo Banners */}

			<PromoBanners />



			{/* 6. Voucher */}

			<VoucherSection />



			{/* 7. Gợi ý cho bạn (Best Sellers) */}

			<BestSellers />



			{/* 8. Hero Carousel Section */}
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8">
				<HeroCarousel
					banners={gridBanners || []}
					autoPlay={true}
					interval={5000}
				/>
			</div>

			{/* 9. Brand Partners */}
			<BrandPartners />

			{/* 10. Stats */}
			<StatsSection />

			{/* 11. Testimonials */}
			<Testimonials />


			{/* 13. Bottom Banner */}

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

