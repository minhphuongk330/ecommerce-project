"use client";
import React from "react";
import { ArrowButtonProps } from "~/types/component";
import SingleBtn from "./SingleBtn";

const ArrowButton: React.FC<ArrowButtonProps> = ({ onPrev, onNext, className = "" }) => {
	return (
		<div className={`flex gap-4 ${className}`}>
			<SingleBtn direction="left" onClick={onPrev} />
			<SingleBtn direction="right" onClick={onNext} />
		</div>
	);
};

export default ArrowButton;
