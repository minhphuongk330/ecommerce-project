export type DiscountType = 'percent' | 'fixed';
export type CouponType = 'product' | 'shipping';

export interface Coupon {
	id: string;
	code: string;
	description: string;
	discountType: DiscountType;
	couponType: CouponType;
	discountValue: number;
	minOrderValue: number;
	maxDiscountAmount?: number;
	usageLimit?: number;
	usedCount: number;
	expiresAt?: string;
	isActive: boolean;
	showOnHomepage: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ValidateCouponResult {
	coupon: Coupon;
	discountAmount: number;
}

// For API responses that include customer coupon IDs
export interface CustomerCoupon {
	id: string;
	coupon: Coupon;
	collectedAt: string;
}
