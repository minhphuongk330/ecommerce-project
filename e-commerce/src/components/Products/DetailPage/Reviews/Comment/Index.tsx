"use client";
import { useState } from "react";
import { useAuthStore } from "~/stores/useAuth";
import { useNotification } from "~/contexts/Notification";
import CollapsedView from "./CollapsedView";
import ExpandedForm from "./ExpandedForm";

interface CommentInputProps {
	onSubmit: (rating: number, content: string) => Promise<void>;
}

export default function CommentInput({ onSubmit }: CommentInputProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [rating, setRating] = useState<number | null>(0);
	const [content, setContent] = useState("");
	const user = useAuthStore(state => state.user);
	const { showNotification } = useNotification();

	const handleExpand = () => {
		if (!user) {
			showNotification("Please log in to write a review.", "warning");
			return;
		}
		setIsExpanded(true);
	};

	const handleCancel = () => {
		setIsExpanded(false);
		setContent("");
		setRating(0);
	};

	const handleSubmit = async () => {
		if (!rating) {
			showNotification("Please select a star rating.", "warning");
			return;
		}
		await onSubmit(rating, content);
		handleCancel();
	};

	return (
		<div className="bg-white rounded-lg mb-10">
			{!isExpanded ? (
				<CollapsedView onClick={handleExpand} isAuth={!!user} />
			) : (
				<ExpandedForm
					user={user}
					rating={rating}
					content={content}
					onRatingChange={setRating}
					onContentChange={setContent}
					onCancel={handleCancel}
					onSubmit={handleSubmit}
				/>
			)}
		</div>
	);
}
