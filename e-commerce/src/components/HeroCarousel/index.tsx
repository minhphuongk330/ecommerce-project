"use client";
import React, { useEffect, useState } from "react";


const ChevronLeftIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<polyline points="15 18 9 12 15 6"></polyline>
	</svg>
);

const ChevronRightIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<polyline points="9 18 15 12 9 6"></polyline>
	</svg>
);

interface HeroCarouselProps {
	banners: any[];
	autoPlay?: boolean;
	interval?: number;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({
	banners,
	autoPlay = true,
	interval = 5000
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const nextSlide = () => {
		setCurrentIndex((prev) => (prev + 1) % banners.length);
	};

	const prevSlide = () => {
		setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
	};

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};


	useEffect(() => {
		if (!autoPlay || banners.length <= 1) return;

		const timer = setInterval(nextSlide, interval);
		return () => clearInterval(timer);
	}, [autoPlay, interval, banners.length]);

	if (!banners || banners.length === 0) {

		return (
			<div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-2xl">
				<div
					className="w-full h-full"
					style={{ background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)" }}
				>
					<div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
					<div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 lg:px-16 py-8">
						<span className="inline-block text-xs font-semibold text-white/80 uppercase tracking-widest mb-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
							HOT DEAL
						</span>
						<h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 max-w-[60%] drop-shadow-lg">
							Siêu Sale Công Nghệ
						</h3>
						<p className="text-white/90 text-lg mb-6 max-w-[50%] drop-shadow">
							Giảm đến 50% cho các sản phẩm công nghệ hàng đầu
						</p>
						<button className="group/btn w-fit px-6 py-3 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl">
							<span className="flex items-center gap-2">
								Khám phá ngay
								<span className="group-hover/btn:translate-x-1 transition-transform">→</span>
							</span>
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative overflow-hidden rounded-2xl group h-full w-full">

			<div
				className="flex transition-transform duration-500 ease-in-out h-full"
				style={{ transform: `translateX(-${currentIndex * 100}%)` }}
			>
				{banners.map((banner, index) => (
					<div
						key={banner.id}
						className="w-full flex-shrink-0 h-full"
					>
						<div
							className="relative w-full h-full cursor-pointer overflow-hidden rounded-2xl bg-gray-50"
							onClick={() => {
								if (banner.content) {
									window.location.href = `/products/${banner.content}`;
								} else {
									window.location.href = "/products";
								}
							}}
						>

							{banner.imageUrl ? (
								<img
									src={banner.imageUrl}
									alt={banner.title || "Banner"}
									className="w-full h-full object-fill group-hover:scale-[1.02] transition-transform duration-700"
								/>
							) : (

								<div
									className="w-full h-full"
									style={{
										background: index === 0
											? "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)"
											: index === 1
												? "linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)"
												: "linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)"
									}}
								/>
							)}
						</div>
					</div>
				))}
			</div>


			{banners.length > 1 && (
				<>
					<button
						onClick={prevSlide}
						className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-black/50 transition-all duration-300 hover:scale-115 z-10 pointer-events-none group-hover:pointer-events-auto"
						aria-label="Previous slide"
					>
						<ChevronLeftIcon />
					</button>
					<button
						onClick={nextSlide}
						className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-black/50 transition-all duration-300 hover:scale-115 z-10 pointer-events-none group-hover:pointer-events-auto"
						aria-label="Next slide"
					>
						<ChevronRightIcon />
					</button>
				</>
			)}


			{banners.length > 1 && (
				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
					{banners.map((_, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`transition-all duration-300 rounded-full ${index === currentIndex
								? "bg-white w-8 h-2"
								: "bg-white/50 w-2 h-2 hover:bg-white/70"
								}`}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default HeroCarousel;
