import { useCallback, useMemo } from "react";
import { useCheckoutContext } from "~/contexts/CheckoutContext";
import { useCartStore } from "~/stores/cart";
import { formatPrice } from "~/utils/format";
import { calculateSchedulePrice, calculateShippingDays } from "~/utils/shippingCalculator";

export interface CartItem {
	id: number;
	price?: number | string;
	quantity?: number;
	name: string;
	mainImageUrl: string;
	selectedColor?: string;
	variantId?: number;
	variants?: { id: number; sku?: string }[];
}

export const TAX_RATE = 0.1;
export const usePaymentSummary = () => {
	const { selectedAddress, selectedShippingMethod, scheduledDate } = useCheckoutContext();
	const rawItems = useCartStore(state => state.cartItems) as unknown as CartItem[];

	const { subtotal, itemsWithTotal } = useMemo(() => {
		return rawItems.reduce(
			(acc, item) => {
				const t = Number(item.price ?? 0) * Number(item.quantity ?? 0);
				acc.subtotal += t;
				acc.itemsWithTotal.push({ item, total: t });
				return acc;
			},
			{ subtotal: 0, itemsWithTotal: [] as { item: CartItem; total: number }[] },
		);
	}, [rawItems]);

	const calculateShippingCost = useCallback(() => {
		let cost = Number(selectedShippingMethod?.price || 0);
		let label = "Not selected";

		if (selectedShippingMethod) {
			if (selectedShippingMethod.type === "schedule") {
				if (scheduledDate) {
					const days = calculateShippingDays(scheduledDate);
					cost = calculateSchedulePrice(days);
					label = formatPrice(cost);
				} else {
					label = "Schedule";
				}
			} else if (selectedShippingMethod.price === 0) {
				label = "Free";
			} else {
				label = formatPrice(selectedShippingMethod.price);
			}
		}
		return { cost, label };
	}, [selectedShippingMethod, scheduledDate]);

	const { shippingCost, total, shipmentLabel, taxAmount } = useMemo(() => {
		const { cost, label } = calculateShippingCost();

		const calculatedTax = Math.round(subtotal * TAX_RATE * 100) / 100;

		return {
			shippingCost: cost,
			taxAmount: calculatedTax,
			total: subtotal + calculatedTax + cost,
			shipmentLabel: label,
		};
	}, [calculateShippingCost, subtotal]);

	const deliveryDateForAPI = useMemo(() => {
		let targetDate: string | null = scheduledDate || null;
		if (selectedShippingMethod && selectedShippingMethod.type !== "schedule") {
			targetDate = selectedShippingMethod.estimatedDate || null;
		}
		if (!targetDate) return null;
		const d = new Date(targetDate);
		return isNaN(d.getTime()) ? null : d.toISOString();
	}, [scheduledDate, selectedShippingMethod]);

	return {
		itemsWithTotal,
		selectedAddress,
		selectedShippingMethod,
		scheduledDate,
		deliveryDateForAPI,
		shipmentLabel,
		subtotal,
		taxAmount,
		shippingCost,
		total,
	};
};
