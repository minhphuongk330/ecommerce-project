import { useState, useEffect, useMemo } from "react";
import bannerService from "~/services/banner";
import { BannerData } from "~/types/banner";

export const useBanners = () => {
	const [banners, setBanners] = useState<BannerData[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const fetchBanners = async () => {
		try {
			setIsLoading(true);
			const data = await bannerService.getAll();
			const activeBanners = data.filter(b => b.isActive);
			setBanners(activeBanners);
		} catch (err: any) {
			console.error("Failed to load banners:", err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchBanners();
	}, []);

	const structuredBanners = useMemo(() => {
		return {
			heroBanner: banners.find(b => b.displayType === "1"),
			splitBanners: banners.filter(b => b.displayType === "2"),
			gridBanners: banners.filter(b => b.displayType === "3"),
			bottomBanner: banners.find(b => b.displayType === "4"),
		};
	}, [banners]);

	return { ...structuredBanners, isLoading, refresh: fetchBanners };
};
