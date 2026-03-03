"use client";
import { useMemo, useEffect, useState } from "react";
import CartList from "~/components/Cart/List";
import OrderSummary from "~/components/Cart/OderSummary";
import EmptyState from "~/components/atoms/EmptyState";
import { useNotification } from "~/contexts/Notification";
import { useCartStore } from "~/stores/cart";
import HydrationGuard from "~/components/HydrationGuard";
import { CartPageSkeleton } from "~/components/Skeletons/index";

export default function CartPage() {
	return (
		<div className="w-full bg-white min-h-screen">
			<div className="w-full max-w-[1440px] mx-auto pt-[40px] pb-[112px] px-4 md:px-[160px]">
				<HydrationGuard fallback={<CartPageSkeleton />} store={useCartStore}>
					<CartContent />
				</HydrationGuard>
			</div>
		</div>
	);
}

function CartContent() {
	const cartItems = useCartStore(state => state.cartItems);
	const removeFromCart = useCartStore(state => state.removeFromCart);
	const increaseQuantity = useCartStore(state => state.increaseQuantity);
	const decreaseQuantity = useCartStore(state => state.decreaseQuantity);
	const fetchCart = useCartStore(state => state.fetchCart);
	const _hasHydrated = useCartStore(state => state._hasHydrated);
	const { showNotification } = useNotification();

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (_hasHydrated) {
			setIsLoading(true);
			fetchCart().finally(() => {
				setTimeout(() => setIsLoading(false), 100);
			});
		}
	}, [_hasHydrated, fetchCart]);

	const { subtotal, total, tax, shipping } = useMemo(() => {
		const subtotal = cartItems.reduce((sum, item) => {
			const selectedVariant = item.variants?.find((v: any) => Number(v.id) === Number(item.variantId));
			const finalPrice = selectedVariant ? Number(selectedVariant.price) : Number(item.price);
			return sum + finalPrice * Number(item.quantity);
		}, 0);
		const calculatedTax = subtotal * 0.1;

		return { subtotal, tax: calculatedTax, shipping: null, total: subtotal + calculatedTax };
	}, [cartItems]);

	const handleIncrease = async (cartItemId: number) => {
		try {
			await increaseQuantity(cartItemId);
		} catch (error: any) {
			const message = error?.response?.data?.message || "Cannot increase quantity";
			showNotification(message, "error");
		}
	};

	const handleRemove = async (cartItemId: number) => {
		try {
			await removeFromCart(cartItemId);
		} catch (error: any) {
			const message = error?.response?.data?.message || "Failed to remove item from cart";
			showNotification(message, "error");
		}
	};

	const handleDecrease = async (cartItemId: number) => {
		try {
			await decreaseQuantity(cartItemId);
		} catch (error: any) {
			const message = error?.response?.data?.message || "Failed to decrease quantity";
			showNotification(message, "error");
		}
	};

	if (isLoading) {
		return <CartPageSkeleton />;
	}

	if (cartItems.length === 0) {
		return <EmptyState title="Your Cart is Empty" description="Looks like you haven't made your choice yet." />;
	}

	return (
		<div className="flex flex-col md:flex-row gap-6 md:gap-[48px]">
			<div className="w-full md:w-[536px] flex flex-col gap-6 md:gap-[40px]">
				<h1 className="text-xl md:text-[24px] font-medium text-black">Shopping Cart</h1>
				<CartList items={cartItems} onRemove={handleRemove} onIncrease={handleIncrease} onDecrease={handleDecrease} />
			</div>
			<div className="w-full md:w-[536px]">
				<OrderSummary subtotal={subtotal} tax={tax} shipping={shipping} total={total} />
			</div>
		</div>
	);
}
