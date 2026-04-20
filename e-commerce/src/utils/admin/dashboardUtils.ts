import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export type TimePeriod = "weekly" | "monthly" | "yearly";

export interface MetricItem {
	createdAt: string;
	totalAmount?: number | string;
	status?: string;
}

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

export function calculatePercentageChange(current: number, previous: number): number {
	if (previous === 0) return current > 0 ? 100 : 0;
	return Math.round(((current - previous) / previous) * 100);
}

export function generateRealChartData(
	items: MetricItem[],
	startDate: dayjs.Dayjs,
	endDate: dayjs.Dayjs,
	period: TimePeriod,
	type: "revenue" | "count",
	statusFilter?: string,
) {
	const stepUnit: dayjs.ManipulateType = period === "yearly" ? "month" : "day";
	const formatString = period === "yearly" ? "MMM YYYY" : "DD/MM";

	const dataPoints: { name: string; value: number; _timestamp: number }[] = [];
	let current = startDate.clone();

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
		if (!itemDate.isBetween(startDate, endDate, null, "[]")) return;

		const targetTime = itemDate.startOf(stepUnit).valueOf();
		const bucketIndex = dataPoints.findIndex(dp => dp._timestamp === targetTime);

		if (bucketIndex !== -1) {
			if (type === "revenue") {
				dataPoints[bucketIndex].value += parseFloat(String(item.totalAmount)) || 0;
			} else {
				dataPoints[bucketIndex].value += 1;
			}
		}
	});

	return dataPoints.map(dp => ({
		name: dp.name,
		value: type === "revenue" ? Number(dp.value.toFixed(2)) : dp.value,
	}));
}
