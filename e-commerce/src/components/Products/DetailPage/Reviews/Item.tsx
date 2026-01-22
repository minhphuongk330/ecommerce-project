"use client";
import dayjs from "dayjs";
import { memo } from "react";
import StarRating from "~/components/atoms/StarRating";
import UserAvatar from "~/components/atoms/UserAvatar";
import { Review } from "~/types/review";
import { getDisplayName } from "~/utils/format";
import DeleteReview from "./Modal/DeleteReview";
import UpdateReview from "./Modal/UpdateReview";

interface ReviewItemProps {
	data: Review;
	currentUserId: number | null;
	onRefresh: () => void;
}

const ReviewItem = memo(({ data, currentUserId, onRefresh }: ReviewItemProps) => {
	const displayName = getDisplayName(data.customer);
	const isOwner = String(currentUserId) === String(data.customerId);

	return (
		<div className="bg-white p-6 rounded-[16px] mb-4 shadow-sm border border-transparent group hover:border-gray-200 transition-colors">
			<div className="flex justify-between items-start mb-3">
				<div className="flex items-start gap-4">
					<UserAvatar alt={displayName} size={48} />
					<div>
						<h4 className="font-bold text-base text-black">{displayName}</h4>
						<StarRating value={data.rating} readOnly fontSize="18px" />
					</div>
				</div>
				<div className="flex flex-col items-end gap-1">
					<span className="text-gray-400 text-sm">{dayjs(data.createdAt).format("D MMMM YYYY")}</span>

					{isOwner && (
						<div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
							<UpdateReview data={data} onSuccess={onRefresh} />
							<DeleteReview id={data.id} onSuccess={onRefresh} />
						</div>
					)}
				</div>
			</div>
			<p className="text-gray-600 text-sm leading-relaxed mb-4 mt-1 whitespace-pre-line">{data.comment}</p>
		</div>
	);
});

export default ReviewItem;
