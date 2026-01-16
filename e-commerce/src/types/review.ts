export interface ReviewCustomer {
	id: number;
	email: string;
	fullName: string;
}

export interface Review {
	id: number;
	productId: number;
	customerId: number;
	rating: number;
	comment: string;
	createdAt: string;
	updatedAt: string;
	customer: ReviewCustomer;
}

export interface CreateReviewPayload {
	productId: number;
	rating: number;
	comment: string;
	customerId: number;
}

export interface ReviewStats {
	averageRating: number;
	totalReviews: number;
	distribution: {
		5: number;
		4: number;
		3: number;
		2: number;
		1: number;
	};
}
