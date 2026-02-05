"use client";
import React, { memo, useMemo } from "react";
import { ShippingMethod } from "~/types/shipping";
import { calculateSchedulePrice, calculateShippingDays, getPriceLabel } from "~/utils/shippingCalculator";

interface ShippingListItemProps {
	method: ShippingMethod;
	isSelected: boolean;
	scheduledDate: string;
	minDate: string;
	onDateChange: (date: string) => void;
	onSelectMethod: () => void;
}

const ShippingListItem: React.FC<ShippingListItemProps> = ({
	method,
	isSelected,
	scheduledDate,
	minDate,
	onDateChange,
	onSelectMethod,
}) => {
	const isSchedule = method.type === "schedule";

	const dynamicPrice = useMemo(() => {
		if (!isSchedule || !scheduledDate) return 0;
		const days = calculateShippingDays(scheduledDate);
		return calculateSchedulePrice(days);
	}, [scheduledDate, isSchedule]);

	const dynamicLabel = useMemo(() => {
		if (!isSchedule || !scheduledDate) return "SCHEDULE";
		const days = calculateShippingDays(scheduledDate);
		return getPriceLabel(days);
	}, [scheduledDate, isSchedule]);

	const containerClass = useMemo(
		() => (isSelected ? "border-black bg-white shadow-sm" : "border-[#EBEBEB] bg-white hover:border-gray-300"),
		[isSelected],
	);

	const radioClass = useMemo(() => (isSelected ? "border-black" : "border-[#D1D1D1]"), [isSelected]);
	const textColorClass = useMemo(() => (isSelected ? "text-black" : "text-[#717171]"), [isSelected]);
	const titleWeightClass = useMemo(() => (isSelected ? "font-bold" : "font-normal"), [isSelected]);

	const priceLabel = useMemo(
		() =>
			isSchedule
				? scheduledDate
					? `$${dynamicPrice.toFixed(2)}`
					: "SCHEDULE"
				: method.price === 0
					? "FREE"
					: `$${method.price.toFixed(2)}`,
		[isSchedule, scheduledDate, dynamicPrice, method.price],
	);

	const nameLabel = useMemo(() => (isSchedule ? method.description : method.name), [isSchedule, method]);

	return (
		<div
			onClick={onSelectMethod}
			className={`relative w-full min-h-[72px] md:h-[72px] flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-[24px] py-3 md:py-0 rounded-[11px] border cursor-pointer transition-all duration-200 ${containerClass} gap-3 sm:gap-0`}
		>
			<div className="flex items-center gap-3 md:gap-[16px] flex-1 w-full sm:w-auto">
				<div
					className={`w-[18px] md:w-[20px] h-[18px] md:h-[20px] rounded-full border flex items-center justify-center flex-shrink-0 ${radioClass}`}
				>
					{isSelected && <div className="w-[9px] md:w-[10px] h-[9px] md:h-[10px] rounded-full bg-black" />}
				</div>

				<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1 min-w-0">
					<span
						className={`text-sm md:text-base uppercase transition-all ${textColorClass} ${titleWeightClass} whitespace-nowrap`}
					>
						{priceLabel}
					</span>
					<span className={`text-sm md:text-base font-normal transition-all ${textColorClass} break-words`}>
						{nameLabel}
					</span>
				</div>
			</div>

			<div className="text-left sm:text-right w-full sm:w-auto self-start sm:self-auto">
				{isSchedule ? (
					<div onClick={e => e.stopPropagation()} className="w-full sm:w-auto">
						<input
							type="date"
							min={minDate}
							value={scheduledDate}
							onChange={e => onDateChange(e.target.value)}
							disabled={!isSelected}
							className={`w-full sm:w-auto text-xs md:text-sm font-medium outline-none border-b focus:border-black bg-transparent py-1 text-left sm:text-right transition-colors ${
								isSelected ? "text-black border-gray-300" : "text-gray-300 border-transparent cursor-not-allowed"
							}`}
						/>
					</div>
				) : (
					<span className={`text-sm md:text-base transition-all ${textColorClass} ${titleWeightClass}`}>
						{method.estimatedDate}
					</span>
				)}
			</div>
		</div>
	);
};

export default memo(ShippingListItem);
