import LocationOn from "@mui/icons-material/LocationOn";
import LocalShipping from "@mui/icons-material/LocalShipping";
import Payment from "@mui/icons-material/Payment";
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
		label: "Địa chỉ",
		stepNumber: 1,
		href: "/checkout/address",
		icon: LocationOn,
	},
	{
		key: "shipping",
		label: "Vận chuyển",
		stepNumber: 2,
		href: "/checkout/shipping",
		icon: LocalShipping,
	},
	{
		key: "payment",
		label: "Thanh toán",
		stepNumber: 3,
		href: "/checkout/payment",
		icon: Payment,
	},
];
