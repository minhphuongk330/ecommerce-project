"use client";
import React from "react";
import CheckoutStepper from "~/components/checkout/Stepper";
import { CheckoutProvider } from "~/contexts/CheckoutContext";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
	return (
		<CheckoutProvider>
			<div className="w-full min-h-screen bg-white">
				<CheckoutStepper />
				<div className="w-full max-w-[1440px] mx-auto px-[160px] pb-[72px]">{children}</div>
			</div>
		</CheckoutProvider>
	);
}
