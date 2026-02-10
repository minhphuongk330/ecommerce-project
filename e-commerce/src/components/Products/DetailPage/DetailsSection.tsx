"use client";
import React, { useState, useMemo } from "react";
import { DetailsSectionProps } from "~/types/component";
import ViewMoreBtn from "~/components/atoms/ViewMoreBtn";

const DetailsSection: React.FC<DetailsSectionProps> = ({ product }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const specs = useMemo(() => {
		if (!product.attributes || Object.keys(product.attributes).length === 0) return [];
		return Object.entries(product.attributes).map(([key, value]) => ({
			key: key,
			name: key.replace(/_/g, " "),
			value: String(value),
		}));
	}, [product.attributes]);
	const visibleSpecs = isExpanded ? specs : specs.slice(0, 5);
	if (!product.description && specs.length === 0) return null;

	return (
		<div className="w-full bg-[#FAFAFA] flex justify-center py-8 md:py-[80px] px-4 md:px-[160px]">
			<div className="w-full max-w-[1440px] mx-auto bg-white rounded-[8px] p-4 md:p-[40px] shadow-sm">
				<h2 className="text-xl md:text-[24px] font-bold text-black leading-[32px] border-b pb-4">Details</h2>

				{product.description && (
					<div className="mt-6 md:mt-[32px] text-sm text-[#4E4E4E] font-medium leading-[24px] text-justify whitespace-pre-line">
						{product.description}
					</div>
				)}

				{specs.length > 0 && (
					<div className="flex flex-col w-full mt-8 md:mt-[40px] pt-8 border-t border-gray-100">
						<h3 className="text-lg md:text-[20px] font-bold text-black mb-4 md:mb-[24px] uppercase">
							Technical Specifications
						</h3>

						<div className="flex flex-col border border-[#EBEBEB] rounded-lg overflow-hidden">
							{visibleSpecs.map((item, index) => (
								<div
									key={index}
									className="flex flex-col sm:flex-row justify-between items-start p-4 border-b border-[#EBEBEB] last:border-0 bg-white hover:bg-gray-50 transition-colors"
								>
									<span className="text-sm md:text-base text-gray-500 font-medium capitalize w-full sm:w-1/3">
										{item.name}
									</span>
									<div className="text-sm md:text-base text-black font-semibold text-left sm:text-right w-full sm:w-2/3 break-words mt-1 sm:mt-0">
										{item.value}
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
