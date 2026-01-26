import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cartService } from "~/services/cart";
import { useAuthStore } from "./useAuth";
import { Product } from "~/types/product";

export interface CartItem extends Product {
	cartItemId?: number;
	quantity: number;
	selectedColor?: string;
}

interface CartState {
	cartItems: CartItem[];
	fetchCart: () => Promise<void>;
	addToCart: (product: Product, color: string) => Promise<void>;
	removeFromCart: (productId: number) => Promise<void>;
	increaseQuantity: (productId: number) => Promise<void>;
	decreaseQuantity: (productId: number) => Promise<void>;
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
					const mappedItems: CartItem[] = data.map(item => ({
						...item.product,
						cartItemId: item.id,
						quantity: item.quantity,
						selectedColor: item.color,
					}));
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
					await cartService.create(product.id, 1, color);
					await fetchCart();
				} catch (error) {
					console.error("Add to cart failed:", error);
					throw error;
				}
			},

			removeFromCart: async productId => {
				const { cartItems, fetchCart } = get();
				const item = cartItems.find(i => i.id === productId);

				if (item && item.cartItemId) {
					try {
						await cartService.delete(item.cartItemId);
						await fetchCart();
					} catch (error) {
						console.error("Remove failed:", error);
						throw error;
					}
				}
			},

			increaseQuantity: async productId => {
				const { cartItems, fetchCart } = get();
				const item = cartItems.find(i => i.id === productId);

				if (item && item.cartItemId) {
					if (item.stock && item.quantity >= item.stock) {
						const errorObj = {
							response: {
								data: {
									message: `Only ${item.stock} items available in stock. Cannot add more.`,
								},
							},
						};
						throw errorObj;
					}
					const oldQuantity = item.quantity;
					const optimisticItems = cartItems.map(i => (i.id === productId ? { ...i, quantity: i.quantity + 1 } : i));
					set({ cartItems: optimisticItems });

					try {
						await cartService.update(item.cartItemId, item.quantity + 1);
						await fetchCart();
					} catch (error) {
						console.error("Increase failed:", error);
						const rollbackItems = cartItems.map(i => (i.id === productId ? { ...i, quantity: oldQuantity } : i));
						set({ cartItems: rollbackItems });
						throw error;
					}
				}
			},

			decreaseQuantity: async productId => {
				const { cartItems, fetchCart } = get();
				const item = cartItems.find(i => i.id === productId);

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

			resetLocalCart: () => {
				set({ cartItems: [] });
			},
		}),

		{
			name: "shopping-cart-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
