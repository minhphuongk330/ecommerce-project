"use client";
import React from "react";
import Button from "~/components/atoms/Button";

interface StepButtonProps {
	primaryLabel: string;
	onPrimaryClick?: () => void;
	secondaryLabel?: string;
	onSecondaryClick?: () => void;
	isLoading?: boolean;
	disabled?: boolean;
	type?: "button" | "submit";
	layout?: "fixed" | "full";
	justify?: "between" | "end" | "center";
	className?: string;
	buttonClassName?: string;
}

const StepButton: React.FC<StepButtonProps> = ({
	primaryLabel,
	onPrimaryClick,
	secondaryLabel,
	onSecondaryClick,
	isLoading = false,
	disabled = false,
	type = "submit",
	layout = "fixed",
	justify = "between",
	className = "",
	buttonClassName = "",
}) => {
	const defaultWidth = layout === "fixed" ? "lg:w-[160px]" : "lg:flex-1";

	const justifyStyles = {
		between: "lg:justify-between",
		end: "lg:justify-end lg:gap-[24px]",
		center: "lg:justify-center lg:gap-[24px]",
	};

	const containerClass = layout === "full" ? "gap-4" : justifyStyles[justify];

	return (
		<div
			className={`
				flex w-full items-center mt-auto
				flex-col gap-3
				lg:flex-row lg:items-center
				${containerClass}
				${className}
			`}
		>
			{secondaryLabel && onSecondaryClick && (
				<Button
					type="button"
					onClick={onSecondaryClick}
					theme="dark"
					variant="outline"
					className={`
						w-full h-12 text-base
						lg:h-auto lg:text-sm
						${defaultWidth}
						${buttonClassName}
					`}
				>
					{secondaryLabel}
				</Button>
			)}

			<Button
				type={type}
				onClick={onPrimaryClick}
				disabled={disabled || isLoading}
				theme="dark"
				variant="solid"
				className={`
					w-full h-12 text-base font-semibold
					lg:h-auto lg:text-sm lg:font-normal
					${defaultWidth}
					${buttonClassName}
				`}
			>
				{isLoading ? "Processing..." : primaryLabel}
			</Button>
		</div>
	);
};

export default StepButton;
