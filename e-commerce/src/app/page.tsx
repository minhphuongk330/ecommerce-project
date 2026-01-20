"use client";
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

	if (isLoading && !heroBanner) {
		return <div className="w-full h-screen flex justify-center items-center">Loading...</div>;
	}

	return (
		<div className="w-full bg-white">
			{heroBanner && (
				<Banner
					data={heroBanner}
					className="bg-[#211c24] h-[400px] md:h-[632px]"
					contentClass="max-w-[1440px] mx-auto px-4 md:px-40 items-start text-left"
					titleClass="text-white text-4xl md:text-7xl lg:text-8xl"
					imageClass="absolute bottom-0 right-[-200] h-[47%] md:h-[100%] md:translate-x-150 md:bottom-auto md:right-auto"
					link={router.product(30)}
				/>
			)}

			{splitBanners && (
				<div className="flex flex-col md:flex-row w-full h-auto md:h-[600px]">
					{splitBanners[1] && (
						<Banner
							data={splitBanners[1]}
							className="w-full md:w-1/2 h-[300px] md:h-full"
							buttonText=""
							imageClass="h-full w-full object-cover"
							link={router.product(30)}
						/>
					)}

					{splitBanners[0] && (
						<Banner
							data={splitBanners[0]}
							className="w-full md:w-1/2 bg-[#EDEDED] h-[400px] md:h-full"
							titleClass="text-black text-4xl md:text-7xl lg:text-8xl whitespace-normal w-full md:w-min"
							descClass="max-w-full md:max-w-sm"
							btnTheme="dark"
							contentClass="p-6 md:p-10 md:pl-16 items-start text-left h-full justify-center"
							imageClass="h-full w-full object-contain bottom-0 right-0 translate-x-0 md:translate-x-10"
							link={router.product(30)}
						/>
					)}
				</div>
			)}

			<CategoryBrowser />
			<ProductTabsSection />

			{gridBanners && (
				<div className="w-full pb-8 md:pb-16">
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
			)}

			<SectionProductList title="Discount up to -50%" products={discountData} />

			{bottomBanner && (
				<Banner
					data={bottomBanner}
					className="h-[300px] md:h-[448px] bg-[#2C2C2C]"
					titleClass="text-white text-3xl md:text-5xl lg:text-7xl"
					contentClass="justify-center items-center text-center px-4 md:px-20"
					imageClass="h-[100%]"
					link={router.product(30)}
				/>
			)}
		</div>
	);
}
