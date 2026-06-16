import React, { useState } from "react";

interface CollapsibleTextProps {
	text: string;
	maxLength?: number;
	className?: string;
}

export default function CollapsibleText({
	text,
	maxLength = 200,
	className = "",
}: CollapsibleTextProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	if (!text) return null;

	if (text.length <= maxLength) {
		return <p className={`text-sm leading-relaxed whitespace-pre-wrap ${className}`}>{text}</p>;
	}

	const displayText = isExpanded ? text : `${text.substring(0, maxLength)}...`;

	return (
		<div className="flex flex-col">
			<p className={`text-sm leading-relaxed whitespace-pre-wrap ${className}`}>{displayText}</p>
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline mt-1.5 self-start focus:outline-none transition-colors flex items-center gap-1"
			>
				{isExpanded ? (
					<>
						Thu gọn <span>▲</span>
					</>
				) : (
					<>
						Xem thêm <span>▼</span>
					</>
				)}
			</button>
		</div>
	);
}
