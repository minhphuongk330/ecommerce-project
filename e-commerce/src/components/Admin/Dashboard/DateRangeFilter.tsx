"use client";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

export interface DateRange {
	startDate: Dayjs;
	endDate: Dayjs;
}

interface DateRangeFilterProps {
	onDateChange: (range: DateRange) => void;
}

const PRESET_RANGES = [
	{ label: "Last 7 days", value: "7days" },
	{ label: "Last 30 days", value: "30days" },
	{ label: "This month", value: "thisMonth" },
	{ label: "This year", value: "thisYear" },
];

export default function DateRangeFilter({ onDateChange }: DateRangeFilterProps) {
	const today = dayjs();
	const [selectedRange, setSelectedRange] = useState("7days");

	const getDateRange = (range: string): DateRange => {
		switch (range) {
			case "today":
				return { startDate: today.startOf("day"), endDate: today.endOf("day") };
			case "yesterday":
				return {
					startDate: today.subtract(1, "day").startOf("day"),
					endDate: today.subtract(1, "day").endOf("day"),
				};
			case "7days":
				return { startDate: today.subtract(7, "day").startOf("day"), endDate: today.endOf("day") };
			case "30days":
				return { startDate: today.subtract(30, "day").startOf("day"), endDate: today.endOf("day") };
			case "thisMonth":
				return { startDate: today.startOf("month"), endDate: today.endOf("month") };
			case "thisYear":
				return { startDate: today.startOf("year"), endDate: today.endOf("year") };
			default:
				return { startDate: today.subtract(7, "day").startOf("day"), endDate: today.endOf("day") };
		}
	};

	const handleRangeSelect = (range: string) => {
		setSelectedRange(range);
		onDateChange(getDateRange(range));
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-4 mb-6">
			<div className="flex items-center gap-2 mb-4">
				<CalendarMonthOutlined className="text-gray-600" />
				<h3 className="text-lg font-semibold text-gray-800">Select Date Range</h3>
			</div>
			<div className="flex flex-wrap gap-2">
				{PRESET_RANGES.map(range => (
					<button
						key={range.value}
						onClick={() => handleRangeSelect(range.value)}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							selectedRange === range.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
					>
						{range.label}
					</button>
				))}
			</div>
		</div>
	);
}
