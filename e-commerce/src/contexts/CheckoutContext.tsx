"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Address } from "~/types/address";
import { ShippingMethod } from "~/types/shipping";
import type { ValidateCouponResult } from "~/types/coupon";

interface CheckoutContextType {
	selectedAddress: Address | null;
	setSelectedAddress: (address: Address | null) => void;
	selectedShippingMethod: ShippingMethod | null;
	setSelectedShippingMethod: (method: ShippingMethod | null) => void;
	scheduledDate: string | null;
	setScheduledDate: (date: string | null) => void;

	paymentMethod: 'COD' | 'VNPAY';
	setPaymentMethod: (method: 'COD' | 'VNPAY') => void;

	appliedCoupon: ValidateCouponResult | null;
	setAppliedCoupon: (coupon: ValidateCouponResult | null) => void;

	appliedShippingCoupon: ValidateCouponResult | null;
	setAppliedShippingCoupon: (coupon: ValidateCouponResult | null) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
	const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
	const [scheduledDate, setScheduledDate] = useState<string | null>(null);
	const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY'>('COD');
	const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult | null>(null);
	const [appliedShippingCoupon, setAppliedShippingCoupon] = useState<ValidateCouponResult | null>(null);

	return (
		<CheckoutContext.Provider
			value={{
				selectedAddress,
				setSelectedAddress,
				selectedShippingMethod,
				setSelectedShippingMethod,
				scheduledDate,
				setScheduledDate,
				paymentMethod,
				setPaymentMethod,
				appliedCoupon,
				setAppliedCoupon,
				appliedShippingCoupon,
				setAppliedShippingCoupon,
			}}
		>
			{children}
		</CheckoutContext.Provider>
	);
};

export const useCheckoutContext = () => {
	const context = useContext(CheckoutContext);
	if (!context) {
		throw new Error("useCheckoutContext must be used within a CheckoutProvider");
	}
	return context;
};
