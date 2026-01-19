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
	isLoading?: boolean;
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
	isLoading = false,
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
					disabled={disabled || isLoading}
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
				disabled={disabled || isLoading}
				className={`
          px-5 py-3 border rounded-md font-medium cursor-pointer 
          transition-all duration-300 active:scale-95 
          flex items-center justify-center gap-2
          bg-black text-white border-black hover:bg-[#333]
          h-11 text-sm
          disabled:opacity-50 disabled:cursor-not-allowed
          ${widthClass}
          ${buttonClassName}
        `}
			>
				{isLoading ? (
					<>
						<svg
							className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Processing...
					</>
				) : (
					primaryLabel
				)}
			</button>
		</div>
	);
};

export default StepButton;
