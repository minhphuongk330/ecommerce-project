"use client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

export type Period = "yearly" | "monthly" | "weekly";

interface PeriodDropdownProps {
	period: Period;
	onPeriodChange: (newPeriod: Period) => void;
}

export default function PeriodDropdown({ period, onPeriodChange }: PeriodDropdownProps) {
	const [showDropdown, setShowDropdown] = useState(false);

	return (
		<div className="relative z-20">
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

			{showDropdown && (
				<div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
					{(["weekly", "monthly", "yearly"] as Period[]).map(p => (
						<button
							key={p}
							onClick={() => {
								onPeriodChange(p);
								setShowDropdown(false);
							}}
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
	);
}
