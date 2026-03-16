import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

type TimePeriod = "weekly" | "monthly" | "yearly";

interface DateRangeInfo {
	startDate: dayjs.Dayjs;
	endDate: dayjs.Dayjs;
	previousStartDate: dayjs.Dayjs;
	previousEndDate: dayjs.Dayjs;
}

function getDateRangeByPeriod(period: TimePeriod): DateRangeInfo {
	const endDate = dayjs().endOf("day");
	let startDate;
	let previousStartDate;
	let previousEndDate;

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

function generateRealChartData(
	items: any[],
	startDate: dayjs.Dayjs,
	endDate: dayjs.Dayjs,
	period: TimePeriod,
	type: "revenue" | "count",
	statusFilter?: string,
) {
	const data: any[] = [];
	let current = startDate.clone();

	const step = period === "yearly" ? "month" : "day";
	const format = period === "yearly" ? "MMM YYYY" : "DD/MM";

	while (current.isBefore(endDate) || current.isSame(endDate, step)) {
		data.push({
			name: current.format(format),
			value: 0,
			time: current.startOf(step).valueOf(),
		});
		current = current.add(1, step);
	}

	items.forEach(item => {
		if (statusFilter && item.status?.toLowerCase() !== statusFilter) return;

		const itemDate = dayjs(item.createdAt);

		if (itemDate.isBetween(startDate, endDate, null, "[]")) {
			const bucket = data.find(d => d.time === itemDate.startOf(step).valueOf());

			if (bucket) {
				if (type === "revenue") {
					bucket.value += Number(item.totalAmount) || 0;
				} else {
					bucket.value += 1;
				}
			}
		}
	});

	return data.map(d => ({
		name: d.name,
		value: type === "revenue" ? Number(d.value.toFixed(2)) : d.value,
	}));
}

export function useStatCard({ items, period, type, statusFilter }: any) {
	const [stats, setStats] = useState({ current: 0, previous: 0 });
	const [chartData, setChartData] = useState<any[]>([]);

	useEffect(() => {
		const range = getDateRangeByPeriod(period);

		const currentItems = items.filter((i: any) =>
			dayjs(i.createdAt).isBetween(range.startDate, range.endDate, null, "[]"),
		);

		const previousItems = items.filter((i: any) =>
			dayjs(i.createdAt).isBetween(range.previousStartDate, range.previousEndDate, null, "[]"),
		);

		const current =
			type === "revenue"
				? currentItems.reduce((s: number, i: any) => s + Number(i.totalAmount || 0), 0)
				: currentItems.length;

		const previous =
			type === "revenue"
				? previousItems.reduce((s: number, i: any) => s + Number(i.totalAmount || 0), 0)
				: previousItems.length;

		setStats({ current, previous });

		setChartData(generateRealChartData(items, range.startDate, range.endDate, period, type, statusFilter));
	}, [items, period, type, statusFilter]);

	return { stats, chartData };
}
