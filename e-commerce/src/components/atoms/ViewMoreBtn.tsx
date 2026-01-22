"use client";
import React from "react";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import { ViewMoreBtnProps } from "~/types/component";

const ViewMoreBtn: React.FC<ViewMoreBtnProps> = ({ isExpanded, onClick, className = "" }) => {
	return (
		<button
			onClick={onClick}
			className={`
                w-[216px] h-[48px] 
                flex items-center justify-center gap-2
                border border-[#545454] rounded-[8px] 
                text-black text-sm font-medium
                bg-white hover:bg-gray-50 transition-colors
                ${className}
            `}
		>
			{isExpanded ? "View Less" : "View More"}
			{isExpanded ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
		</button>
	);
};

export default ViewMoreBtn;
