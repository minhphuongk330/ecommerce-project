import { useEffect, useState } from "react";
import { reviewService } from "~/services/review";
import { Review } from "~/types/review";

let cache: Review[] | null = null;

export const useTopReviews = (limit = 10) => {
	const [reviews, setReviews] = useState<Review[]>(cache ?? []);
	const [isLoading, setIsLoading] = useState(cache === null);

	useEffect(() => {
		if (cache !== null && cache.length > 0) return;
		let cancelled = false;
		setIsLoading(true);
		reviewService.getTopReviews(limit).then((data) => {
			if (cancelled) return;
			cache = data;
			setReviews(data);
			setIsLoading(false);
		});
		return () => { cancelled = true; };
	}, [limit]);

	return { reviews, isLoading };
};
