"use client";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCartStore } from "~/stores/cart";
import { useFavoriteStore } from "~/stores/useFavorite";
import StepButton from "~/components/checkout/Button";
import ColorSelector from "~/components/atoms/ColorSelector";
import VariantSelector from "~/components/atoms/VariantSelector";
import ImageGallery from "./ImageGallery";
import DeliveryInfo from "./DeliveryInfo";
import { routerPaths } from "~/utils/router";
import { MainInfoProps } from "~/types/component";
import { useAuthStore } from "~/stores/useAuth";
import { useNotification } from "~/contexts/Notification";

const MainInfo: React.FC<MainInfoProps> = ({ product }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isExpanded, setIsExpanded] = useState(false);
	const [activeVariant, setActiveVariant] = useState<any>(null);
	const addToCart = useCartStore(state => state.addToCart);
	const favorites = useFavoriteStore(state => state.favorites);
	const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);
	const isLiked = favorites.some(item => Number(item.productId) === Number(product.id));
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const { showNotification } = useNotification();

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);
			return params.toString();
		},
		[searchParams],
	);

	const activeSkuParam = searchParams.get("sku");
	useEffect(() => {
		if (!product.variants || product.variants.length === 0) return;
		let targetVariant;
		if (activeSkuParam) {
			targetVariant = product.variants.find((v: any) => v.sku === activeSkuParam);
		}
		if (!targetVariant) {
			targetVariant = product.variants.find((v: any) => v.stock > 0) || product.variants[0];
		}
		setActiveVariant(targetVariant);
		if (targetVariant && activeSkuParam !== targetVariant.sku) {
			router.replace(pathname + "?" + createQueryString("sku", targetVariant.sku), { scroll: false });
		}
	}, [product.variants, activeSkuParam, pathname, router, createQueryString]);

	const handleSelectVariant = (variant: any) => {
		setActiveVariant(variant);
		router.replace(pathname + "?" + createQueryString("sku", variant.sku), { scroll: false });
	};

	const formattedColors = useMemo(() => {
		return (
			product.productColors?.map(c => ({
				name: c.colorName,
				hex: c.colorHex || "#000000",
				id: c.id,
			})) || []
		);
	}, [product]);

	const activeColorParam = searchParams.get("color");
	useEffect(() => {
		if (formattedColors.length > 0 && !activeColorParam) {
			const firstColor = formattedColors[0].name;
			router.replace(pathname + "?" + createQueryString("color", firstColor), { scroll: false });
		}
	}, [formattedColors, activeColorParam, pathname, router, createQueryString]);
	const activeColorName = activeColorParam || formattedColors[0]?.name || "";
	const handleSelectColor = (colorName: string) => {
		router.replace(pathname + "?" + createQueryString("color", colorName), { scroll: false });
	};

	const imageUrls = useMemo(() => {
		const images = [
			product.mainImageUrl,
			product.extraImage1,
			product.extraImage2,
			product.extraImage3,
			product.extraImage4,
		];
		return images.filter((img): img is string => typeof img === "string" && img.trim() !== "");
	}, [product]);

	const handleAddToCart = async () => {
		if (!isAuthenticated) {
			router.push(routerPaths.login);
			return;
		}
		try {
			const cartItemData = {
				...product,
				variantId: activeVariant?.id,
				price: activeVariant ? activeVariant.price : product.price,
			};
			await addToCart(cartItemData, activeColorName);
			showNotification("Added to cart successfully!", "success");
			router.push(routerPaths.cart);
		} catch (error: any) {
			const message = error?.response?.data?.message || "Failed to add to cart";
			showNotification(message, "error");
		}
	};

	const currentPrice = activeVariant ? Number(activeVariant.price) : Number(product.price);
	const currentStock = activeVariant ? Number(activeVariant.stock) : Number(product.stock);

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
								<span className="text-2xl md:text-[32px] font-medium text-black">${currentPrice}</span>
								{product.originalPrice && product.originalPrice > currentPrice && (
									<span className="text-lg md:text-[24px] text-gray-400 line-through mb-1">
										${product.originalPrice}
									</span>
								)}
							</div>
							{product.variants && product.variants.length > 0 && (
								<VariantSelector
									variants={product.variants}
									selectedSku={activeVariant?.sku}
									onSelect={handleSelectVariant}
								/>
							)}
							{formattedColors.length > 0 && (
								<ColorSelector
									colors={formattedColors}
									selectedColor={activeColorName}
									onSelect={handleSelectColor}
									label="Select color :"
									className="mb-4 md:mb-6"
								/>
							)}
							<div className="mb-6 md:mb-8">
								<p
									className={`text-base text-[#6F6F6F] leading-relaxed transition-all duration-300 ${
										isExpanded ? "" : "line-clamp-4"
									}`}
								>
									{product.shortDescription || ""}
								</p>
								{(product.shortDescription || "").length > 250 && (
									<button
										onClick={() => setIsExpanded(!isExpanded)}
										className="mt-2 text-sm font-medium text-black underline hover:text-gray-600"
									>
										{isExpanded ? "Show less" : "Read more"}
									</button>
								)}
							</div>
							<StepButton
								layout="full"
								primaryLabel={currentStock > 0 ? "Add to Cart" : "Out of Stock"}
								onPrimaryClick={handleAddToCart}
								disabled={currentStock === 0}
								secondaryLabel={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
								onSecondaryClick={() => toggleFavorite(Number(product.id))}
								className="mb-6"
							/>
							<DeliveryInfo />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MainInfo;
