"use client";
import React from "react";
import { IconButton } from "@mui/material";
import { IconProps } from "~/types/component";

const Icon: React.FC<IconProps> = ({ icon, onClick, className }) => {
	return (
		<IconButton onClick={onClick} className={`!p-0 !w-8 !h-8 !min-w-0 text-black ${className}`}>
			{icon}
		</IconButton>
	);
};

export default Icon;
