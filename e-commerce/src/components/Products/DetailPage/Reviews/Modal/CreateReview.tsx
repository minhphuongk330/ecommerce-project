"use client";
import { useNotification } from "~/contexts/Notification";
import { reviewService } from "~/services/review";
import { useAuthStore } from "~/stores/useAuth";
import CommentInput from "../Comment/Index";

interface CreateReviewProps {
	productId: number;
	onSuccess: () => void;
}

export default function CreateReview({ productId, onSuccess }: CreateReviewProps) {
	const user = useAuthStore(state => state.user);
	const { showNotification } = useNotification();

	const handlePostReview = async (rating: number, content: string) => {
		if (!user) {
			showNotification("Please log in to write a review.", "warning");
			return;
		}

		try {
			await reviewService.createReview({
				productId,
				customerId: Number(user.id),
				rating,
				comment: content,
			});
			showNotification("Evaluate success!", "success");
			onSuccess();
		} catch (error) {
			console.error(error);
			showNotification("Failed to submit review. Please try again.", "error");
		}
	};

	return <CommentInput onSubmit={handlePostReview} />;
}
