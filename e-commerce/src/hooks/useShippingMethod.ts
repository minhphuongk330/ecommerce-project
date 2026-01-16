import { useMemo } from "react";
import { ShippingMethod } from "~/types/shipping";

export const useShippingMethod = () => {
	const getFutureDate = (daysToAdd: number): string => {
		const date = new Date();
		date.setDate(date.getDate() + daysToAdd);

		return date.toLocaleDateString("en-US", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	const shippingMethods: ShippingMethod[] = useMemo(
		() => [
			{
				id: "free",
				type: "regular",
				price: 0,
				name: "Regular shipment",
				description: "Regular shipment",
				estimatedDate: getFutureDate(7),
			},
			{
				id: "express",
				type: "express",
				price: 8.5,
				name: "Get your delivery as soon as possible",
				description: "Get your delivery as soon as possible",
				estimatedDate: getFutureDate(2),
			},
			{
				id: "schedule",
				type: "schedule",
				price: 0,
				name: "Schedule",
				description: "Pick a date when you want to get your delivery",
			},
		],
		[]
	);

	const getMethodById = (id: string) => {
		return shippingMethods.find(m => m.id === id);
	};

	return {
		shippingMethods,
		getMethodById,
	};
};
