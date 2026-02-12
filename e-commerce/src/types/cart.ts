import { Product } from "./product";

export interface CartItemType extends Product {
	cartItemId?: number;
	quantity: number;
	selectedColor?: string;
	variantId?: number;
	variants?: any[];
}

export interface CartItemProps {
	item: CartItemType;
	onRemove: (cartItemId: number) => void;
	onIncrease: (cartItemId: number) => void;
	onDecrease: (cartItemId: number) => void;
}

export interface OrderSummaryProps {
	subtotal: number;
	tax: number;
	shipping: number | null;
	total: number;
}

export interface CartListProps {
	items: CartItemType[];
	onRemove: (cartItemId: number) => void;
	onIncrease: (cartItemId: number) => void;
	onDecrease: (cartItemId: number) => void;
}

export interface CartContextType {
	cartItems: CartItemType[];
	addToCart: (product: Product, color: string) => void;
	removeFromCart: (cartItemId: number) => void;
	increaseQuantity: (cartItemId: number) => void;
	decreaseQuantity: (cartItemId: number) => void;
	totalAmount: number;
}

export interface CartState {
	cartItems: CartItemType[];
	addToCart: (product: Product, color: string, capacity: string) => void;
	removeFromCart: (cartItemId: number) => void;
	increaseQuantity: (cartItemId: number) => void;
	decreaseQuantity: (cartItemId: number) => void;
	clearCart: () => void;
}
