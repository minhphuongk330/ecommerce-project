"use client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import React, { useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export interface StatCardProps {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	color: string;
	percentage?: number;
	chartData?: Array<{ value: number }>;
	onPeriodChange?: (period: "weekly" | "monthly" | "yearly") => void;
}

const StatCard = ({ title, value, icon, color, percentage = 0, chartData = [], onPeriodChange }: StatCardProps) => {
	const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
	const [showDropdown, setShowDropdown] = useState(false);

	const handlePeriodChange = (newPeriod: "weekly" | "monthly" | "yearly") => {
		setPeriod(newPeriod);
		setShowDropdown(false);
		onPeriodChange?.(newPeriod);
	};

	const isPositive = percentage >= 0;
	const gradientId = `gradient-${title.replace(/\s+/g, "-").toLowerCase()}`;

	// Map Tailwind colors to hex values
	const colorMap: Record<string, string> = {
		"bg-teal-500": "#14B8A6",
		"bg-orange-500": "#F97316",
		"bg-blue-500": "#3B82F6",
		"bg-rose-500": "#F43F5E",
	};

	const gradientColor = colorMap[color] || "#3B82F6";

	return (
		<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
			{/* Header: Icon + Percentage */}
			<div className="flex items-start justify-between mb-4">
				<div className={`p-3 rounded-lg ${color} text-white flex items-center justify-center w-14 h-14 flex-shrink-0`}>
					{icon}
				</div>
				<div className="flex items-center gap-1">
					{isPositive ? (
						<TrendingUpIcon sx={{ fontSize: "18px", color: "#14B8A6" }} />
					) : (
						<TrendingDownIcon sx={{ fontSize: "18px", color: "#EF4444" }} />
					)}
					<span className={`text-sm font-bold ${isPositive ? "text-teal-500" : "text-red-500"}`}>
						{Math.abs(percentage)}%
					</span>
				</div>
			</div>

			{/* Title and Value */}
			<div className="mb-4">
				<p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">{title}</p>
				<h3 className="text-3xl font-bold text-gray-900">{value}</h3>
			</div>

			{/* Chart */}
			{chartData.length > 0 && (
				<div className="h-16 -mx-6 px-6 mb-4">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={chartData}>
							<defs>
								<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
									<stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
								</linearGradient>
							</defs>
							<Area
								type="monotone"
								dataKey="value"
								stroke={gradientColor}
								strokeWidth={2}
								fill={`url(#${gradientId})`}
								dot={false}
								isAnimationActive={false}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			)}

			{/* Dropdown Filter */}
			<div className="relative">
				<button
					onClick={() => setShowDropdown(!showDropdown)}
					className="flex items-center gap-1.5 text-gray-700 text-sm font-medium hover:text-gray-900 transition"
				>
					<span>{period.charAt(0).toUpperCase() + period.slice(1)}</span>
					<ExpandMoreIcon
						fontSize="small"
						sx={{
							fontSize: "18px",
							transition: "transform 0.2s",
							transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
						}}
					/>
				</button>

				{/* Dropdown Menu */}
				{showDropdown && (
					<div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
						{(["weekly", "monthly", "yearly"] as const).map(p => (
							<button
								key={p}
								onClick={() => handlePeriodChange(p)}
								className={`w-full text-left px-3 py-2 text-sm transition-colors ${
									period === p ? "bg-teal-50 text-teal-600 font-medium" : "text-gray-700 hover:bg-gray-50"
								}`}
							>
								{p.charAt(0).toUpperCase() + p.slice(1)}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default StatCard;
