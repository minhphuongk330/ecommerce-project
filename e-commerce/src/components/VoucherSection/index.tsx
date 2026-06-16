"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCoupons } from "~/hooks/useCoupons";
import { couponService } from "~/services/coupon";
import { useAuthStore } from "~/stores/useAuth";
import { useCollectedCoupons } from "~/stores/useCollectedCoupons";
import { Coupon } from "~/types/coupon";
import { routerPaths } from "~/utils/router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const formatDiscount = (coupon: Coupon): string => {
	if (coupon.discountType === "percent") return `-${coupon.discountValue}%`;
	return `-${Number(coupon.discountValue).toLocaleString("vi-VN")}₫`;
};

const formatMinOrder = (value: number): string => {
	if (!value || value === 0) return "Không giới hạn";
	return `Đơn từ ${Number(value).toLocaleString("vi-VN")}₫`;
};

const formatExpiry = (expiresAt?: string): string => {
	if (!expiresAt) return "Không giới hạn";
	const d = new Date(expiresAt);
	return `HSD: ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const CARD_COLORS = [
	{ left: "bg-red-600", right: "bg-red-50", text: "text-red-600", border: "border-red-200" },
	{ left: "bg-blue-600", right: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
	{ left: "bg-purple-600", right: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
	{ left: "bg-orange-500", right: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
	{ left: "bg-green-600", right: "bg-green-50", text: "text-green-600", border: "border-green-200" },
];

interface VoucherCardProps {
	coupon: Coupon;
	colorIdx: number;
	isCollected: boolean;
	onCollect: (id: string) => void;
}

const VoucherCard: React.FC<VoucherCardProps> = ({ coupon, colorIdx, isCollected, onCollect }) => {
	const color = CARD_COLORS[colorIdx % CARD_COLORS.length];
	return (
		<div className={`flex rounded-xl overflow-hidden border ${color.border} shadow-sm hover:shadow-md transition-shadow`}>
			<div className={`${color.left} flex flex-col items-center justify-center px-4 py-4 min-w-[80px]`}>
				<span className="text-white text-xl font-black leading-none">{formatDiscount(coupon)}</span>
				<span className="text-white/80 text-[10px] mt-1 text-center">
					{coupon.discountType === "percent" ? "Giảm %" : "Giảm tiền"}
				</span>
			</div>
			<div className="relative flex items-center">
				<div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-white" />
				<div className={`w-px h-full border-l-2 border-dashed ${color.border}`} />
				<div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-white" />
			</div>
			<div className={`${color.right} flex-1 px-4 py-3 flex flex-col justify-between`}>
				<div>
					<p className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug">{coupon.description}</p>
					<p className="text-[11px] text-gray-500 mt-1">{formatMinOrder(coupon.minOrderValue)}</p>
					<p className="text-[11px] text-gray-400">{formatExpiry(coupon.expiresAt)}</p>
				</div>
				<div className="flex items-center gap-2 mt-2">
					<span className={`text-sm font-bold tracking-widest ${color.text} bg-white border ${color.border} px-2 py-0.5 rounded`}>
						{coupon.code}
					</span>
					<button
						onClick={() => !isCollected && onCollect(coupon.id)}
						disabled={isCollected}
						className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${isCollected ? "bg-gray-200 text-gray-500 cursor-not-allowed" : `${color.left} text-white hover:opacity-80`
							}`}
					>
						{isCollected ? "✓ Đã thu thập" : "Thu thập"}
					</button>
				</div>
			</div>
		</div>
	);
};

const VoucherSkeleton = () => (
	<div className="flex rounded-xl overflow-hidden border border-gray-200 h-[100px] animate-pulse">
		<div className="w-[80px] bg-gray-200" />
		<div className="flex-1 bg-gray-100 p-4 space-y-2">
			<div className="h-3 bg-gray-200 rounded w-3/4" />
			<div className="h-3 bg-gray-200 rounded w-1/2" />
			<div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
		</div>
	</div>
);

const VoucherSection: React.FC = () => {
	const { coupons, isLoading } = useCoupons();
	const { isAuthenticated } = useAuthStore();
	const router = useRouter();
	const { addId, has } = useCollectedCoupons();
	const [collecting, setCollecting] = useState<string | null>(null);
	const [localCollectedIds, setLocalCollectedIds] = useState<string[]>([]);

	const isCollected = (id: string) => localCollectedIds.includes(id);

	useEffect(() => {
		try {
			const raw = localStorage.getItem("collected-coupons");
			if (raw) {
				const ids = JSON.parse(raw)?.state?.collectedIds ?? [];
				if (ids.length > 0) setLocalCollectedIds(ids);
			}
		} catch (e) {
		}

		const { isAuthenticated: isAuth } = useAuthStore.getState();
		if (!isAuth) return;
		couponService.getCollectedIds().then((ids) => {
			setLocalCollectedIds(ids);
			useCollectedCoupons.setState({ collectedIds: ids, lastFetched: Date.now() });
		}).catch(() => {
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleCollect = async (couponId: string) => {
		if (!isAuthenticated) {
			router.push(routerPaths.login);
			return;
		}
		if (collecting) return;
		try {
			setCollecting(couponId);
			await couponService.collect(couponId);
			addId(couponId);
			setLocalCollectedIds(prev => [...prev, couponId]);
		} catch (err: any) {
			if (err?.response?.status === 409) {
				addId(couponId);
				setLocalCollectedIds(prev => [...prev, couponId]);
			}
		} finally {
			setCollecting(null);
		}
	};

	if (!isLoading && coupons.length === 0) return null;

	const isSwiperActive = coupons.length > 1;

	return (
		<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-6">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<span className="text-xl">🎁</span>
					<h2 className="text-lg md:text-xl font-bold text-gray-900">Mã giảm giá</h2>
				</div>
				{!isLoading && coupons.length > 0 && isSwiperActive && (
					<div className="flex items-center gap-2">
						<button className="voucher-prev w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-40 [&.swiper-button-disabled]:opacity-40 [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:cursor-not-allowed">
							<ChevronLeft className="w-5 h-5" />
						</button>
						<button className="voucher-next w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-40 [&.swiper-button-disabled]:opacity-40 [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:cursor-not-allowed">
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>
				)}
			</div>

			{isLoading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{Array.from({ length: 3 }).map((_, i) => <VoucherSkeleton key={i} />)}
				</div>
			) : (
				<Swiper
					modules={[Navigation]}
					spaceBetween={16}
					slidesPerView={1}
					navigation={{
						nextEl: ".voucher-next",
						prevEl: ".voucher-prev",
					}}
					breakpoints={{
						640: {
							slidesPerView: 2,
						},
						1024: {
							slidesPerView: 3,
						},
					}}
					className="w-full"
				>
					{coupons.map((coupon, idx) => (
						<SwiperSlide key={coupon.id} className="py-1">
							<VoucherCard
								coupon={coupon}
								colorIdx={idx}
								isCollected={isCollected(coupon.id)}
								onCollect={handleCollect}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			)}
		</div>
	);
};

export default VoucherSection;

