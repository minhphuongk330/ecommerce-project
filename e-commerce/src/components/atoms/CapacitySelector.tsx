"use client";
import React from "react";
import { CapacitySelectorProps } from "~/types/component";

const CapacitySelector: React.FC<CapacitySelectorProps> = ({
	capacities,
	selectedCapacity,
	onSelect,
	className = "",
}) => {
	return (
		<div className={`flex flex-wrap gap-[16px] ${className}`}>
			{capacities.map(cap => (
				<div
					key={cap}
					onClick={() => onSelect(cap)}
					className={`
                        w-[122px] h-[48px] rounded-[8px] border flex items-center justify-center cursor-pointer text-sm font-medium transition-colors
                        ${
													selectedCapacity === cap
														? "border-black text-black"
														: "border-[#D9D9D9] text-[#6F6F6F] hover:border-black"
												}
                    `}
				>
					{cap}
				</div>
			))}
		</div>
	);
};

export default CapacitySelector;
