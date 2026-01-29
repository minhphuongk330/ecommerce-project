"use client";
import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
						background: transparent !important;
						width: 30 !important;
						height: 30 !important;
						border-radius: 0;
						opacity: 0;
						transition: all 0.3s;
						display: none !important;
						align-items: center;
						justify-content: center;
						margin-top: 0 !important;
					}
					@media (min-width: 768px) {
						.swiper-button-next,
						.swiper-button-prev {
							display: flex !important;
						}
					}
					.swiper-button-next::after,
					.swiper-button-prev::after {
						font-size: 40px !important;
						font-weight: 700;
						transform: scale(0.25);
						transform-origin: center;
					}
					@media (min-width: 768px) {
						.swiper-button-next::after,
						.swiper-button-prev::after {
							font-size: 50px !important;
							transform: scale(0.65);
						}
					}
					.group:hover .swiper-button-next,
					.group:hover .swiper-button-prev {
						opacity: 1;
					}
					.swiper-button-next:hover,
					.swiper-button-prev:hover {
						background: rgba(0, 0, 0, 0.6);
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
