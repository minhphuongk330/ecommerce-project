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
			showNotification("Vui lòng đăng nhập để viết đánh giá.", "warning");
			return;
		}

		try {
			await reviewService.createReview({
				productId,
				customerId: Number(user.id),
				rating,
				comment: content,
			});
			showNotification("Đánh giá thành công!", "success");
			onSuccess();
		} catch (error) {
			console.error(error);
			showNotification("Gửi đánh giá thất bại. Vui lòng thử lại.", "error");
		}
	};

	return <CommentInput onSubmit={handlePostReview} />;
}
