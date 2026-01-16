"use client";
import StarRating from "~/components/atoms/StarRating";
import { ReviewStats } from "~/types/review";
import { RATING_LABELS, STAR_ORDER } from "~/utils/review";
interface RatingRowProps {
	label: string;
	count: number;
	percent: number;
}

const RatingRow = ({ label, count, percent }: RatingRowProps) => (
	<div className="flex items-center gap-4 text-sm">
		<span className="font-medium w-[110px] text-black text-left">{label}</span>

		<div className="flex-1 h-[8px] bg-[#E6E6E6] rounded-full overflow-hidden">
			<div
				className="h-full bg-[#FFB547] rounded-full transition-all duration-500 ease-out"
				style={{ width: `${percent}%` }}
			/>
		</div>

		<span className="text-gray-400 w-[30px] text-right">{count}</span>
	</div>
);

interface ReviewSummaryProps {
	stats: ReviewStats;
}

export default function ReviewSummary({ stats }: ReviewSummaryProps) {
	return (
		<div className="w-full flex flex-col md:flex-row gap-[60px]">
			<div className="min-w-[184px] h-[192px] bg-[#FAFAFA] rounded-[25px] p-[32px] flex flex-col items-center justify-center gap-[16px] shadow-sm border border-transparent">
				<div className="flex flex-col items-center">
					<span className="font-bold text-black leading-none text-[56px]">{stats.averageRating}</span>
					<span className="text-gray-400 text-sm mt-1">of {stats.totalReviews} reviews</span>
				</div>
				<StarRating value={stats.averageRating} precision={0.1} readOnly fontSize="28px" />
			</div>

			<div className="flex-1 flex flex-col justify-center gap-[24px]">
				{STAR_ORDER.map(star => {
					const count = stats.distribution[star as unknown as number] || 0;
					const percent = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

					return <RatingRow key={star} label={RATING_LABELS[star]} count={count} percent={percent} />;
				})}
			</div>
		</div>
	);
}
