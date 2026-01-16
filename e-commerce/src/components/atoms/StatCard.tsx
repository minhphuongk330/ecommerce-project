"use client";
import React from "react";

export interface StatCardProps {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	color: string;
	className?: string;
}

const StatCard = ({ title, value, icon, color, className = "" }: StatCardProps) => {
	return (
		<div
			className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center transition-transform hover:scale-105 ${className}`}
		>
			<div className={`p-4 rounded-full ${color} text-white mr-4 shadow-md flex items-center justify-center shrink-0`}>
				{icon}
			</div>
			<div>
				<p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</p>
				<h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
			</div>
		</div>
	);
};

export default StatCard;
