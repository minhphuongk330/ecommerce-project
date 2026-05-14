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

// Dynamic Color Mapping: Vietnamese color names to HEX codes
const COLOR_MAP: Record<string, string> = {
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

// Helper to get color list from product data
const getColorList = (product: MainInfoProps["product"]): string[] => {
	// Check specifications for color list
	if (product.specifications) {
		const specs = product.specifications;
		// Common keys for color in specifications
		const colorKeys = ["màu sắc", "color", "mau sac", "colors"];
		for (const key of colorKeys) {
			if (specs[key]) {
				const specColors = String(specs[key]).split(",").map(c => c.trim()).filter(Boolean);
				if (specColors.length > 0) return specColors;
			}
		}
	}
	// Fallback to single color field
	if (product.color) {
		return [product.color];
	}
	return [];
};

// Helper to format colors for ColorSelector
const formatColors = (colorNames: string[]) => {
	return colorNames.map((name, index) => ({
		id: index + 1,
		name: name,
		hex: COLOR_MAP[name] || "#CCCCCC", // Fallback gray if color not in map
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

	// Get color list from product data
	const colorList = useMemo(() => getColorList(product), [product]);
	const formattedColors = useMemo(() => formatColors(colorList), [colorList]);

	// Manage selectedColor state
	const [selectedColor, setSelectedColor] = useState<string>("");

	// Initialize selectedColor from URL or first available color
	useEffect(() => {
		const colorFromUrl = searchParams.get("color");
		if (colorFromUrl && colorList.includes(colorFromUrl)) {
			setSelectedColor(colorFromUrl);
		} else if (colorList.length > 0) {
			setSelectedColor(colorList[0]);
		}
	}, [searchParams, colorList]);

	// Update URL when color is selected
	const handleColorSelect = useCallback((colorName: string) => {
		setSelectedColor(colorName);
		// Update URL without page reload
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
			// Use selectedColor instead of product.color
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
			showNotification("Please log in to add to wishlist", "warning");
			router.push(routerPaths.login);
			return;
		}

		setIsTogglingFavorite(true);
		try {
			await toggleFavorite(Number(product.id));
			showNotification(!isLiked ? "Added to wishlist!" : "Removed from wishlist!", "success");
		} catch (error) {
			console.error(error);
			showNotification("Something went wrong", "error");
		} finally {
			setIsTogglingFavorite(false);
		}
	};

	const currentPrice = Number(product.price);
	const currentStock = Number(product.stock);
	const isOutOfStock = currentStock === 0;

	// VND Formatting
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
							<div className="flex items-end gap-3 md:gap-4 mb-4 md:mb-6">
								<span className="text-2xl md:text-[32px] font-medium text-black">{formatVND(currentPrice)}</span>
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
								primaryLabel={isOutOfStock ? "Out of Stock" : "Add to Cart"}
								onPrimaryClick={handleAddToCart}
								disabled={isOutOfStock}
								outOfStock={isOutOfStock}
								isLoading={isAddingToCart}
								secondaryLabel={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
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
