"use client";
import { EditOutlined } from "@mui/icons-material";
import { useState } from "react";
import BaseDialog from "~/components/atoms/Dialog";
import { useNotification } from "~/contexts/Notification";
import { reviewService } from "~/services/review";
import { Review } from "~/types/review";
import ExpandedForm from "../Comment/ExpandedForm";

interface UpdateReviewProps {
	data: Review;
	onSuccess: () => void;
}

export default function UpdateReview({ data, onSuccess }: UpdateReviewProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [editRating, setEditRating] = useState<number | null>(data.rating);
	const [editContent, setEditContent] = useState(data.comment);
	const [isUpdating, setIsUpdating] = useState(false);
	const { showNotification } = useNotification();

	const handleOpen = (e: React.MouseEvent) => {
		e.stopPropagation();
		setEditRating(data.rating);
		setEditContent(data.comment);
		setIsOpen(true);
	};

	const handleSubmit = async () => {
		if (!editRating || editRating === 0) {
			showNotification("Please select a star rating", "warning");
			return;
		}
		try {
			setIsUpdating(true);
			await reviewService.updateReview(data.id, {
				rating: editRating as number,
				comment: editContent,
			});

			showNotification("Update successful", "success");
			setIsOpen(false);
			onSuccess();
		} catch (error) {
			console.error(error);
			showNotification("Update failed", "error");
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<>
			<button
				onClick={handleOpen}
				className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
				title="Edit review"
			>
				<EditOutlined fontSize="small" />
			</button>

			<BaseDialog
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Update Review"
				showCloseIcon={true}
				width={600}
			>
				<ExpandedForm
					user={data.customer}
					rating={editRating}
					content={editContent}
					onRatingChange={setEditRating}
					onContentChange={setEditContent}
					onCancel={() => setIsOpen(false)}
					onSubmit={handleSubmit}
					isSubmitting={isUpdating}
					submitLabel="Update"
				/>
			</BaseDialog>
		</>
	);
}
