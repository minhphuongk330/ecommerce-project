"use client";
import React from "react";
import { CategoryCardProps } from "~/types/category";
import { BrokenImageOutlined } from "@mui/icons-material";

const CategoryCard: React.FC<CategoryCardProps> = ({ name, IconComponent, thumbnailUrl }) => {
	return (
		<div className="flex-shrink-0 w-[160px] h-[128px] bg-[#EDEDED] rounded-[15px] gap-[8px] flex flex-col items-center justify-center cursor-pointer transition duration-300 hover:shadow-lg hover:bg-white py-[24px]">
			{thumbnailUrl ? (
				<img src={thumbnailUrl} alt={name} className="w-[30px] h-[30px] object-contain mb-0" />
			) : IconComponent ? (
				<IconComponent className="!text-3xl text-black mb-0" />
			) : (
				<BrokenImageOutlined className="!text-3xl text-gray-400 mb-0" />
			)}

			<p className="text-sm font-medium text-gray-800 text-center">{name}</p>
		</div>
	);
};

export default CategoryCard;
