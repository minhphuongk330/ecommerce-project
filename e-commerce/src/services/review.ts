import axiosClient from "./axiosClient";
import { CreateReviewPayload, Review } from "~/types/review";

interface UpdateReviewPayload {
	rating?: number;
	comment?: string;
}

export const reviewService = {
	getAllReviews: async (productId?: number): Promise<Review[]> => {
		const params = productId ? { productId } : undefined;
		return axiosClient.get("/product-reviews", { params });
	},

	createReview: async (payload: CreateReviewPayload): Promise<Review> => {
		return axiosClient.post("/product-reviews", payload);
	},

	updateReview: async (id: number, payload: UpdateReviewPayload): Promise<Review> => {
		return axiosClient.patch(`/product-reviews/${id}`, payload);
	},

	deleteReview: async (id: number): Promise<void> => {
		return axiosClient.delete(`/product-reviews/${id}`);
	},
};
