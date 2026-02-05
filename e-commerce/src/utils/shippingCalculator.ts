interface CacheEntry {
	days: number;
	price: number;
	label: string;
	timestamp: number;
}

const calculationCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

export const calculateShippingDays = (selectedDate: string): number => {
	const today = new Date();
	const selected = new Date(selectedDate);
	today.setHours(0, 0, 0, 0);
	selected.setHours(0, 0, 0, 0);
	const diffTime = selected.getTime() - today.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return Math.max(0, diffDays);
};

export const calculateSchedulePrice = (days: number): number => {
	if (days <= 2) return 15;
	if (days <= 5) return 8.5;
	if (days <= 10) return 5;
	return 0;
};

export const getPriceLabel = (days: number): string => {
	if (days <= 2) return "SUPER FAST";
	if (days <= 5) return "EXPRESS";
	if (days <= 10) return "STANDARD";
	return "FREE";
};

export const getShippingInfo = (selectedDate: string) => {
	const cached = calculationCache.get(selectedDate);
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		return { days: cached.days, price: cached.price, label: cached.label };
	}

	const days = calculateShippingDays(selectedDate);
	const price = calculateSchedulePrice(days);
	const label = getPriceLabel(days);

	calculationCache.set(selectedDate, {
		days,
		price,
		label,
		timestamp: Date.now(),
	});

	return { days, price, label };
};
