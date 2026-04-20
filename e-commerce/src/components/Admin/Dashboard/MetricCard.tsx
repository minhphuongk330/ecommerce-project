"use client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React, { useMemo, useState } from "react";
import StatCard from "~/components/atoms/StatCard";
import { formatPrice } from "~/utils/format";
import {
	MetricItem,
	TimePeriod,
	calculatePercentageChange,
	generateRealChartData,
	getDateRangeByPeriod,
} from "~/utils/admin/dashboardUtils";

dayjs.extend(isBetween);

export type { TimePeriod };

interface DashboardMetricCardProps {
	title: string;
	icon: React.ReactNode;
	color: string;
	data: MetricItem[];
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

		return {
			stats: { current, previous },
			chartData: generateRealChartData(data, range.startDate, range.endDate, period, type, statusFilter),
		};
	}, [period, data, type, statusFilter]);

	const displayValue = type === "revenue" ? formatPrice(stats.current) : stats.current;

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
