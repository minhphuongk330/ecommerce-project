import { useCallback, useEffect, useMemo, useState } from "react";
import bannerService from "~/services/banner";
import { BannerData } from "~/types/banner";
import { bannerCache } from "~/utils/lruCache";

export const useBanners = () => {
	const [banners, setBanners] = useState<BannerData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchBanners = useCallback(async () => {
		try {
			setIsLoading(true);
			const cached = bannerCache.get("banners");
			if (cached) {
				setBanners(cached);
				setIsLoading(false);
				return;
			}
			const data = await bannerService.getAll();
			const sortedData = data.sort((a, b) => Number(b.id) - Number(a.id));
			bannerCache.set("banners", sortedData);
			setBanners(sortedData);
		} catch (error) {
			console.error("Failed to fetch banners:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchBanners();
	}, [fetchBanners]);

	const { heroBanner, splitBanners, gridBanners, bottomBanner } = useMemo(() => {
		return {
			heroBanner: banners.find(b => b.displayType === "1" && b.isActive),
			splitBanners: banners.filter(b => b.displayType === "2" && b.isActive).slice(0, 2),
			gridBanners: banners.filter(b => b.displayType === "3" && b.isActive).slice(0, 4),
			bottomBanner: banners.find(b => b.displayType === "4" && b.isActive),
		};
	}, [banners]);

	return {
		banners,
		heroBanner,
		splitBanners,
		gridBanners,
		bottomBanner,
		isLoading,
	};
};
