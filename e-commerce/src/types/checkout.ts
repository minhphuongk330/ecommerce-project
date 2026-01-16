import { LocationOn, LocalShipping, Payment } from "@mui/icons-material";
import { SvgIconComponent } from "@mui/icons-material";

export interface CheckoutStep {
	key: "address" | "shipping" | "payment";
	label: string;
	stepNumber: number;
	href: string;
	icon: SvgIconComponent;
}

export const CHECKOUT_STEPS: CheckoutStep[] = [
	{
		key: "address",
		label: "Address",
		stepNumber: 1,
		href: "/checkout/address",
		icon: LocationOn,
	},
	{
		key: "shipping",
		label: "Shipping",
		stepNumber: 2,
		href: "/checkout/shipping",
		icon: LocalShipping,
	},
	{
		key: "payment",
		label: "Payment",
		stepNumber: 3,
		href: "/checkout/payment",
		icon: Payment,
	},
];
