import { useEffect, useRef, useState } from "react";
import { flashSaleService } from "~/services/flashSale";
import { FlashSale } from "~/types/flashSale";

export const useFlashSale = () => {
	const [flashSale, setFlashSale] = useState<FlashSale | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		const fetchFlashSale = async () => {
			try {
				const data = await flashSaleService.getActive();
				setFlashSale(data);
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching flash sale:", error);
				setIsLoading(false);
			}
		};


		fetchFlashSale();


		const interval = setInterval(fetchFlashSale, 30000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (!flashSale) return;
		const calc = () => {
			const diff = new Date(flashSale.endsAt).getTime() - Date.now();
			if (diff <= 0) {
				setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
				if (timerRef.current) clearInterval(timerRef.current);
				return;
			}
			setTimeLeft({
				hours: Math.floor(diff / 1000 / 3600),
				minutes: Math.floor((diff / 1000 / 60) % 60),
				seconds: Math.floor((diff / 1000) % 60),
			});
		};
		calc();
		timerRef.current = setInterval(calc, 1000);
		return () => { if (timerRef.current) clearInterval(timerRef.current); };
	}, [flashSale]);

	return { flashSale, isLoading, timeLeft };
};
