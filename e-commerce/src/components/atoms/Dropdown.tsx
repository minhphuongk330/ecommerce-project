"use client";
import React from "react";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

export interface DropdownOption {
	value: string | number;
	label: string;
}

interface DropdownProps {
	value: string | number;
	options: DropdownOption[];
	onChange: (value: string) => void;
	className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ value, options, onChange, className = "" }) => {
	return (
		<div className={`relative w-[256px] min-w-[140px] h-[40px] ${className}`}>
			<select
				className="w-full h-full appearance-none bg-white border border-[#D9D9D9] rounded-[8px] px-[16px] text-base font-medium text-black cursor-pointer outline-none focus:border-black pr-10"
				value={value}
				onChange={e => onChange(e.target.value)}
			>
				{options.map(option => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>

			<div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
				<KeyboardArrowDown sx={{ fontSize: 24, color: "#5C5C5C" }} />
			</div>
		</div>
	);
};

export default Dropdown;
