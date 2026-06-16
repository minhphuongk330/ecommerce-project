"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ColorSelector from "~/components/atoms/ColorSelector";
import StepButton from "~/components/checkout/Button";
import { useNotification } from "~/contexts/Notification";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/useAuth";
import { useFavoriteStore } from "~/stores/useFavorite";
import { MainInfoProps } from "~/types/component";
import { routerPaths } from "~/utils/router";
import DeliveryInfo from "./DeliveryInfo";
import ImageGallery from "./ImageGallery";


export const COLOR_MAP: Record<string, string> = {
	"Đen": "#000000",
	"Trắng": "#FFFFFF",
	"Đỏ": "#FF0000",
	"Xanh dương": "#0000FF",
	"Xanh lá": "#008000",
	"Xanh ngọc": "#00CED1",
	"Vàng": "#FFFF00",
	"Cam": "#FF8C00",
	"Tím": "#800080",
	"Hồng": "#FFC0CB",
	"Nâu": "#8B4513",
	"Xám": "#808080",
	"Bạc": "#C0C0C0",
	"Vàng gold": "#FFD700",
	"Xanh navy": "#000080",
	"Be": "#F5F5DC",
	"Màu gỗ": "#DEB887",
	"Xanh mint": "#98FF98",
	"Hồng đào": "#FFDAB9",
	"Xanh rêu": "#556B2F",
};


const getColorList = (product: MainInfoProps["product"]): string[] => {
	if (product.specifications) {
		const specs = product.specifications;
		const colorKeys = ["màu sắc", "color", "mau sac", "colors"];
		for (const key of colorKeys) {
			if (specs[key]) {
				const specColors = String(specs[key]).split(",").map(c => c.trim()).filter(Boolean);
				if (specColors.length > 0) return specColors;
			}
		}
	}

	if (product.color) {
		return product.color.split(",").map(c => c.trim()).filter(Boolean);
	}
	return [];
};


const formatColors = (colorNames: string[], product: any) => {
	const colorHexMap = product.specifications?.colorHex || {};
	return colorNames.map((name, index) => ({
		id: index + 1,
		name: name,
		hex: colorHexMap[name] || COLOR_MAP[name] || "#CCCCCC",
	}));
};

const MainInfo: React.FC<MainInfoProps> = ({ product }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isExpanded, setIsExpanded] = useState(false);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
	const addToCart = useCartStore(state => state.addToCart);
	const favorites = useFavoriteStore(state => state.favorites);
	const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const { showNotification } = useNotification();

	const isLiked = useMemo(() => {
		return favorites.some(item => Number(item.productId) === Number(product.id));
	}, [favorites, product.id]);


	const colorList = useMemo(() => getColorList(product), [product]);
	const formattedColors = useMemo(() => formatColors(colorList, product), [colorList, product]);


	const [selectedColor, setSelectedColor] = useState<string>("");


	useEffect(() => {
		const colorFromUrl = searchParams.get("color");
		if (colorFromUrl && colorList.includes(colorFromUrl)) {
			setSelectedColor(colorFromUrl);
		} else if (colorList.length > 0) {
			setSelectedColor(colorList[0]);
		}
	}, [searchParams, colorList]);


	const handleColorSelect = useCallback((colorName: string) => {
		setSelectedColor(colorName);

		const params = new URLSearchParams(searchParams.toString());
		params.set("color", colorName);
		router.push(`?${params.toString()}`, { scroll: false });
	}, [router, searchParams]);

	const imageUrls = useMemo(() => {
		return product.images || [];
	}, [product.images]);

	const handleAddToCart = async () => {
		if (!isAuthenticated) {
			router.push(routerPaths.login);
			return;
		}
		if (!selectedColor) {
			showNotification("Vui lòng chọn màu sắc", "warning");
			return;
		}
		setIsAddingToCart(true);
		try {
			const cartItemData = {
				...product,
				price: product.price,
			};
			await addToCart(cartItemData, selectedColor);
			showNotification("Đã thêm vào giỏ hàng!", "success");
			router.push(routerPaths.cart);
		} catch (error: any) {
			const message = error?.response?.data?.message || "Không thể thêm vào giỏ hàng";
			showNotification(message, "error");
		} finally {
			setIsAddingToCart(false);
		}
	};

	const handleToggleFavorite = async () => {
		if (!isAuthenticated) {
			showNotification("Vui lòng đăng nhập để thêm vào yêu thích", "warning");
			router.push(routerPaths.login);
			return;
		}

		setIsTogglingFavorite(true);
		try {
			await toggleFavorite(Number(product.id));
			showNotification(!isLiked ? "Đã thêm vào yêu thích!" : "Đã bỏ khỏi yêu thích!", "success");
		} catch (error) {
			console.error(error);
			showNotification("Có lỗi xảy ra", "error");
		} finally {
			setIsTogglingFavorite(false);
		}
	};

	const currentPrice = Number(product.price);
	const currentStock = Number(product.stock);
	const colorStockMap = product.specifications?.colorStock;
	const selectedColorStock = (selectedColor && colorStockMap) ? Number(colorStockMap[selectedColor] ?? 0) : currentStock;
	const isOutOfStock = currentStock === 0 || (colorStockMap && selectedColorStock === 0);


	const isFlashSale = (product as any).isFlashSale || false;
	const flashSalePrice = (product as any).flashSalePrice as number | undefined;
	const flashSaleOriginalPrice = (product as any).flashSaleOriginalPrice as number | undefined;
	const displayPrice = isFlashSale && flashSalePrice ? flashSalePrice : currentPrice;
	const originalForDisplay = isFlashSale && flashSaleOriginalPrice ? flashSaleOriginalPrice : null;
	const discountPct = originalForDisplay && flashSalePrice
		? Math.round(((originalForDisplay - flashSalePrice) / originalForDisplay) * 100)
		: 0;


	const formatVND = (price: number) => {
		return price.toLocaleString("vi-VN") + "₫";
	};

	return (
		<div className="w-full flex flex-col items-center bg-[#F9F9F9]">
			<div className="w-full bg-white flex justify-center py-6 md:py-10">
				<div className="w-full max-w-[1440px] px-4 md:px-[160px]">
					<div className="flex flex-col lg:flex-row gap-6 md:gap-[48px] w-full mx-auto">
						<ImageGallery images={imageUrls} productName={product.name} />
						<div className="w-full lg:w-[536px] flex flex-col">
							<h1 className="text-2xl md:text-[40px] font-bold text-black leading-tight mb-4 md:mb-6">
								{product.name}
							</h1>

							<div className="mb-4 md:mb-6">
								{isFlashSale && flashSalePrice ? (
									<div className="flex flex-col gap-1.5">

										<div className="flex items-center gap-2">
											<span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
												⚡ Flash Sale
											</span>
											{discountPct > 0 && (
												<span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded">
													-{discountPct}%
												</span>
											)}
										</div>

										<div className="flex items-baseline gap-3">
											<span className="text-2xl md:text-[36px] font-bold text-red-600">
												{formatVND(displayPrice)}
											</span>
											{originalForDisplay && originalForDisplay > displayPrice && (
												<span className="text-lg md:text-[22px] text-gray-400 line-through">
													{formatVND(originalForDisplay)}
												</span>
											)}
										</div>
									</div>
								) : (
									<div className="flex items-end gap-3 md:gap-4">
										<span className="text-2xl md:text-[32px] font-medium text-black">{formatVND(currentPrice)}</span>
									</div>
								)}
							</div>
							{formattedColors.length > 0 && (
								<ColorSelector
									colors={formattedColors}
									selectedColor={selectedColor}
									onSelect={handleColorSelect}
									label="Màu sắc:"
									className="mb-4 md:mb-6"
								/>
							)}
							<div className="mb-6 md:mb-8">
								<p
									className={`text-base text-[#6F6F6F] leading-relaxed transition-all duration-300 ${isExpanded ? "" : "line-clamp-4"
										}`}
								>
									{product.description || ""}
								</p>
								{(product.description || "").length > 250 && (
									<button
										onClick={() => setIsExpanded(!isExpanded)}
										className="mt-2 text-sm font-medium text-black underline hover:text-gray-600"
									>
									</button>
								)}
							</div>
							<StepButton
								layout="full"
								primaryLabel={isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
								onPrimaryClick={handleAddToCart}
								disabled={isOutOfStock}
								outOfStock={isOutOfStock}
								isLoading={isAddingToCart}
								secondaryLabel={isLiked ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
								onSecondaryClick={handleToggleFavorite}
								secondaryDisabled={isTogglingFavorite}
								className="mb-6"
							/>
							<DeliveryInfo outOfStock={isOutOfStock} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MainInfo;
