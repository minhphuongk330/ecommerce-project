"use client";
import React, { useState, useMemo } from "react";
import { DetailsSectionProps } from "~/types/component";
import ViewMoreBtn from "~/components/atoms/ViewMoreBtn";

interface AttributeItem {
	key: string;
	name: string;
	value: string | string[];
}

const DetailsSection: React.FC<DetailsSectionProps> = ({ product }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const specs = useMemo(() => {
		if (!product.attribute) return [];
		try {
			return JSON.parse(product.attribute) as AttributeItem[];
		} catch {
			try {
				const fixedJson = product.attribute.replace(/([^"])""/g, '$1"');
				return JSON.parse(fixedJson) as AttributeItem[];
			} catch {
				return [];
			}
		}
	}, [product.attribute]);

	const visibleSpecs = isExpanded ? specs : specs.slice(0, 5);

	if (!product.description && specs.length === 0) return null;
	return (
		<div className="w-full bg-[#FAFAFA] flex justify-center py-8 md:py-[80px] px-4 md:px-[160px]">
			<div className="w-full max-w-[1440px] mx-auto bg-white rounded-[8px] p-4 md:p-[40px] shadow-sm">
				<h2 className="text-xl md:text-[24px] font-medium text-black leading-[32px]">Details</h2>
				{product.description && (
					<p className="mt-6 md:mt-[32px] text-sm text-[#4E4E4E] font-medium leading-[24px] text-justify whitespace-pre-line">
						{product.description}
					</p>
				)}
				{specs.length > 0 && (
					<div className="flex flex-col w-full mt-6 md:mt-[40px]">
						<h3 className="text-lg md:text-[20px] font-medium text-black mb-4 md:mb-[24px]">Technical Specifications</h3>
						<div className="flex flex-col">
							{visibleSpecs.map((item, index) => (
								<div
									key={index}
									className="flex flex-col sm:flex-row justify-between items-start py-3 md:py-[12px] border-b border-[#EBEBEB] last:border-0 gap-2 sm:gap-0"
								>
									<span className="text-sm md:text-base text-black font-normal opacity-80">{item.name}</span>
									<div className="text-sm md:text-base text-black font-medium text-left sm:text-right max-w-full sm:max-w-[60%] break-words">
										{Array.isArray(item.value)
											? item.value.map((line, lineIndex) => (
													<div key={lineIndex} className="leading-relaxed">
														{line}
													</div>
											  ))
											: item.value}
									</div>
								</div>
							))}
						</div>
						{specs.length > 5 && (
							<div className="w-full flex justify-center mt-6 md:mt-[32px]">
								<ViewMoreBtn isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default DetailsSection;
