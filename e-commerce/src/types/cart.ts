import { Product } from "./product";

export interface CartItemType extends Product {
	quantity: number;
	sku?: string;
	selectedColor?: string;
	selectedCapacity?: string;
}

export interface CartItemProps {
	item: CartItemType;
	onRemove: (id: number) => void;
	onIncrease: (id: number) => void;
	onDecrease: (id: number) => void;
}

export interface OrderSummaryProps {
	subtotal: number;
	tax: number;
	shipping: number|null;
	total: number;
}

export interface CartListProps {
	items: CartItemType[];
	onRemove: (id: number) => void;
	onIncrease: (id: number) => void;
	onDecrease: (id: number) => void;
}
export interface CartContextType {
	cartItems: CartItemType[];
	addToCart: (product: Product, color: string, capacity: string) => void;
	removeFromCart: (id: number) => void;
	increaseQuantity: (id: number) => void;
	decreaseQuantity: (id: number) => void;
	totalAmount: number;
}
export interface CartState {
	cartItems: CartItemType[];
	addToCart: (product: Product, color: string, capacity: string) => void;
	removeFromCart: (id: number) => void;
	increaseQuantity: (id: number) => void;
	decreaseQuantity: (id: number) => void;
	clearCart: () => void;
}
