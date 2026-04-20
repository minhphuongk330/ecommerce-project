import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { FavoriteItem, favoriteService } from "~/services/favorite";

interface FavoriteState {
	favorites: FavoriteItem[];
	fetchFavorites: (force?: boolean) => Promise<void>;
	toggleFavorite: (productId: number, variantId?: number) => Promise<void>;
	checkIsFavorite: (productId: number, variantId?: number) => boolean;
	clearFavorites: () => void;
	_hasHydrated: boolean;
	setHasHydrated: (state: boolean) => void;
	lastFetched: number;
}

let fetchPromise: Promise<void> | null = null;

export const useFavoriteStore = create<FavoriteState>()(
	persist(
		(set, get) => ({
			favorites: [],
			lastFetched: 0,
			_hasHydrated: false,
			setHasHydrated: state => set({ _hasHydrated: state }),

			fetchFavorites: async (force = false) => {
				const { favorites, lastFetched } = get();
				const now = Date.now();
				if (fetchPromise) return fetchPromise;
				if (!force && now - lastFetched < 5000) return;
				if (!force && favorites.length > 0 && now - lastFetched < 15000) return;

				fetchPromise = (async () => {
					try {
						const data = await favoriteService.getAll();
						set({
							favorites: data,
							lastFetched: Date.now(),
						});
					} catch (error) {
						console.error("Failed to sync favorites:", error);
					} finally {
						fetchPromise = null;
					}
				})();
				return fetchPromise;
			},

			toggleFavorite: async (productId: number, variantId?: number) => {
				const { favorites, fetchFavorites } = get();
				const existingItem = favorites.find(item => {
					const sameProduct = Number(item.productId) === Number(productId);
					const sameVariant = variantId ? Number(item.variantId) === Number(variantId) : !item.variantId;
					return sameProduct && sameVariant;
				});
				if (existingItem) {
					set(state => ({
						favorites: state.favorites.filter(item => item.id !== existingItem.id),
					}));
					try {
						await favoriteService.delete(productId, variantId);
						await fetchFavorites(true);
					} catch (error) {
						set(state => ({
							favorites: [...state.favorites, existingItem],
						}));
						console.error("Error removing favorite:", error);
						throw error;
					}
				} else {
					const tempItem = {
						id: -Date.now(),
						productId,
						variantId: variantId ?? null,
						customerId: 0,
						product: null,
						variant: null,
					} as unknown as FavoriteItem;
					set(state => ({
						favorites: [...state.favorites, tempItem],
					}));
					try {
						await favoriteService.create(productId, variantId);
						await fetchFavorites(true);
					} catch (error) {
						set(state => ({
							favorites: state.favorites.filter(item => item.id !== tempItem.id),
						}));
						console.error("Error adding favorite:", error);
						throw error;
					}
				}
			},

			checkIsFavorite: (productId: number, variantId?: number) => {
				return get().favorites.some(item => {
					const sameProduct = Number(item.productId) === Number(productId);
					const sameVariant = variantId ? Number(item.variantId) === Number(variantId) : !item.variantId;
					return sameProduct && sameVariant;
				});
			},

			clearFavorites: () =>
				set({
					favorites: [],
					lastFetched: 0,
				}),
		}),
		{
			name: "favorite-storage",
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => state => {
				state?.setHasHydrated(true);
			},
		},
	),
);
