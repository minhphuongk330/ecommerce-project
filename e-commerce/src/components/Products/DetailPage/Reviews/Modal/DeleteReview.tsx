"use client";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { useState } from "react";
import ConfirmationModal from "~/components/atoms/Confirmation";
import { useNotification } from "~/contexts/Notification";
import { reviewService } from "~/services/review";

interface DeleteReviewProps {
	id: number;
	onSuccess: () => void;
}

export default function DeleteReview({ id, onSuccess }: DeleteReviewProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { showNotification } = useNotification();

	const handleDelete = async () => {
		try {
			await reviewService.deleteReview(id);
			showNotification("Review deleted.", "success");
			setIsOpen(false);
			onSuccess();
		} catch (error) {
			console.error(error);
			showNotification("Delete failed.", "error");
		}
	};

	return (
		<>
			<button
				onClick={e => {
					e.stopPropagation();
					setIsOpen(true);
				}}
				className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
				title="Delete review"
			>
				<DeleteOutline fontSize="small" />
			</button>

			<ConfirmationModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Delete Review"
				message="Are you sure you want to delete this review? This action cannot be undone."
				onConfirm={handleDelete}
			/>
		</>
	);
}
