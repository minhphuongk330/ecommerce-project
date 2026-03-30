import { useEffect, useRef, useState } from "react";
import { productService } from "~/services/product";
import { Product } from "~/types/product";

const TABS = ["New Arrival", "Bestseller", "Featured Products"];
const STALE_TIME = 5 * 60 * 1000;

export const useProductTabs = (defaultTab: string) => {
	const [activeTab, setActiveTab] = useState<string>(defaultTab);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const cache = useRef<Record<string, Product[]>>({});
	const lastFetched = useRef<number>(0);
	const [, forceUpdate] = useState(0);

	useEffect(() => {
		const fetchAll = async (background = false) => {
			if (!background) setIsLoading(true);
			await Promise.all(
				TABS.map(async tab => {
					const data = await productService.getByCollection(tab);
					cache.current[tab] = data;
				})
			);
			lastFetched.current = Date.now();
			if (!background) setIsLoading(false);
			else forceUpdate(n => n + 1);
		};

		fetchAll();

		const interval = setInterval(() => {
			if (Date.now() - lastFetched.current >= STALE_TIME) {
				fetchAll(true);
			}
		}, STALE_TIME);

		return () => clearInterval(interval);
	}, []);

	const filteredProducts = cache.current[activeTab] || [];

	return { activeTab, setActiveTab, filteredProducts, isLoading };
};
