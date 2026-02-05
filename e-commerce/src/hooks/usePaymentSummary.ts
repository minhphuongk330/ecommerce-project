import { useCallback, useMemo } from "react";
import { useCheckoutContext } from "~/contexts/CheckoutContext";
import { useCartStore } from "~/stores/cart";
import { calculateSchedulePrice, calculateShippingDays } from "~/utils/shippingCalculator";

export interface CartItem {
	id: number;
	price?: number | string;
	quantity?: number;
	name: string;
	mainImageUrl: string;
	selectedColor?: string;
}

const TAX_AMOUNT = 50;

export const formatPrice = (value: number) => `$${value.toFixed(2)}`;

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

	const { shippingCost, total, shipmentLabel } = useMemo(() => {
		const { cost, label } = calculateShippingCost();
		return {
			shippingCost: cost,
			total: subtotal + TAX_AMOUNT + cost,
			shipmentLabel: label,
		};
	}, [calculateShippingCost, subtotal]);

	return {
		itemsWithTotal,
		selectedAddress,
		selectedShippingMethod,
		scheduledDate,
		shipmentLabel,
		subtotal,
		taxAmount: TAX_AMOUNT,
		shippingCost,
		total,
	};
};
