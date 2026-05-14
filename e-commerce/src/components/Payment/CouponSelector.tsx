"use client";
import { useEffect, useState } from "react";
import { useCheckoutContext } from "~/contexts/CheckoutContext";
import { couponService } from "~/services/coupon";
import { formatPrice } from "~/utils/format";
import type { CustomerCoupon } from "~/types/coupon";
import { usePaymentSummary } from "~/hooks/usePaymentSummary";

export default function CouponSelector() {
	const { appliedCoupon, setAppliedCoupon, appliedShippingCoupon, setAppliedShippingCoupon } = useCheckoutContext();
	const { subtotal, rawShippingCost } = usePaymentSummary();
	const [myCoupons, setMyCoupons] = useState<CustomerCoupon[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [activeTab, setActiveTab] = useState<'product' | 'shipping'>('product');

	useEffect(() => {
		setLoading(true);
		couponService.getMyCoupons()
			.then(setMyCoupons)
			.catch(() => setMyCoupons([]))
			.finally(() => setLoading(false));
	}, []);

	const isFreeShipping = rawShippingCost <= 0;
	const productCoupons = myCoupons.filter(cc => !cc.coupon.couponType || cc.coupon.couponType === 'product');
	const shippingCoupons = myCoupons.filter(cc => cc.coupon.couponType === 'shipping');

	const handleSelect = async (cc: CustomerCoupon) => {
		setErrors({});
		const isShipping = cc.coupon.couponType === 'shipping';

		try {
			const result = await couponService.validate(cc.coupon.code, subtotal, rawShippingCost);
			if (isShipping) {
				setAppliedShippingCoupon(result);
			} else {
				setAppliedCoupon(result);
			}
		} catch (e: any) {
			setErrors({ [cc.id]: e?.response?.data?.message || "Coupon không hợp lệ" });
		}
	};

	const handleRemove = (type: 'product' | 'shipping') => {
		if (type === 'product') setAppliedCoupon(null);
		else setAppliedShippingCoupon(null);
	};

	const getCouponBadge = (cc: CustomerCoupon) => {
		const c = cc.coupon;
		if (c.discountType === 'percent') return `-${c.discountValue}%`;
		return `-${formatPrice(c.discountValue)}`;
	};

	const CouponTag = ({ type }: { type: 'product' | 'shipping' }) => {
		const applied = type === 'product' ? appliedCoupon : appliedShippingCoupon;
		if (!applied) return null;
		return (
			<div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-[8px] p-2.5 gap-2 text-sm">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
					</div>
					<div>
						<p className="font-mono font-bold text-xs text-black">{applied.coupon.code}</p>
						<p className="text-xs text-green-700">Giảm {formatPrice(applied.discountAmount)}</p>
					</div>
				</div>
				<button onClick={() => handleRemove(type)} className="text-gray-400 hover:text-red-500 text-lg leading-none transition-colors">×</button>
			</div>
		);
	};

	return (
		<div className="w-full border border-[#EBEBEB] rounded-[10px] p-4 md:p-[24px] bg-white shadow-sm">
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-lg md:text-[20px] font-medium text-black">Mã giảm giá</h3>
				<button
					onClick={() => setIsModalOpen(true)}
					disabled={loading || myCoupons.length === 0}
					className="text-sm font-medium text-black underline underline-offset-2 hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{myCoupons.length === 0 ? "Chưa có coupon" : "Chọn mã"}
				</button>
			</div>

			{/* Applied coupons */}
			<div className="flex flex-col gap-2">
				<CouponTag type="product" />
				<CouponTag type="shipping" />
				{!appliedCoupon && !appliedShippingCoupon && (
					<p className="text-sm text-gray-400">Chưa áp dụng mã giảm giá nào</p>
				)}
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

					<div className="relative w-full max-w-md bg-white rounded-[16px] shadow-2xl overflow-hidden">
						{/* Header */}
						<div className="flex items-center justify-between p-5 border-b border-[#EBEBEB]">
							<h2 className="text-lg font-semibold text-black">Chọn mã giảm giá</h2>
							<button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black transition-colors text-2xl leading-none">×</button>
						</div>

						{/* Tabs */}
						<div className="flex border-b border-[#EBEBEB]">
							{(['product', 'shipping'] as const).map(tab => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2
										${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
								>
									{tab === 'product' ? 'Giảm giá sản phẩm' : 'Giảm phí ship'}
								</button>
							))}
						</div>

						{/* Coupon list */}
						<div className="max-h-[360px] overflow-y-auto p-4 flex flex-col gap-3">
							{activeTab === 'product' && (
								productCoupons.length === 0
									? <p className="text-center text-gray-400 py-8 text-sm">Bạn chưa có coupon giảm giá sản phẩm</p>
									: productCoupons.map(cc => {
										const isApplied = appliedCoupon?.coupon.id === cc.coupon.id;
										const isIneligible = subtotal < (cc.coupon.minOrderValue || 0);
										return (
											<CouponCard
												key={cc.id}
												cc={cc}
												badge={getCouponBadge(cc)}
												isApplied={isApplied}
												isDisabled={isIneligible}
												disabledReason={isIneligible ? `Đơn tối thiểu ${formatPrice(cc.coupon.minOrderValue)}` : undefined}
												error={errors[cc.id]}
												onSelect={() => handleSelect(cc)}
											/>
										);
									})
							)}

							{activeTab === 'shipping' && (
								shippingCoupons.length === 0
									? <p className="text-center text-gray-400 py-8 text-sm">Bạn chưa có coupon giảm phí ship</p>
									: shippingCoupons.map(cc => {
										const isApplied = appliedShippingCoupon?.coupon.id === cc.coupon.id;
										const isIneligible = subtotal < (cc.coupon.minOrderValue || 0);
										return (
											<CouponCard
												key={cc.id}
												cc={cc}
												badge={getCouponBadge(cc)}
												isApplied={isApplied}
												isDisabled={isFreeShipping || isIneligible}
												disabledReason={
													isFreeShipping ? "Miễn phí ship, không áp dụng được"
													: isIneligible ? `Đơn tối thiểu ${formatPrice(cc.coupon.minOrderValue)}`
													: undefined
												}
												error={errors[cc.id]}
												onSelect={() => handleSelect(cc)}
											/>
										);
									})
							)}
						</div>

						{/* Footer */}
						<div className="p-4 border-t border-[#EBEBEB]">
							<button
								onClick={() => setIsModalOpen(false)}
								className="w-full bg-black text-white rounded-[8px] py-3 text-sm font-semibold hover:bg-gray-800 transition-colors"
							>
								Xong
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// Sub-component card coupon
function CouponCard({ cc, badge, isApplied, isDisabled, disabledReason, error, onSelect }: {
	cc: CustomerCoupon;
	badge: string;
	isApplied: boolean;
	isDisabled: boolean;
	disabledReason?: string;
	error?: string;
	onSelect: () => void;
}) {
	return (
		<div className={`border rounded-[10px] p-3.5 transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed border-[#EBEBEB]' : isApplied ? 'border-green-400 bg-green-50' : 'border-[#EBEBEB] hover:border-gray-400 cursor-pointer'}`}
			onClick={!isDisabled ? onSelect : undefined}>
			<div className="flex items-center justify-between gap-2">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<span className="font-mono font-bold text-sm text-black">{cc.coupon.code}</span>
						{isApplied && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Đang dùng</span>}
					</div>
					<p className="text-xs text-gray-500 mt-0.5 truncate">{cc.coupon.description}</p>
					{disabledReason && <p className="text-xs text-red-400 mt-0.5">{disabledReason}</p>}
					{error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
				</div>
				<span className="text-sm font-bold text-green-600 flex-shrink-0 bg-green-50 border border-green-200 px-2 py-1 rounded-[6px]">{badge}</span>
			</div>
		</div>
	);
}
