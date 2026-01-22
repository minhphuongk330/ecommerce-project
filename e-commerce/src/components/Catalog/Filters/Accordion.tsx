"use client";
import React, { useState, useMemo } from "react";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { AccordionProps } from "~/types/catalog";

const FiltersAccordion: React.FC<AccordionProps> = ({ title, children, defaultOpen = false }) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const ArrowIcon = useMemo(() => {
		const Icon = isOpen ? KeyboardArrowUp : KeyboardArrowDown;
		return <Icon sx={{ color: "#000", fontSize: 24 }} />;
	}, [isOpen]);

	return (
		<div className="w-full flex flex-col border-b-[0.5px] border-[#9F9F9F]">
			<div
				onClick={() => setIsOpen(!isOpen)}
				className="flex flex-row justify-between items-center py-[12px] h-[48px] cursor-pointer select-none"
			>
				<span className="text-black font-medium text-lg border-bottom">{title}</span>
				{ArrowIcon}
			</div>
			{isOpen && <div className="flex flex-col gap-[16px] pb-[24px]">{children}</div>}
		</div>
	);
};

export default FiltersAccordion;
