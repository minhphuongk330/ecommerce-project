import React from "react";

interface StepButtonProps {
	primaryLabel: string;
	secondaryLabel?: string;
	onPrimaryClick?: () => void;
	onSecondaryClick?: () => void;
	primaryType?: "button" | "submit" | "reset";
	secondaryType?: "button" | "submit" | "reset";
	className?: string;
	layout?: "full" | "auto";
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
}) => {
	return (
		<div
			className={`
        flex w-full items-center flex-col gap-3 lg:flex-row lg:items-center gap-4
        ${className} 
      `}
		>
			{secondaryLabel && (
				<button
					type={secondaryType}
					onClick={onSecondaryClick}
					className={`
            px-5 py-3 border rounded-md font-medium cursor-pointer 
            transition-all duration-300 active:scale-95 
            flex items-center justify-center
            border-black text-black hover:bg-black/5 bg-transparent
            h-11 text-sm  
            ${layout === "full" ? "w-full lg:flex-1" : "w-[190px]"}
          `}
				>
					{secondaryLabel}
				</button>
			)}

			<button
				type={primaryType}
				onClick={onPrimaryClick}
				className={`
          px-5 py-3 border rounded-md font-medium cursor-pointer 
          transition-all duration-300 active:scale-95 
          flex items-center justify-center
          bg-black text-white border-black hover:bg-[#333]
          h-11 text-sm 
          ${layout === "full" ? "w-full lg:flex-1" : "w-[190px]"}
        `}
			>
				{primaryLabel}
			</button>
		</div>
	);
};

export default StepButton;
