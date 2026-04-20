"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Address } from "~/types/address";
import { ShippingMethod } from "~/types/shipping";

interface CheckoutContextType {
	selectedAddress: Address | null;
	setSelectedAddress: (address: Address | null) => void;
	selectedShippingMethod: ShippingMethod | null;
	setSelectedShippingMethod: (method: ShippingMethod | null) => void;
	scheduledDate: string | null;
	setScheduledDate: (date: string | null) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
	const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
	const [scheduledDate, setScheduledDate] = useState<string | null>(null);

	return (
		<CheckoutContext.Provider
			value={{
				selectedAddress,
				setSelectedAddress,
				selectedShippingMethod,
				setSelectedShippingMethod,
				scheduledDate,
				setScheduledDate,
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
