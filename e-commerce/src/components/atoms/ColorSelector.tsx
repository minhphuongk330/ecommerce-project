"use client";
import React from "react";
import { ColorSelectorProps } from "~/types/component";

const ColorSelector: React.FC<ColorSelectorProps> = ({ colors, selectedColor, onSelect, label, className = "" }) => {
	return (
		<div className={`flex flex-row items-center gap-[16px] ${className}`}>
			{label && <span className="text-base text-gray-500">{label}</span>}

			<div className="flex gap-[8px]">
				{colors.map(color => (
					<div
						key={color.name}
						onClick={() => onSelect(color.name)}
						className="w-[32px] h-[32px] rounded-full cursor-pointer relative flex items-center justify-center transition-transform hover:scale-110"
						style={{ backgroundColor: color.hex }}
						title={color.name}
					>
						{selectedColor === color.name && (
							<div className="w-full h-full rounded-full border-2 border-white ring-1 ring-black" />
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default ColorSelector;
