import { Review, ReviewStats } from "~/types/review";

export enum StarLevel {
	FIVE = 5,
	FOUR = 4,
	THREE = 3,
	TWO = 2,
	ONE = 1,
}

export const RATING_LABELS: Record<StarLevel, string> = {
	[StarLevel.FIVE]: "Excellent",
	[StarLevel.FOUR]: "Good",
	[StarLevel.THREE]: "Average",
	[StarLevel.TWO]: "Below Average",
	[StarLevel.ONE]: "Poor",
};

export const STAR_ORDER = [StarLevel.FIVE, StarLevel.FOUR, StarLevel.THREE, StarLevel.TWO, StarLevel.ONE];

export const calculateReviewStats = (reviews: Review[]): ReviewStats => {
	const totalReviews = reviews.length;

	const distribution: Record<StarLevel, number> = {
		[StarLevel.FIVE]: 0,
		[StarLevel.FOUR]: 0,
		[StarLevel.THREE]: 0,
		[StarLevel.TWO]: 0,
		[StarLevel.ONE]: 0,
	};

	let totalRatingSum = 0;

	reviews.forEach(review => {
		totalRatingSum += review.rating;
		const star = review.rating;
		if (distribution[star] !== undefined) {
			distribution[star]++;
		}
	});

	const averageRating = totalReviews > 0 ? parseFloat((totalRatingSum / totalReviews).toFixed(1)) : 0;

	return {
		averageRating,
		totalReviews,
		distribution,
	};
};
