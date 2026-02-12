import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { favoriteService, FavoriteItem } from "~/services/favorite";

interface FavoriteState {
	favorites: FavoriteItem[];
	fetchFavorites: () => Promise<void>;
	toggleFavorite: (productId: number, variantId?: number) => Promise<void>;
	checkIsFavorite: (productId: number, variantId?: number) => boolean;
	clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
	persist(
		(set, get) => ({
			favorites: [],
			fetchFavorites: async () => {
				try {
					const data = await favoriteService.getAll();
					set({ favorites: data });
				} catch (error) {
					console.error("Failed to sync favorites:", error);
				}
			},
			toggleFavorite: async (productId: number, variantId?: number) => {
				const { favorites, fetchFavorites } = get();
				const existingItem = favorites.find(item => {
					const sameProduct = Number(item.productId) === Number(productId);
					const sameVariant = variantId ? Number(item.variantId) === Number(variantId) : !item.variantId;
					return sameProduct && sameVariant;
				});
				try {
					if (existingItem) {
						set(state => ({
							favorites: state.favorites.filter(item => item.id !== existingItem.id),
						}));
						await favoriteService.delete(productId, variantId);
					} else {
						await favoriteService.create(productId, variantId);
						await fetchFavorites();
					}
				} catch (error) {
					console.error("Error toggling favorite:", error);
					await fetchFavorites();
				}
			},
			checkIsFavorite: (productId: number, variantId?: number) => {
				return get().favorites.some(item => {
					const sameProduct = Number(item.productId) === Number(productId);
					const sameVariant = variantId ? Number(item.variantId) === Number(variantId) : !item.variantId;
					return sameProduct && sameVariant;
				});
			},
			clearFavorites: () => set({ favorites: [] }),
		}),
		{
			name: "favorite-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
