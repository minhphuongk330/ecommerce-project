import { Coupon, CustomerCoupon, ValidateCouponResult } from '~/types/coupon';
import axiosClient from './axiosClient';

export const couponService = {
	getHomepage: async (): Promise<Coupon[]> => {
		try {
			return await axiosClient.get('/coupons/homepage');
		} catch {
			return [];
		}
	},

	validate: async (code: string, orderValue: number, shippingCost: number = 0): Promise<ValidateCouponResult> => {
		return await axiosClient.post('/coupons/validate', { code, orderValue, shippingCost });
	},

	getAll: async (): Promise<Coupon[]> => {
		return await axiosClient.get('/coupons');
	},

	// Thu thập coupon
	collect: async (couponId: string): Promise<void> => {
		return await axiosClient.post(`/customer-coupons/${couponId}`);
	},

	// Xóa coupon đã thu thập
	removeCollected: async (couponId: string): Promise<void> => {
		return await axiosClient.delete(`/customer-coupons/${couponId}`);
	},

	// Lấy danh sách coupon đã thu thập
	getMyCoupons: async (): Promise<CustomerCoupon[]> => {
		return await axiosClient.get('/customer-coupons');
	},

	// Lấy danh sách couponId đã thu thập (để check trạng thái nút)
	getCollectedIds: async (): Promise<string[]> => {
		try {
			return await axiosClient.get('/customer-coupons/collected-ids');
		} catch {
			return [];
		}
	},
};
