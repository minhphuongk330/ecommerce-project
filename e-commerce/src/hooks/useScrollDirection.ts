import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollDirection() {
	const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
	const lastScrollY = useRef(0);

	const updateScrollDirection = useCallback(() => {
		const scrollY = window.pageYOffset;
		const previousY = lastScrollY.current;
		const direction = scrollY > previousY ? "down" : "up";
		const diff = Math.abs(scrollY - previousY);

		if (diff > 5 || scrollY < 5) {
			setScrollDirection(prevDirection => {
				if (prevDirection !== direction) {
					return direction;
				}
				return prevDirection;
			});
		}
		lastScrollY.current = scrollY > 0 ? scrollY : 0;
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", updateScrollDirection, { passive: true });

		return () => {
			window.removeEventListener("scroll", updateScrollDirection);
		};
	}, [updateScrollDirection]);

	return scrollDirection;
}
