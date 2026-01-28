"use client";
import React, { useState, useRef, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface Option {
	label: string;
	value: string | number;
}

interface SortSelectMobileProps {
	options: Option[];
	value: string | number;
	onChange: (value: string) => void;
}

const SortSelectMobile: React.FC<SortSelectMobileProps> = ({ options, value, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const selectedLabel = options.find(opt => opt.value === value)?.label || "Select";

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (val: string | number) => {
		onChange(String(val));
		setIsOpen(false);
	};

	return (
		<div className="relative w-full md:hidden mb-4" ref={containerRef}>
			<div
				onClick={() => setIsOpen(!isOpen)}
				className={`
            flex items-center justify-between 
            w-full px-4 py-3 
            bg-white border rounded-lg cursor-pointer shadow-sm
            ${isOpen ? "border-black ring-1 ring-black" : "border-gray-300"}
        `}
			>
				<span className="text-sm font-medium text-black">{selectedLabel}</span>
				<KeyboardArrowDownIcon
					fontSize="small"
					className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
				/>
			</div>

			{isOpen && (
				<div className="absolute top-[calc(100%+8px)] left-0 z-[99] w-full bg-white border border-gray-100 rounded-lg shadow-2xl animate-fade-in-down">
					<ul className="py-2 max-h-[250px] overflow-auto">
						{options.map(option => (
							<li
								key={option.value}
								onClick={() => handleSelect(option.value)}
								className={`
                    px-4 py-3 text-sm cursor-pointer border-b last:border-0 border-gray-50
                    ${option.value === value ? "bg-gray-50 font-bold text-black" : "text-gray-600 hover:bg-gray-50"}
                `}
							>
								{option.label}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default SortSelectMobile;
