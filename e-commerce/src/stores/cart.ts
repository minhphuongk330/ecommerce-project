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
					try {
						await cartService.update(item.cartItemId, item.quantity + 1);
						await fetchCart();
					} catch (error) {
						console.error("Increase failed:", error);
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
