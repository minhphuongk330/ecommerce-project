"use client";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import React, { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import PeriodDropdown, { Period } from "~/components/atoms/PeriodDropdown";

export interface StatCardProps {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	color: string;
	percentage?: number;
	chartData?: Array<{ name?: string; value: number }>;
	onPeriodChange?: (period: "weekly" | "monthly" | "yearly") => void;
}

const CustomTooltip = ({ active, payload, color }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white px-3 py-2 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col gap-1 z-50 relative">
				{payload[0].payload.name && (
					<span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
						{payload[0].payload.name}
					</span>
				)}
				<div className="flex items-center gap-2">
					<span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
					<span className="text-gray-800 font-bold text-sm">{payload[0].value}</span>
				</div>
			</div>
		);
	}
	return null;
};

const StatCard = ({ title, value, icon, color, percentage = 0, chartData = [], onPeriodChange }: StatCardProps) => {
	const [period, setPeriod] = useState<Period>("weekly");
	const handlePeriodChange = (newPeriod: Period) => {
		setPeriod(newPeriod);
		onPeriodChange?.(newPeriod);
	};
	const isPositive = percentage >= 0;
	const gradientId = `gradient-${title.replace(/\s+/g, "-").toLowerCase()}`;
	const colorMap: Record<string, string> = {
		"bg-teal-500": "#14B8A6",
		"bg-orange-500": "#F97316",
		"bg-blue-500": "#3B82F6",
		"bg-rose-500": "#EF4444",
	};

	const gradientColor = colorMap[color] || "#3B82F6";
	return (
		<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between">
			<div className="flex items-start justify-between mb-4 relative z-10">
				<div
					className="p-3 rounded-lg text-white flex items-center justify-center w-14 h-14 flex-shrink-0"
					style={{ backgroundColor: gradientColor }}
				>
					{icon}
				</div>
				<PeriodDropdown period={period} onPeriodChange={handlePeriodChange} />
			</div>
			<div className="mb-2">
				<p className="text-gray-600 text-xs font-semibold tracking-wide uppercase mb-1">{title}</p>
			</div>
			<div className="flex items-center gap-3 mb-4">
				<h3 className="text-3xl font-bold text-gray-900 leading-none">{value}</h3>
				<div className="flex items-center gap-1">
					{isPositive ? (
						<TrendingUpIcon sx={{ fontSize: "18px", color: "#14B8A6" }} />
					) : (
						<TrendingDownIcon sx={{ fontSize: "18px", color: "#EF4444" }} />
					)}
					<span className={`text-sm font-bold ${isPositive ? "text-teal-500" : "text-red-500"}`}>
						{Math.abs(percentage).toFixed(2)}%
					</span>
				</div>
			</div>

			{chartData.length > 0 && (
				<div className="h-16 -mx-6 px-6 mt-2 relative z-0">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={chartData}>
							<defs>
								<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
									<stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
								</linearGradient>
							</defs>
							<Tooltip
								content={<CustomTooltip color={gradientColor} />}
								cursor={{ stroke: gradientColor, strokeWidth: 1, strokeDasharray: "3 3" }}
							/>
							<Area
								type="monotone"
								dataKey="value"
								stroke={gradientColor}
								strokeWidth={2}
								fill={`url(#${gradientId})`}
								dot={false}
								activeDot={{ r: 4, fill: gradientColor, stroke: "#fff", strokeWidth: 2 }}
								isAnimationActive={false}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	);
};

export default StatCard;
