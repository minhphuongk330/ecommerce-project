import { useEffect } from "react";

export const useScrollLock = (isLocked: boolean) => {
	useEffect(() => {
		if (!isLocked) return;

		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		const header = document.querySelector("header") as HTMLElement | null;

		document.body.style.overflow = "hidden";
		document.body.style.paddingRight = `${scrollbarWidth}px`;
		if (header) header.style.paddingRight = `${scrollbarWidth}px`;

		return () => {
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
			if (header) header.style.paddingRight = "";
		};
	}, [isLocked]);
};
