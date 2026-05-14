"use client";
import { useEffect, useState } from "react";
import { couponService } from "~/services/coupon";
import { Coupon } from "~/types/coupon";
import { useAuthStore } from "~/stores/useAuth";
import { useRouter } from "next/navigation";
import { routerPaths } from "~/utils/router";
import LocalOffer from "@mui/icons-material/LocalOffer";
import ConfirmationModal from "~/components/atoms/Confirmation";

interface CollectedCoupon {
	id: number;
	coupon: Coupon;
	collectedAt: string;
}

const formatDiscount = (coupon: Coupon) => {
	if (coupon.discountType === "percent") return `-${coupon.discountValue}%`;
	return `-${Number(coupon.discountValue).toLocaleString("vi-VN")}₫`;
};

const formatExpiry = (expiresAt?: string) => {
	if (!expiresAt) return "Không hết hạn";
	const d = new Date(expiresAt);
	if (d < new Date()) return "Đã hết hạn";
	return `HSD: ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const isExpired = (expiresAt?: string) => {
	if (!expiresAt) return false;
	return new Date(expiresAt) < new Date();
};

export default function MyCouponsPage() {
	const { isAuthenticated } = useAuthStore();
	const router = useRouter();
	const [coupons, setCoupons] = useState<CollectedCoupon[]>([]);
	const [loading, setLoading] = useState(true);
	const [removing, setRemoving] = useState<number | null>(null);
	const [confirmTarget, setConfirmTarget] = useState<{ couponId: number; recordId: number } | null>(null);

	useEffect(() => {
		if (!isAuthenticated) {
			router.push(routerPaths.login);
			return;
		}
		couponService.getMyCoupons().then((data) => {
			setCoupons(data);
			setLoading(false);
		});
	}, [isAuthenticated]);

	const handleRemove = (couponId: number, recordId: number) => {
		setConfirmTarget({ couponId, recordId });
	};

	const doRemove = async () => {
		if (!confirmTarget) return;
		const { couponId, recordId } = confirmTarget;
		try {
			setRemoving(recordId);
			await couponService.removeCollected(couponId);
			setCoupons((prev) => prev.filter((c) => c.id !== recordId));
		} catch {
			// silent
		} finally {
			setRemoving(null);
			setConfirmTarget(null);
		}
	};

	return (
		<>
			<div className="w-full bg-white min-h-screen">
				<div className="max-w-[1440px] mx-auto px-4 md:px-[160px] py-8">
					<div className="flex items-center gap-3 mb-8">
						<LocalOffer className="!text-red-600" />
						<h1 className="text-2xl font-bold text-gray-900">Mã giảm giá của tôi</h1>
					</div>

					{loading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="h-[100px] bg-gray-100 animate-pulse rounded-xl" />
							))}
						</div>
					) : coupons.length === 0 ? (
						<div className="text-center py-20">
							<p className="text-5xl mb-4">🎁</p>
							<p className="text-gray-500 font-medium">Bạn chưa thu thập mã giảm giá nào</p>
							<button
								onClick={() => router.push(routerPaths.index)}
								className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
							>
								Khám phá ưu đãi
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{coupons.map(({ id, coupon }) => {
								const expired = isExpired(coupon.expiresAt) || !coupon.isActive;
								return (
									<div
										key={id}
										className={`relative flex rounded-xl overflow-hidden border shadow-sm ${
											expired ? "opacity-50 border-gray-200" : "border-red-200"
										}`}
									>
										{/* Nút X xóa */}
										<button
											onClick={() => handleRemove(coupon.id, id)}
											disabled={removing === id}
											className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white text-gray-500 flex items-center justify-center text-xs font-bold transition-colors"
											title="Xóa mã này"
										>
											{removing === id ? "·" : "×"}
										</button>

										{/* Left */}
										<div className={`flex flex-col items-center justify-center px-4 py-4 min-w-[80px] ${expired ? "bg-gray-400" : "bg-red-600"}`}>
											<span className="text-white text-xl font-black leading-none">
												{formatDiscount(coupon)}
											</span>
											<span className="text-white/80 text-[10px] mt-1 text-center">
												{coupon.discountType === "percent" ? "Giảm %" : "Giảm tiền"}
											</span>
										</div>

										{/* Notch */}
										<div className="relative flex items-center">
											<div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-white" />
											<div className={`w-px h-full border-l-2 border-dashed ${expired ? "border-gray-200" : "border-red-200"}`} />
											<div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-white" />
										</div>

										{/* Right */}
										<div className={`flex-1 px-4 py-3 flex flex-col justify-between ${expired ? "bg-gray-50" : "bg-red-50"}`}>
											<div>
												<p className="text-[13px] font-semibold text-gray-800 line-clamp-2 pr-6">
													{coupon.description}
												</p>
												<p className={`text-[11px] mt-1 font-medium ${expired ? "text-gray-400" : "text-red-500"}`}>
													{formatExpiry(coupon.expiresAt)}
												</p>
											</div>
											<div className="flex items-center justify-between mt-2">
												<span className={`text-sm font-bold tracking-widest bg-white border px-2 py-0.5 rounded ${expired ? "text-gray-400 border-gray-200" : "text-red-600 border-red-200"}`}>
													{coupon.code}
												</span>
												{expired && (
													<span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium">
														Hết hạn
													</span>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>

			<ConfirmationModal
				isOpen={!!confirmTarget}
				onClose={() => setConfirmTarget(null)}
				onConfirm={doRemove}
				title="Xóa mã giảm giá"
				message="Bạn có chắc muốn xóa mã này khỏi danh sách không?"
				confirmLabel="Xóa"
			/>
		</>
	);
}
