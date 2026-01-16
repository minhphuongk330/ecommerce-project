import StarRating from "~/components/atoms/StarRating";
import StepButton from "~/components/checkout/Button";
import { User, UserProfile } from "~/types/auth";
import UserAvatar from "~/components/atoms/UserAvatar";
import { getDisplayName } from "~/utils/format";
import TextArea from "~/components/atoms/TextArea";
import { ReviewCustomer } from "~/types/review";

interface ExpandedFormProps {
	user: User | UserProfile | ReviewCustomer | null;
	rating: number | null;
	content: string;
	onRatingChange: (value: number | null) => void;
	onContentChange: (value: string) => void;
	onCancel: () => void;
	onSubmit: () => void;
	isSubmitting?: boolean;
	submitLabel?: string;
}

const ExpandedForm = ({
	user,
	rating,
	content,
	onRatingChange,
	onContentChange,
	onCancel,
	onSubmit,
	isSubmitting = false,
	submitLabel = "Post",
}: ExpandedFormProps) => {
	const displayName = getDisplayName(user);

	return (
		<div className="border border-[#E6E6E6] rounded-md p-4 animate-fade-in bg-white w-full">
			<div className="flex items-center gap-3 mb-4">
				<UserAvatar alt={displayName} size={40} />
				<div>
					<p className="font-bold text-sm text-black">{displayName}</p>
					<div className="flex items-center gap-2">
						<span className="text-xs text-gray-500">Rating:</span>
						<StarRating value={rating} onChange={newValue => onRatingChange(newValue)} />
					</div>
				</div>
			</div>

			<TextArea
				rows={4}
				placeholder="Write your review here..."
				value={content}
				onChange={e => onContentChange(e.target.value)}
				className="mb-4"
			/>

			<div className="flex justify-end">
				<div className="w-[250px]">
					<StepButton
						layout="full"
						primaryLabel={submitLabel}
						isLoading={isSubmitting}
						onPrimaryClick={onSubmit}
						secondaryLabel="Cancel"
						onSecondaryClick={onCancel}
						className="!h-[48px] text-sm"
					/>
				</div>
			</div>
		</div>
	);
};

export default ExpandedForm;
