"use client";
import CommonSwiper from "~/components/atoms/Swiper";
import Banner from "~/components/Banner";
import { BannerData } from "~/types/banner";
import { router } from "~/utils/router";

const GRID_STYLES = [
	{ bg: "bg-white", text: "text-black", btn: "dark" as const },
	{ bg: "bg-[#F9F9F9]", text: "text-black", btn: "dark" as const },
	{ bg: "bg-[#EFEFEF]", text: "text-black", btn: "dark" as const },
	{ bg: "bg-[#2C2C2C]", text: "text-white", btn: "light" as const },
];

export type SliderItem =
	| { type: "hero"; data: BannerData }
	| { type: "split"; data: BannerData[] }
	| { type: "grid"; data: BannerData; index: number }
	| { type: "bottom"; data: BannerData };

interface Props {
	items: SliderItem[];
}

const BannerSlider = ({ items }: Props) => {
	if (!items || items.length === 0) return <div className="w-full aspect-[12/5] bg-[#211c24]" />;

	return (
		<CommonSwiper
			data={items}
			className="w-full aspect-[12/5] bg-[#211c24]"
			autoplayDelay={4000}
			renderItem={item => {
				if (item.type === "split") {
					const splitBanners = item.data;
					return (
						<div className="flex w-full h-full bg-white">
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
									imageClass="absolute bottom-0 right-[-5px] h-[75%] w-[65%] object-contain 
                              md:right-0 md:h-full md:w-full md:translate-x-10 md:scale-90 
                              pointer-events-none"
									link={router.product(30)}
									buttonClass="w-[190px] h-[56px] flex items-center justify-center text-base font-medium !p-0 mt-6 md:mt-8"
								/>
							)}
						</div>
					);
				}

				if (item.type === "grid") {
					const style = GRID_STYLES[item.index] || GRID_STYLES[0];
					return (
						<Banner
							data={item.data}
							className={`${style.bg} h-full w-full relative overflow-hidden`}
							contentClass="max-w-[1440px] mx-auto px-4 md:px-40 flex flex-col justify-center h-full items-start"
							titleClass={`${style.text} text-3xl md:text-6xl lg:text-7xl font-medium md:font-light mb-6 w-[70%] md:w-full`}
							descClass={`${style.text} text-sm md:text-lg mb-8 opacity-80 max-w-[300px] md:max-w-lg font-medium md:font-normal`}
							btnTheme={style.btn}
							imageClass="absolute bottom-0 right-[-50px] h-[50%] w-[70%] object-contain pointer-events-none
                          md:right-20 md:h-[80%] md:w-auto"
							link={router.product(Number(item.data.id))}
							buttonClass="w-[190px] h-[56px] flex items-center justify-center text-base font-medium !p-0"
						/>
					);
				}

				if (item.type === "bottom") {
					return (
						<Banner
							data={item.data}
							className="h-full w-full bg-[#2C2C2C] relative overflow-hidden"
							titleClass="text-white text-3xl md:text-5xl lg:text-7xl font-medium"
							contentClass="justify-center items-center text-center px-4 md:px-20 h-full flex flex-col"
							link={router.product(Number(item.data.id))}
							buttonClass="w-[190px] h-[56px] flex items-center justify-center text-base font-medium !p-0 mt-8"
							imageClass="bottom-[50px]"
							buttonText=""
						>
							<div className="flex flex-col items-center gap-6 mt-4 z-10">
								<h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-wider uppercase bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
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
					);
				}

				const isFullImage = !item.data.title;

				return (
					<Banner
						data={item.data}
						buttonText={isFullImage ? "" : "Shop Now"}
						className="h-full w-full relative overflow-hidden"
						contentClass="max-w-[1440px] mx-auto px-4 md:px-40 items-start text-left h-full flex flex-col justify-center"
						titleClass="text-white text-3xl md:text-7xl lg:text-8xl font-medium mb-6 w-[60%] md:w-full"
						descClass="text-[#909090] text-sm md:text-base mb-8 max-w-[300px] md:max-w-md font-medium md:font-normal"
						imageClass={
							isFullImage
								? "absolute left-0 top-0 w-full h-full object-cover pointer-events-none"
								: "absolute bottom-[-110px] right-[-200px] h-[100%] w-[100%] object-contain pointer-events-none md:right-[-200px] md:h-[100%] md:w-auto md:translate-x-150 md:bottom-auto md:right-auto"
						}
						link={router.product(Number(item.data.id))}
						buttonClass={isFullImage ? "hidden" : "w-[190px] h-[56px] flex items-center justify-center text-base font-medium !p-0 mt-8"}
					/>
				);
			}}
		/>
	);
};

export default BannerSlider;
