"use client";
import React from "react";
import { TabsProps } from "~/types/common";

const CommonTabs: React.FC<TabsProps> = ({ options, value, onChange, className = "" }) => {
	return (
		<div className={`flex items-center gap-8 ${className}`}>
			{options.map(option => (
				<button
					key={option}
					onClick={() => onChange(option)}
					className={`
                        md:text-lg font-medium pb-1 border-b-2 transition-all duration-300
                        ${
													value === option
														? "text-black border-black"
														: "text-[#8B8B8B] border-transparent hover:text-black"
												}
                    `}
				>
					{option}
				</button>
			))}
		</div>
	);
};

export default CommonTabs;
