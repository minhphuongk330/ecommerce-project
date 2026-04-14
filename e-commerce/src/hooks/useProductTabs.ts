import { useCallback, useEffect, useRef, useState } from "react";
import { productService } from "~/services/product";
import { Product } from "~/types/product";

const TABS = ["New Arrival", "Bestseller", "Featured Products"];

export const useProductTabs = (defaultTab: string) => {
	const [activeTab, setActiveTab] = useState<string>(defaultTab);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const cache = useRef<Record<string, Product[]>>({});
	const [, forceUpdate] = useState(0);

	const fetchAll = useCallback(async (background = false) => {
		if (!background) setIsLoading(true);
		await Promise.all(
			TABS.map(async tab => {
				const data = await productService.getByCollection(tab);
				cache.current[tab] = data;
			})
		);
		if (!background) setIsLoading(false);
		else forceUpdate(n => n + 1);
	}, []);

	useEffect(() => {
		fetchAll();

		const handleVisibilityChange = () => {
			if (!document.hidden) {
				fetchAll(true);
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
	}, [fetchAll]);
	const filteredProducts = cache.current[activeTab] || [];
	return { activeTab, setActiveTab, filteredProducts, isLoading, refetch: fetchAll };
};
