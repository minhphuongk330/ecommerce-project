"use client";
import { useState } from "react";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { AccordionProps } from "~/types/catalog";

const FiltersAccordion = ({ title, children, defaultOpen = false }: AccordionProps) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className="w-full flex flex-col border-b-[0.5px] border-[#9F9F9F]">
			<div
				onClick={() => setIsOpen(!isOpen)}
				className="flex flex-row justify-between items-center py-[12px] h-[48px] cursor-pointer select-none"
			>
				<span className="text-black font-medium text-lg border-bottom">{title}</span>
				{isOpen
					? <KeyboardArrowUp sx={{ color: "#000", fontSize: 24 }} />
					: <KeyboardArrowDown sx={{ color: "#000", fontSize: 24 }} />
				}
			</div>
			{isOpen && <div className="flex flex-col gap-[16px] pb-[24px]">{children}</div>}
		</div>
	);
};

export default FiltersAccordion;
