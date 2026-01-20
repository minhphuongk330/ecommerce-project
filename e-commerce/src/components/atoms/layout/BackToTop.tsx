"use client";
import { useEffect, useState, useCallback } from "react";
import { KeyboardArrowUp } from "@mui/icons-material";
import CommonIconButton from "~/components/atoms/IconButton";

export default function BackToTop() {
	const [isVisible, setIsVisible] = useState(false);
	const handleScroll = useCallback(() => {
		setIsVisible(window.scrollY > 400);
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<div
			className={`
        fixed bottom-8 right-6 z-40
        transition-all duration-300 ease-in-out
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}
      `}
		>
			<CommonIconButton
				onClick={scrollToTop}
				icon={<KeyboardArrowUp sx={{ fontSize: 28 }} />}
				className="bg-black text-white hover:bg-gray-800 shadow-lg rounded-full !p-3"
			/>
		</div>
	);
}
