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

	validate: async (code: string, orderValue: number, shippingCost: number = 0, customerId?: number): Promise<ValidateCouponResult> => {
		return await axiosClient.post('/coupons/validate', { code, orderValue, shippingCost, customerId });
	},

	getAll: async (): Promise<Coupon[]> => {
		return await axiosClient.get('/coupons');
	},


	collect: async (couponId: string): Promise<void> => {
		return await axiosClient.post(`/customer-coupons/${couponId}`);
	},


	removeCollected: async (couponId: string): Promise<void> => {
		return await axiosClient.delete(`/customer-coupons/${couponId}`);
	},


	getMyCoupons: async (): Promise<CustomerCoupon[]> => {
		return await axiosClient.get('/customer-coupons');
	},


	getCollectedIds: async (): Promise<string[]> => {
		try {
			return await axiosClient.get('/customer-coupons/collected-ids');
		} catch {
			return [];
		}
	},
};
