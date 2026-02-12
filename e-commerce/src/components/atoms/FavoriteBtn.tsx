"use client";
import React, { useState } from "react";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import CommonIconButton from "~/components/atoms/IconButton";
import { useNotification } from "~/contexts/Notification";
import { useAuthStore } from "~/stores/useAuth";
import { useFavoriteStore } from "~/stores/useFavorite";

interface FavoriteBtnProps {
	productId: number;
	className?: string;
	iconSize?: "small" | "medium" | "large";
	variantId?: number;
}

export default function FavoriteBtn({ productId, variantId, className = "", iconSize = "medium" }: FavoriteBtnProps) {
	const user = useAuthStore(state => state.user);
	const { showNotification } = useNotification();
	const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);
	const checkIsFavorite = useFavoriteStore(state => state.checkIsFavorite);
	const isFavorite = checkIsFavorite(productId, variantId);
	const [isAnimating, setIsAnimating] = useState(false);
	const handleToggle = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!user) {
			showNotification("Please log in to add to favorites.", "warning");
			return;
		}
		setIsAnimating(true);
		setTimeout(() => setIsAnimating(false), 300);
		await toggleFavorite(productId, variantId);
	};

	const IconComponent = isFavorite ? (
		<Favorite color="error" fontSize={iconSize} />
	) : (
		<FavoriteBorder className="text-[#909090] hover:text-red-500" fontSize={iconSize} />
	);

	return (
		<CommonIconButton
			onClick={handleToggle}
			icon={IconComponent}
			className={`${isAnimating ? "animate-bounce" : ""} ${className}`}
		/>
	);
}
