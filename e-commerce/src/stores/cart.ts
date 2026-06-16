import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { cartService } from "~/services/cart";
import { flashSaleService } from "~/services/flashSale";
import { Product } from "~/types/product";

export interface CartItem extends Product {
	cartItemId?: number;
	quantity: number;
	selectedColor?: string;
	isFlashSale?: boolean;
	originalPrice?: number;
	flashSaleRemaining?: number;
}

interface CartState {
	cartItems: CartItem[];
	selectedAddressId: number | null;
	setSelectedAddressId: (id: number) => void;
	fetchCart: (force?: boolean) => Promise<void>;
	addToCart: (product: Product, color: string) => Promise<void>;
	removeFromCart: (cartItemId: number) => Promise<void>;
	clearCart: () => Promise<void>;
	resetLocalCart: () => void;
	_hasHydrated: boolean;
	setHasHydrated: (state: boolean) => void;
	lastFetched: number;
}

let fetchPromise: Promise<void> | null = null;

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			cartItems: [],
			selectedAddressId: null,
			lastFetched: 0,
			_hasHydrated: false,
			setHasHydrated: state => set({ _hasHydrated: state }),
			setSelectedAddressId: id => set({ selectedAddressId: id }),
			fetchCart: async (force = false) => {
				const { cartItems, lastFetched } = get();
				const now = Date.now();
				if (fetchPromise) return fetchPromise;
				if (!force && now - lastFetched < 5000) return;
				if (!force && cartItems.length > 0 && now - lastFetched < 15000) return;
				fetchPromise = (async () => {
					try {
						const [data, flashSaleData] = await Promise.all([
							cartService.getAll(),
							flashSaleService.getActive(),
						]);
						const mappedItems: CartItem[] = data.map((item: any) => {
							const baseProduct = item.product;
							const fsItem = flashSaleData?.items?.find(
								(fsi: any) => Number(fsi.productId) === Number(baseProduct.id)
							);
							const isSaleActive = fsItem && Number(fsItem.soldQuantity) < Number(fsItem.quantity);
							return {
								...baseProduct,
								cartItemId: item.id,
								quantity: item.quantity,
								selectedColor: item.color,
								price: isSaleActive ? Number(fsItem.salePrice) : Number(baseProduct.price),
								originalPrice: isSaleActive ? Number(fsItem.originalPrice) : undefined,
								isFlashSale: isSaleActive,
								flashSaleRemaining: fsItem ? Number(fsItem.quantity) - Number(fsItem.soldQuantity) : undefined,
							};
						});

						set({
							cartItems: mappedItems,
							lastFetched: Date.now(),
						});
					} catch (error) {
						console.error("Failed to sync cart:", error);
					} finally {
						fetchPromise = null;
					}
				})();

				return fetchPromise;
			},

			addToCart: async (product, color) => {
				const { fetchCart } = get();
				try {
					const variantIdToSend = (product as any).variantId;
					await cartService.create(product.id, 1, color, variantIdToSend);
					await fetchCart(true);
				} catch (error) {
					console.error("Add to cart failed:", error);
					throw error;
				}
			},

			removeFromCart: async cartItemId => {
				const { fetchCart } = get();
				try {
					await cartService.delete(cartItemId);
					await fetchCart(true);
				} catch (error) {
					console.error("Remove failed:", error);
					throw error;
				}
			},

			clearCart: async () => {
				try {
					await cartService.clear();
					set({ cartItems: [] });
				} catch (error) {
					console.error("Clear failed", error);
					throw error;
				}
			},

			resetLocalCart: () =>
				set({
					cartItems: [],
					lastFetched: 0,
				}),
		}),
		{
			name: "shopping-cart-storage",
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => state => {
				state?.setHasHydrated(true);
			},
		},
	),
);
