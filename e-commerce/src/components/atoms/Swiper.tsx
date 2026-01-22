"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SwiperProps<T> {
	data: T[];
	renderItem: (item: T) => React.ReactNode;
	className?: string;
	slidesPerView?: number;
	autoplayDelay?: number;
	showNavigation?: boolean;
	showPagination?: boolean;
}

export default function CommonSwiper<T>({
	data,
	renderItem,
	className = "w-full",
	slidesPerView = 1,
	autoplayDelay = 4000,
	showNavigation = true,
	showPagination = true,
}: SwiperProps<T>) {
	if (!data || data.length === 0) return null;

	return (
		<div className={`relative group ${className}`}>
			<Swiper
				modules={[Autoplay, Navigation, Pagination]}
				loop={true}
				speed={800}
				slidesPerView={slidesPerView}
				autoplay={{
					delay: autoplayDelay,
					disableOnInteraction: false,
					pauseOnMouseEnter: true,
				}}
				navigation={showNavigation}
				pagination={showPagination ? { clickable: true } : false}
				className="h-full w-full"
			>
				{data.map((item, index) => (
					<SwiperSlide key={(item as any).id || index}>{renderItem(item)}</SwiperSlide>
				))}
			</Swiper>

			{showNavigation && (
				<style jsx global>{`
					.swiper-button-next,
					.swiper-button-prev {
						color: white !important;
						background: rgba(0, 0, 0, 0.3);
						width: 44px;
						height: 44px;
						border-radius: 50%;
						backdrop-filter: blur(4px);
						opacity: 0;
						transition: all 0.3s;
					}
					.group:hover .swiper-button-next,
					.group:hover .swiper-button-prev {
						opacity: 1;
					}
					.swiper-button-next:hover,
					.swiper-button-prev:hover {
						background: rgba(255, 255, 255, 0.3);
					}
					.swiper-pagination-bullet {
						background: white !important;
						opacity: 0.5;
					}
					.swiper-pagination-bullet-active {
						opacity: 1;
						width: 20px;
						border-radius: 4px;
						transition: width 0.3s;
					}
				`}</style>
			)}
		</div>
	);
}
