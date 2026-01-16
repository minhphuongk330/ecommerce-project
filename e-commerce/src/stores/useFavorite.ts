import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { favoriteService, FavoriteItem } from "~/services/favorite";

interface FavoriteState {
	favorites: FavoriteItem[];
	fetchFavorites: () => Promise<void>;
	toggleFavorite: (productId: number) => Promise<void>;
	checkIsFavorite: (productId: number) => boolean;
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

			toggleFavorite: async (productId: number) => {
				const { favorites, fetchFavorites } = get();
				const existingItem = favorites.find(item => String(item.productId) === String(productId));
				try {
					if (existingItem) {
						set(state => ({
							favorites: state.favorites.filter(item => String(item.productId) !== String(productId)),
						}));
						await favoriteService.delete(productId);
					} else {
						await favoriteService.create(productId);
						await fetchFavorites();
					}
				} catch (error) {
					console.error("Error toggling favorite:", error);
					await fetchFavorites();
				}
			},

			checkIsFavorite: (productId: number) => {
				return get().favorites.some(item => String(item.productId) === String(productId));
			},
			clearFavorites: () => set({ favorites: [] }),
		}),

		{
			name: "favorite-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
