import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartState } from "~/types/cart";

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			cartItems: [],

			addToCart: (product, color, capacity) => {
				const currentItems = get().cartItems;
				const existingItem = currentItems.find(item => item.id === product.id);

				if (existingItem) {
					const updatedItems = currentItems.map(item =>
						item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
					);
					set({ cartItems: updatedItems });
				} else {
					set({
						cartItems: [
							...currentItems,
							{
								...product,
								quantity: 1,
								selectedColor: color,
								selectedCapacity: capacity,
								sku: `${product.id}-${Date.now()}`,
							},
						],
					});
				}
			},

			removeFromCart: id => {
				set(state => ({
					cartItems: state.cartItems.filter(item => item.id !== id),
				}));
			},

			increaseQuantity: id => {
				set(state => ({
					cartItems: state.cartItems.map(item => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
				}));
			},

			decreaseQuantity: id => {
				set(state => ({
					cartItems: state.cartItems.map(item =>
						item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
					),
				}));
			},

			clearCart: () => set({ cartItems: [] }),
		}),

		{
			name: "shopping-cart-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
