"use client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useMemo, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import PeriodDropdown, { Period } from "~/components/atoms/PeriodDropdown";
import { AdminOrder } from "~/types/admin";
import { getDateRangeByPeriod } from "~/utils/admin/dashboardUtils";

dayjs.extend(isBetween);

const COLORS: Record<string, string> = {
	pending: "#FFA726",
	processing: "#FF9800",
	shipped: "#2196F3",
	completed: "#4CAF50",
	delivered: "#4CAF50",
	cancelled: "#F44336",
};

const STATUS_LABELS: Record<string, string> = {
	pending: "Chờ xác nhận",
	processing: "Đang chuẩn bị hàng",
	shipped: "Đang giao hàng",
	completed: "Đã hoàn thành",
	delivered: "Đã giao",
	cancelled: "Đã hủy",
};

export default function OrderStatusChart({ allOrders }: { allOrders: AdminOrder[] }) {
	const [period, setPeriod] = useState<Period>("weekly");

	const data = useMemo(() => {
		const { startDate, endDate } = getDateRangeByPeriod(period);
		const filteredOrders = allOrders.filter(order => dayjs(order.createdAt).isBetween(startDate, endDate, null, "[]"));
		const statusCount = filteredOrders.reduce(
			(acc, order) => {
				const status = order.status.toLowerCase();
				acc[status] = (acc[status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return Object.entries(statusCount).map(([status, count]) => ({
			key: status,
			name: STATUS_LABELS[status] || status.charAt(0).toUpperCase() + status.slice(1),
			value: count,
		}));
	}, [period, allOrders]);

	return (
		<div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
			<div className="flex justify-between items-start mb-6 relative">
				<h2 className="text-2xl font-bold text-gray-900">Phân bổ trạng thái đơn hàng</h2>
				<PeriodDropdown period={period} onPeriodChange={setPeriod} />
			</div>

			{data.length === 0 ? (
				<div className="flex items-center justify-center min-h-[350px]">
					<p className="text-gray-500 text-lg">Không có dữ liệu trong thời gian này</p>
				</div>
			) : (
				<ResponsiveContainer width="100%" height={350}>
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={55}
							outerRadius={80}
							labelLine={false}
							label={entry => `${entry.name}: ${entry.value}`}
							fill="#8884d8"
							dataKey="value"
						>
							{data.map((entry: any, index: number) => (
								<Cell key={`cell-${index}`} fill={COLORS[entry.key] || "#8884d8"} />
							))}
						</Pie>
						<Tooltip formatter={(value: number | undefined) => `${value ?? 0} đơn`} />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			)}
		</div>
	);
}
