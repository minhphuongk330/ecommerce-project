"use client";
import React from "react";
import { Add, Remove } from "@mui/icons-material";
import { QuantitySelectorProps } from "~/types/component";
import CommonIconButton from "./IconButton";

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onIncrease, onDecrease, className = "" }) => {
	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<CommonIconButton
				onClick={onDecrease}
				className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
				icon={<Remove sx={{ fontSize: 24 }} />}
			></CommonIconButton>

			<span className="min-w-[24px] text-center text-base font-medium text-black select-none">{quantity}</span>

			<CommonIconButton
				onClick={onIncrease}
				className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
				icon={<Add sx={{ fontSize: 24 }} />}
			></CommonIconButton>
		</div>
	);
};

export default QuantitySelector;
