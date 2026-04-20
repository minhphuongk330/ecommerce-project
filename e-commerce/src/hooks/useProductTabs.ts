import { useCallback, useEffect, useState } from "react";
import { productService } from "~/services/product";
import { Product } from "~/types/product";

const TABS = ["New Arrival", "Bestseller", "Featured Products"];
const STALE_TIME = 5 * 60 * 1000;

const tabCache: Record<string, Product[]> = {};
let lastFetched = 0;
let fetchPromise: Promise<void> | null = null;

export const useProductTabs = (defaultTab: string) => {
	const [activeTab, setActiveTab] = useState<string>(defaultTab);
	const [isLoading, setIsLoading] = useState<boolean>(!Object.keys(tabCache).length);
	const [, forceUpdate] = useState(0);

	const fetchAll = useCallback(async (force = false) => {
		const now = Date.now();
		if (!force && now - lastFetched < STALE_TIME && Object.keys(tabCache).length) return;
		if (fetchPromise) return fetchPromise;

		fetchPromise = (async () => {
			setIsLoading(true);
			try {
				await Promise.all(
					TABS.map(async tab => {
						const data = await productService.getByCollection(tab);
						tabCache[tab] = data;
					}),
				);
				lastFetched = Date.now();
			} finally {
				fetchPromise = null;
				setIsLoading(false);
				forceUpdate(n => n + 1);
			}
		})();

		return fetchPromise;
	}, []);

	useEffect(() => {
		fetchAll();
	}, [fetchAll]);

	const filteredProducts = tabCache[activeTab] || [];
	return { activeTab, setActiveTab, filteredProducts, isLoading, refetch: () => fetchAll(true) };
};
