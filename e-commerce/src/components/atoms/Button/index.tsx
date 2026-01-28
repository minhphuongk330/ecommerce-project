"use client";
import React from "react";

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	theme?: "light" | "dark";
	variant?: "solid" | "outline";
}

const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	theme = "dark",
	className = "",
	type = "button",
	disabled = false,
	variant = "outline",
}) => {
	const getThemeClasses = () => {
		if (variant === "solid") {
			if (theme === "dark") return "bg-black text-white border-black hover:bg-[#333]";
			if (theme === "light") return "bg-white text-black border-white hover:bg-gray-200";
		}

		if (theme === "light") return "border-white text-white hover:bg-white/10 bg-transparent";
		return "border-black text-black hover:bg-black/5 bg-transparent";
	};

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`
        w-[190px] h-9 md:h-14           
        px-5 py-3 
        border 
        rounded-md               
        text-base font-medium 
        cursor-pointer 
        transition-all duration-300 
        active:scale-95
        flex items-center justify-center
        
        ${getThemeClasses()}      
        
        ${disabled ? "!bg-gray-300 !border-gray-300 !text-gray-500 !cursor-not-allowed active:scale-100" : ""}
        
        ${className}              
      `}
		>
			{children}
		</button>
	);
};

export default Button;
