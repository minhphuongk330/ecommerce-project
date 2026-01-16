"use client";
import React from "react";
import { IconButton as MuiIconButton } from "@mui/material";
import { CommonIconButtonProps } from "~/types/common";

const CommonIconButton: React.FC<CommonIconButtonProps> = ({ icon, className = "", sx, ...rest }) => {
	return (
		<MuiIconButton
			className={className}
			sx={{
				padding: 0,
				color: "inherit",
				...sx,
			}}
			{...rest}
		>
			{icon}
		</MuiIconButton>
	);
};

export default CommonIconButton;
