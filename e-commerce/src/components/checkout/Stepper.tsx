"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { CHECKOUT_STEPS } from "~/types/checkout";

const CheckoutStepper: React.FC = () => {
	const pathname = usePathname();

	return (
		<div
			className="
				w-full mx-auto bg-white
				flex justify-between items-center
				px-4 py-6
				lg:max-w-[1440px] lg:px-[160px] lg:py-[72px]
			"
		>
			{CHECKOUT_STEPS.map(step => {
				const isActive = pathname?.includes(step.href);
				const Icon = step.icon;

				return (
					<div
						key={step.key}
						className={`
							flex items-center gap-2 h-10 select-none transition-colors
							${isActive ? "text-black opacity-100" : "text-gray-400 opacity-40"}
						`}
					>
						<div className="flex items-center justify-center w-6 h-6">
							<Icon sx={{ fontSize: 24 }} />
						</div>

						<div className="flex flex-col justify-center">
							<span className="text-[11px] lg:text-[12px] font-medium leading-none mb-1">Step {step.stepNumber}</span>
							<span className="text-[14px] lg:text-[16px] font-bold leading-none">{step.label}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default CheckoutStepper;
