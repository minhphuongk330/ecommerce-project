import { useEffect, useState } from 'react';
import { couponService } from '~/services/coupon';
import { Coupon } from '~/types/coupon';

let cache: Coupon[] | null = null; // null = chưa fetch, [] = đã fetch nhưng không có data

export const useCoupons = () => {
	const [coupons, setCoupons] = useState<Coupon[]>(cache ?? []);
	const [isLoading, setIsLoading] = useState(cache === null);

	useEffect(() => {
		// Chỉ skip nếu cache có data thật (length > 0)
		// Nếu cache = [] thì vẫn fetch lại để cập nhật
		if (cache !== null && cache.length > 0) return;

		let cancelled = false;
		setIsLoading(true);
		couponService.getHomepage().then((data) => {
			if (cancelled) return;
			cache = data; // lưu dù rỗng để tránh fetch loop
			setCoupons(data);
			setIsLoading(false);
		});
		return () => { cancelled = true; };
	}, []);

	return { coupons, isLoading };
};
