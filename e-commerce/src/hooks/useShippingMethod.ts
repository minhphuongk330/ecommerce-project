import { useMemo } from "react";
import { ShippingMethod } from "~/types/shipping";

export const useShippingMethod = () => {
	const getFutureDate = (daysToAdd: number): string => {
		const date = new Date();
		date.setDate(date.getDate() + daysToAdd);
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, "0");
		const d = String(date.getDate()).padStart(2, "0");
		return `${y}-${m}-${d}`;
	};

	const shippingMethods: ShippingMethod[] = useMemo(
		() => [
			{
				id: "free",
				type: "regular",
				price: 0,
				name: "Giao hàng thường",
				description: "Giao hàng thường",
				estimatedDate: getFutureDate(7),
			},
			{
				id: "express",
				type: "express",
				price: 30000,
				name: "Giao hàng nhanh (Nhận hàng sớm nhất có thể)",
				description: "Giao hàng nhanh (Nhận hàng sớm nhất có thể)",
				estimatedDate: getFutureDate(2),
			},
			{
				id: "schedule",
				type: "schedule",
				price: 0,
				name: "Lên lịch nhận hàng",
				description: "Chọn ngày bạn muốn nhận hàng",
			},
		],
		[],
	);

	const getMethodById = (id: string) => {
		return shippingMethods.find(m => m.id === id);
	};

	return {
		shippingMethods,
		getMethodById,
	};
};
