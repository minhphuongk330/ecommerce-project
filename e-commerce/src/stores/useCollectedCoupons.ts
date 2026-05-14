import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { couponService } from "~/services/coupon";

interface CollectedCouponsState {
	collectedIds: string[];
	lastFetched: number;
	_hasHydrated: boolean;
	setHasHydrated: (state: boolean) => void;
	fetch: (force?: boolean) => Promise<void>;
	addId: (id: string) => void;
	removeId: (id: string) => void;
	clear: () => void;
	has: (id: string) => boolean;
}

let fetchPromise: Promise<void> | null = null;

export const useCollectedCoupons = create<CollectedCouponsState>()(
	persist(
		(set, get) => ({
			collectedIds: [],
			lastFetched: 0,
			_hasHydrated: false,
			setHasHydrated: (state) => set({ _hasHydrated: state }),

			fetch: async (force = false) => {
				const { lastFetched, collectedIds } = get();
				const now = Date.now();
				if (fetchPromise) return fetchPromise;
				if (!force && now - lastFetched < 5 * 60 * 1000) return;

				fetchPromise = (async () => {
					try {
						const ids = await couponService.getCollectedIds();
						// Set trực tiếp — không dùng clear() để tránh persist [] tạm thời
						set({ collectedIds: ids, lastFetched: Date.now() });
					} catch {
						// silent — giữ nguyên data cũ
					} finally {
						fetchPromise = null;
					}
				})();
				return fetchPromise;
			},

			addId: (id: string) => {
				const { collectedIds } = get();
				if (!collectedIds.includes(id)) {
					set({ collectedIds: [...collectedIds, id] });
				}
			},

			removeId: (id: string) => {
				set((state) => ({
					collectedIds: state.collectedIds.filter((cid) => cid !== id),
				}));
			},

			clear: () => set({ collectedIds: [], lastFetched: 0 }),

			has: (id: string) => get().collectedIds.includes(id),
		}),
		{
			name: "collected-coupons",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				collectedIds: state.collectedIds,
				lastFetched: state.lastFetched,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
