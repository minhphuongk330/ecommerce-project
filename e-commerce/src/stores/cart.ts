import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cartService } from "~/services/cart";
import { useAuthStore } from "./useAuth";
import { Product } from "~/types/product";

export interface CartItem extends Product {
	cartItemId?: number;
	quantity: number;
	selectedColor?: string;
	variantId?: number;
	variants?: any[];
}

interface CartState {
	cartItems: CartItem[];
	fetchCart: () => Promise<void>;
	addToCart: (product: Product, color: string) => Promise<void>;
	removeFromCart: (cartItemId: number) => Promise<void>;
	increaseQuantity: (cartItemId: number) => Promise<void>;
	decreaseQuantity: (cartItemId: number) => Promise<void>;
	clearCart: () => Promise<void>;
	resetLocalCart: () => void;
}

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			cartItems: [],
			fetchCart: async () => {
				const isAuthenticated = useAuthStore.getState().isAuthenticated;
				if (!isAuthenticated) return;
				try {
					const data = await cartService.getAll();
					const mappedItems: CartItem[] = data.map((item: any) => {
						const baseProduct = item.product;
						const selectedVariantId = item.variantId || item.productVariantId;
						let displayPrice = baseProduct.price;
						if (selectedVariantId && baseProduct.variants) {
							const variant = baseProduct.variants.find((v: any) => Number(v.id) === Number(selectedVariantId));
							if (variant) displayPrice = variant.price;
						}
						return {
							...baseProduct,
							cartItemId: item.id,
							quantity: item.quantity,
							selectedColor: item.color,
							variantId: selectedVariantId,
							price: displayPrice,
							variants: baseProduct.variants,
						};
					});
					set({ cartItems: mappedItems });
				} catch (error) {
					console.error("Failed to sync cart:", error);
				}
			},

			addToCart: async (product, color) => {
				const { fetchCart } = get();
				const isAuthenticated = useAuthStore.getState().isAuthenticated;
				if (!isAuthenticated) return;
				try {
					const variantIdToSend = (product as any).variantId;
					await cartService.create(product.id, 1, color, variantIdToSend);
					await fetchCart();
				} catch (error) {
					console.error("Add to cart failed:", error);
					throw error;
				}
			},

			removeFromCart: async cartItemId => {
				const { fetchCart } = get();
				try {
					await cartService.delete(cartItemId);
					await fetchCart();
				} catch (error) {
					console.error("Remove failed:", error);
					throw error;
				}
			},

			increaseQuantity: async cartItemId => {
				const { cartItems, fetchCart } = get();
				const item = cartItems.find(i => i.cartItemId === cartItemId);

				if (item && item.cartItemId) {
					if (item.stock && item.quantity >= item.stock) {
						throw {
							response: {
								data: { message: `Only ${item.stock} items available. Cannot add more.` },
							},
						};
					}
					const oldQuantity = item.quantity;

					set({
						cartItems: cartItems.map(i => (i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i)),
					});

					try {
						await cartService.update(item.cartItemId, item.quantity + 1);
						await fetchCart();
					} catch (error) {
						set({
							cartItems: cartItems.map(i => (i.cartItemId === cartItemId ? { ...i, quantity: oldQuantity } : i)),
						});
						throw error;
					}
				}
			},

			decreaseQuantity: async cartItemId => {
				const { cartItems, fetchCart } = get();
				const item = cartItems.find(i => i.cartItemId === cartItemId);

				if (item && item.cartItemId && item.quantity > 1) {
					try {
						await cartService.update(item.cartItemId, item.quantity - 1);
						await fetchCart();
					} catch (error) {
						console.error("Decrease failed:", error);
						throw error;
					}
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

			resetLocalCart: () => set({ cartItems: [] }),
		}),
		{
			name: "shopping-cart-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
