import React from "react";

interface StepButtonProps {
	primaryLabel: string;
	secondaryLabel?: string;
	onPrimaryClick?: () => void;
	onSecondaryClick?: () => void;
	primaryType?: "button" | "submit" | "reset";
	secondaryType?: "button" | "submit" | "reset";
	className?: string;
	layout?: "full" | "auto" | "fixed";
	justify?: "start" | "center" | "end" | "between" | string;
	disabled?: boolean;
	buttonClassName?: string;
}

const StepButton: React.FC<StepButtonProps> = ({
	primaryLabel,
	secondaryLabel,
	onPrimaryClick,
	onSecondaryClick,
	primaryType = "submit",
	secondaryType = "button",
	className = "",
	layout = "auto",
	justify = "center",
	disabled = false,
	buttonClassName = "",
}) => {
	const justifyClass =
		{
			start: "justify-start",
			center: "justify-center",
			end: "lg:justify-end justify-center",
			between: "justify-between",
		}[justify as string] || "justify-center";
	const isFull = layout === "full";
	const widthClass = isFull ? "w-full lg:flex-1" : "w-[190px]";

	return (
		<div
			className={`
        flex w-full items-center flex-col gap-3 lg:flex-row lg:items-center gap-4
        ${justifyClass}
        ${className} 
      `}
		>
			{secondaryLabel && (
				<button
					type={secondaryType}
					onClick={onSecondaryClick}
					disabled={disabled}
					className={`
            px-5 py-3 border rounded-md font-medium cursor-pointer 
            transition-all duration-300 active:scale-95 
            flex items-center justify-center
            border-black text-black hover:bg-black/5 bg-transparent
            h-11 text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            ${widthClass}
            ${buttonClassName}
          `}
				>
					{secondaryLabel}
				</button>
			)}

			<button
				type={primaryType}
				onClick={onPrimaryClick}
				disabled={disabled}
				className={`
          px-5 py-3 border rounded-md font-medium cursor-pointer 
          transition-all duration-300 active:scale-95 
          flex items-center justify-center
          bg-black text-white border-black hover:bg-[#333]
          h-11 text-sm
          disabled:opacity-50 disabled:cursor-not-allowed
          ${widthClass}
          ${buttonClassName}
        `}
			>
				{primaryLabel}
			</button>
		</div>
	);
};

export default StepButton;
