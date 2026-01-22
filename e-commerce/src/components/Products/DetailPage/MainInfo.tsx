"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCartStore } from "~/stores/cart";
import { useFavoriteStore } from "~/stores/useFavorite";
import StepButton from "~/components/checkout/Button";
import ColorSelector from "~/components/atoms/ColorSelector";
import CapacitySelector from "~/components/atoms/CapacitySelector";
import ImageGallery from "./ImageGallery";
import SpecsGrid from "./SpecGrid";
import DeliveryInfo from "./DeliveryInfo";
import { routerPaths } from "~/utils/router";
import { MainInfoProps } from "~/types/component";
import { useAuthStore } from "~/stores/useAuth";

const MainInfo: React.FC<MainInfoProps> = ({ product }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isExpanded, setIsExpanded] = useState(false);
	const addToCart = useCartStore(state => state.addToCart);
	const favorites = useFavoriteStore(state => state.favorites);
	const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);
	const isLiked = favorites.some(item => Number(item.productId) === Number(product.id));
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);

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

	const formattedColors = useMemo(() => {
		return (
			product.productColors?.map(c => ({
				name: c.colorName,
				hex: c.colorHex || "#000000",
				id: c.id,
			})) || []
		);
	}, [product]);

	const activeColorName = searchParams.get("color") || formattedColors[0]?.name || "";
	const activeCapacity = searchParams.get("capacity") || product.capacities?.[0] || "";

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);
			return params.toString();
		},
		[searchParams],
	);

	const handleSelectColor = (colorName: string) => {
		router.replace(pathname + "?" + createQueryString("color", colorName), { scroll: false });
	};

	const handleSelectCapacity = (capacity: string) => {
		router.replace(pathname + "?" + createQueryString("capacity", capacity), { scroll: false });
	};

	const handleAddToCart = async () => {
		if (!isAuthenticated) {
			router.push(routerPaths.login);
			return;
		}
		await addToCart(product, activeColorName);
		router.push(routerPaths.cart);
	};

	const displayPrice =
		typeof product.price === "number" ? product.price : parseFloat(product.price as unknown as string);

	return (
		<div className="w-full flex justify-center py-6 md:py-10 bg-white px-4 md:px-[160px]">
			<div className="flex flex-col lg:flex-row gap-6 md:gap-[48px] w-full max-w-[1440px] mx-auto">
				<ImageGallery images={imageUrls} productName={product.name} />

				<div className="w-full lg:w-[536px] flex flex-col">
					<h1 className="text-2xl md:text-[40px] font-bold text-black leading-tight mb-4 md:mb-6">{product.name}</h1>

					<div className="flex items-end gap-3 md:gap-4 mb-4 md:mb-6">
						<span className="text-2xl md:text-[32px] font-medium text-black">${displayPrice}</span>
						{product.originalPrice && product.originalPrice > displayPrice && (
							<span className="text-lg md:text-[24px] text-gray-400 line-through mb-1">${product.originalPrice}</span>
						)}
					</div>

					{formattedColors.length > 0 && (
						<ColorSelector
							colors={formattedColors}
							selectedColor={activeColorName}
							onSelect={handleSelectColor}
							label="Select color :"
							className="mb-4 md:mb-6"
						/>
					)}

					{product.capacities && product.capacities.length > 0 && (
						<CapacitySelector
							capacities={product.capacities}
							selectedCapacity={activeCapacity}
							onSelect={handleSelectCapacity}
							className="mb-4 md:mb-6"
						/>
					)}

					<SpecsGrid specs={product.specs} className="mb-4 md:mb-6" />

					<div className="mb-6 md:mb-8">
						<p
							className={`text-base text-[#6F6F6F] leading-relaxed transition-all duration-300 ${
								isExpanded ? "" : "line-clamp-6"
							}`}
						>
							{product.shortDescription}
						</p>

						{product.shortDescription && product.shortDescription.length > 400 && (
							<button
								onClick={() => setIsExpanded(!isExpanded)}
								className="mt-2 text-sm font-medium text-black underline hover:text-gray-600 transition-colors"
							>
								{isExpanded ? "Show less" : "Read more"}
							</button>
						)}
					</div>

					<StepButton
						layout="full"
						primaryLabel="Add to Cart"
						onPrimaryClick={handleAddToCart}
						secondaryLabel={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
						onSecondaryClick={() => toggleFavorite(Number(product.id))}
						className="mb-6"
					/>

					<DeliveryInfo />
				</div>
			</div>
		</div>
	);
};

export default MainInfo;
