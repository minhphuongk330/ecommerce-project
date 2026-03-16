"use client";
import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import StatCard from "~/components/atoms/StatCard";

dayjs.extend(isBetween);

export type TimePeriod = "weekly" | "monthly" | "yearly";

export interface DateRangeInfo {
	startDate: dayjs.Dayjs;
	endDate: dayjs.Dayjs;
	previousStartDate: dayjs.Dayjs;
	previousEndDate: dayjs.Dayjs;
}

export function getDateRangeByPeriod(period: TimePeriod): DateRangeInfo {
	const endDate = dayjs().endOf("day");
	let startDate: dayjs.Dayjs;
	let previousStartDate: dayjs.Dayjs;
	let previousEndDate: dayjs.Dayjs;

	switch (period) {
		case "weekly":
			startDate = dayjs().subtract(6, "day").startOf("day");
			previousEndDate = startDate.subtract(1, "day").endOf("day");
			previousStartDate = previousEndDate.subtract(6, "day").startOf("day");
			break;
		case "monthly":
			startDate = dayjs().startOf("month");
			previousEndDate = startDate.subtract(1, "day").endOf("day");
			previousStartDate = previousEndDate.subtract(1, "month").startOf("month");
			break;
		case "yearly":
			startDate = dayjs().startOf("year");
			previousEndDate = startDate.subtract(1, "day").endOf("day");
			previousStartDate = previousEndDate.subtract(1, "year").startOf("year");
			break;
	}
	return { startDate, endDate, previousStartDate, previousEndDate };
}

function calculatePercentageChange(current: number, previous: number): number {
	if (previous === 0) return current > 0 ? 100 : 0;
	return Math.round(((current - previous) / previous) * 100);
}

function generateRealChartData(
	items: any[],
	startDate: dayjs.Dayjs,
	endDate: dayjs.Dayjs,
	period: TimePeriod,
	type: "revenue" | "count",
	statusFilter?: string,
) {
	const dataPoints: { name: string; value: number; _timestamp: number }[] = [];
	let current = startDate.clone();
	let stepUnit: dayjs.ManipulateType = period === "yearly" ? "month" : "day";
	let formatString = period === "yearly" ? "MMM YYYY" : "DD/MM";

	while (current.isBefore(endDate) || current.isSame(endDate, stepUnit)) {
		dataPoints.push({
			name: current.format(formatString),
			value: 0,
			_timestamp: current.startOf(stepUnit).valueOf(),
		});
		current = current.add(1, stepUnit);
	}

	items.forEach(item => {
		if (statusFilter && item.status?.toLowerCase() !== statusFilter.toLowerCase()) return;

		const itemDate = dayjs(item.createdAt);
		if (itemDate.isBetween(startDate, endDate, null, "[]")) {
			const targetTime = itemDate.startOf(stepUnit).valueOf();
			const bucketIndex = dataPoints.findIndex(dp => dp._timestamp === targetTime);

			if (bucketIndex !== -1) {
				if (type === "revenue") {
					const amount = parseFloat(String(item.totalAmount)) || 0;
					dataPoints[bucketIndex].value += amount;
				} else {
					dataPoints[bucketIndex].value += 1;
				}
			}
		}
	});

	return dataPoints.map(dp => ({
		name: dp.name,
		value: type === "revenue" ? Number(dp.value.toFixed(2)) : dp.value,
	}));
}

interface DashboardMetricCardProps {
	title: string;
	icon: React.ReactNode;
	color: string;
	data: any[];
	type: "revenue" | "count";
	statusFilter?: string;
}

export default function DashboardMetricCard({
	title,
	icon,
	color,
	data,
	type,
	statusFilter,
}: DashboardMetricCardProps) {
	const [period, setPeriod] = useState<TimePeriod>("weekly");

	const { stats, chartData } = useMemo(() => {
		const range = getDateRangeByPeriod(period);

		const currentItems = data.filter(item => {
			if (statusFilter && item.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
			return dayjs(item.createdAt).isBetween(range.startDate, range.endDate, null, "[]");
		});

		const prevItems = data.filter(item => {
			if (statusFilter && item.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
			return dayjs(item.createdAt).isBetween(range.previousStartDate, range.previousEndDate, null, "[]");
		});

		const current =
			type === "revenue"
				? currentItems.reduce((s, o) => s + (parseFloat(String(o.totalAmount)) || 0), 0)
				: currentItems.length;

		const previous =
			type === "revenue"
				? prevItems.reduce((s, o) => s + (parseFloat(String(o.totalAmount)) || 0), 0)
				: prevItems.length;

		const chart = generateRealChartData(data, range.startDate, range.endDate, period, type, statusFilter);

		return {
			stats: { current, previous },
			chartData: chart,
		};
	}, [period, data, type, statusFilter]);

	const displayValue =
		type === "revenue" ? `$${stats.current.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : stats.current;

	return (
		<StatCard
			title={title}
			value={displayValue}
			icon={icon}
			color={color}
			percentage={calculatePercentageChange(stats.current, stats.previous)}
			chartData={chartData}
			onPeriodChange={setPeriod}
		/>
	);
}
