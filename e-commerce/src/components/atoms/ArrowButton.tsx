"use client";
import React from "react";
import { ArrowButtonProps } from "~/types/component";
import SingleBtn from "./SingleBtn";

const ArrowButton: React.FC<ArrowButtonProps> = ({ 
	onPrev, 
	onNext, 
	className = "",
	scrollContainerRef,
	scrollAmount = 300,
}) => {
	const handleScrollLeft = () => {
		if (scrollContainerRef?.current) {
			scrollContainerRef.current.scrollBy({
				left: -scrollAmount,
				behavior: "smooth",
			});
		} else if (onPrev) {
			onPrev();
		}
	};

	const handleScrollRight = () => {
		if (scrollContainerRef?.current) {
			scrollContainerRef.current.scrollBy({
				left: scrollAmount,
				behavior: "smooth",
			});
		} else if (onNext) {
			onNext();
		}
	};

	return (
		<div className={`flex gap-4 ${className}`}>
			<SingleBtn direction="left" onClick={handleScrollLeft} />
			<SingleBtn direction="right" onClick={handleScrollRight} />
		</div>
	);
};

export default ArrowButton;
