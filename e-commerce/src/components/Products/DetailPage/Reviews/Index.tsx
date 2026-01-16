"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ViewMoreBtn from "~/components/atoms/ViewMoreBtn";
import { reviewService } from "~/services/review";
import { useAuthStore } from "~/stores/useAuth";
import { Review } from "~/types/review";
import { calculateReviewStats } from "~/utils/review";
import CreateReview from "./Modal/CreateReview";
import ReviewItem from "./Item";
import ReviewSummary from "./Summary";

interface ProductReviewsProps {
	productId: number;
}

const INITIAL_COUNT = 3;

export default function ProductReviews({ productId }: ProductReviewsProps) {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isExpanded, setIsExpanded] = useState(false);
	const user = useAuthStore(state => state.user);

	const fetchReviews = useCallback(
		async (showLoading = false) => {
			if (!productId) return;
			try {
				if (showLoading) setIsLoading(true);
				const data = await reviewService.getAllReviews(productId);
				setReviews(data);
			} catch (error) {
				console.error("Failed to fetch reviews:", error);
			} finally {
				if (showLoading) setIsLoading(false);
			}
		},
		[productId]
	);

	useEffect(() => {
		fetchReviews(true);
	}, [fetchReviews]);

	const stats = useMemo(() => calculateReviewStats(reviews), [reviews]);

	const myReview = useMemo(() => {
		return user ? reviews.find(r => String(r.customerId) === String(user.id)) : undefined;
	}, [reviews, user]);

	const displayedReviews = useMemo(() => {
		return isExpanded ? reviews : reviews.slice(0, INITIAL_COUNT);
	}, [reviews, isExpanded]);

	return (
		<div id="reviews" className="w-full py-10 flex justify-center">
			<div className="w-full max-w-[1120px] flex flex-col gap-[48px]">
				<h2 className="font-bold text-[24px] text-[#000000] leading-[32px]">Reviews</h2>

				<ReviewSummary stats={stats} />

				{!myReview && <CreateReview productId={productId} onSuccess={() => fetchReviews(false)} />}

				<div className="flex flex-col gap-[24px]">
					{isLoading ? (
						<p className="text-center text-gray-400">Loading reviews...</p>
					) : reviews.length === 0 ? (
						<p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
							There are no reviews for this product yet. Be the first to review it.!
						</p>
					) : (
						displayedReviews.map(review => (
							<ReviewItem
								key={review.id}
								data={review}
								currentUserId={user ? Number(user.id) : null}
								onRefresh={() => fetchReviews(false)}
							/>
						))
					)}
				</div>

				{reviews.length > INITIAL_COUNT && (
					<div className="flex justify-center mt-4">
						<ViewMoreBtn isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />
					</div>
				)}
			</div>
		</div>
	);
}
