import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function TextArea({ className = "", ...props }: TextAreaProps) {
	return (
		<textarea
			className={`w-full p-3 rounded-md text-sm resize-none
        border border-[#E6E6E6] bg-[#FAFAFA] text-black
        placeholder:text-gray-400
        focus:outline-none focus:border-[#FFB547] focus:ring-1 focus:ring-[#FFB547]
        transition-all duration-200
        ${className}`}
			{...props}
		/>
	);
}
