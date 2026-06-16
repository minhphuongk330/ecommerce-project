import { useEffect, useState } from 'react';
import { couponService } from '~/services/coupon';
import { Coupon } from '~/types/coupon';

export const useCoupons = () => {
	const [coupons, setCoupons] = useState<Coupon[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);
		couponService.getHomepage().then((data) => {
			if (cancelled) return;
			setCoupons(data);
			setIsLoading(false);
		});
		return () => { cancelled = true; };
	}, []);

	return { coupons, isLoading };
};
