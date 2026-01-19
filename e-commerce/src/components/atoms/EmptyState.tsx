import React from "react";
import Link from "next/link";
import Button from "~/components/atoms/Button";
import { routerPaths } from "~/utils/router";

interface EmptyStateProps {
	title: string;
	description?: string;
	buttonText?: string;
	link?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
	title,
	description,
	buttonText = "Start Shopping",
	link = routerPaths.index || "/",
}) => {
	return (
		<div className="flex flex-col items-center justify-center py-12 md:py-20 text-center px-4">
			<h2 className="text-xl md:text-2xl font-bold text-black mb-2">{title}</h2>
			{description && <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 max-w-md mx-auto">{description}</p>}
			<Link href={link}>
				<Button
					theme="dark"
					className="!px-8 md:!px-10 !py-3 !rounded-lg !bg-black !text-white hover:opacity-80 transition-opacity"
				>
					{buttonText}
				</Button>
			</Link>
		</div>
	);
};

export default EmptyState;
