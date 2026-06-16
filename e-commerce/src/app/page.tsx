"use client";
import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import Banner from "~/components/Banner";
import BannerSlider, { SliderItem } from "~/components/Banner/Slider";
import BestSellers from "~/components/BestSellers";
import BrandPartners from "~/components/BrandPartners";
import HeroCarousel from "~/components/HeroCarousel";
import { ProductGridSkeleton } from "~/components/Skeletons";
import StatsSection from "~/components/StatsSection";
import Testimonials from "~/components/Testimonials";
import TrustBar from "~/components/TrustBar";
import VoucherSection from "~/components/VoucherSection";
import { useBanners } from "~/hooks/useBanner";
import { router } from "~/utils/router";

const FlashSaleLazy = dynamic(() => import("~/components/FlashSale"), {
	ssr: false,
	loading: () => <div className="w-full bg-red-600 h-[120px] animate-pulse" />,
});

export default function Home() {
	const { heroBanner, splitBanners, gridBanners, bottomBanner, sideBanners, isLoading } = useBanners();
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
			<BannerSlider items={mainSliderItems} />
			<TrustBar />
			<Suspense fallback={null}>
				<FlashSaleLazy />
			</Suspense>
			<VoucherSection />
			<BestSellers />
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">

					<div className="w-full overflow-hidden md:col-span-3 h-[200px] sm:h-[260px] md:h-[300px] lg:h-[450px]">
						<HeroCarousel
							banners={gridBanners || []}
							autoPlay={true}
							interval={5000}
						/>
					</div>


					<div className="flex flex-col gap-4 h-[200px] sm:h-[260px] md:h-[300px] lg:h-[450px] md:col-span-1">
						{sideBanners && sideBanners.length > 0 ? (
							sideBanners.slice(0, 2).map((banner, index) => (
								<div
									key={banner.id}
									className="relative flex-1 w-full h-full cursor-pointer overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 group"
									onClick={() => {
										window.location.href = "/products";
									}}
								>
									<img
										src={banner.imageUrl}
										alt={banner.title || `Side Banner ${index + 1}`}
										className="w-full h-full object-fill group-hover:scale-[1.02] transition-transform duration-500"
									/>
								</div>
							))
						) : (

							<>
								<div
									className="relative flex-1 w-full h-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex flex-col justify-center p-6 text-white cursor-pointer hover:shadow-lg transition-all duration-300 group"
									onClick={() => {
										window.location.href = "/products";
									}}
								>
									<div className="absolute inset-0 bg-black/10 group-hover:opacity-0 transition-opacity" />
									<h4 className="font-bold text-sm md:text-base lg:text-lg z-10">Xu Hướng Công Nghệ</h4>
									<p className="text-xxs md:text-xs text-white/80 mt-1 z-10">Giảm giá lên đến 40%</p>
								</div>
								<div
									className="relative flex-1 w-full h-full overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-rose-600 flex flex-col justify-center p-6 text-white cursor-pointer hover:shadow-lg transition-all duration-300 group"
									onClick={() => {
										window.location.href = "/products";
									}}
								>
									<div className="absolute inset-0 bg-black/10 group-hover:opacity-0 transition-opacity" />
									<h4 className="font-bold text-sm md:text-base lg:text-lg z-10">Phụ Kiện Chính Hãng</h4>
									<p className="text-xxs md:text-xs text-white/80 mt-1 z-10">Mua ngay ưu đãi khủng</p>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			<BrandPartners />
			<StatsSection />
			<Testimonials />
			{bottomBanner && (
				<Banner
					data={bottomBanner}
					className="h-[300px] md:h-[448px] bg-[#2C2C2C]"
					titleClass="text-white text-3xl md:text-5xl lg:text-7xl"
					contentClass="justify-center items-center text-center px-4 md:px-20"
					link={router.product(30)}
				>
					<div className="flex flex-col items-center gap-6 mt-4 z-10">
						<h2 className="text-white text-2xl md:text-4xl lg:text-4xl font-bold tracking-wider uppercase bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
							Nâng Tầm Trải Nghiệm Công Nghệ
						</h2>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-gray-300 text-sm md:text-base font-medium">
							<div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
								<span className="text-green-400">✓</span>
								<span>Trả góp 0% lãi suất</span>
							</div>
							<div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
								<span className="text-green-400">✓</span>
								<span>Bảo hành chính hãng 2 năm</span>
							</div>
							<div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
								<span className="text-green-400">✓</span>
								<span>Giao hàng hoả tốc 2h</span>
							</div>
						</div>
					</div>
				</Banner>
			)}
		</div>
	);
}

