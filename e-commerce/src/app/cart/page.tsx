"use client";
import { useMemo, useEffect, useState, useRef, useCallback } from "react";
import CartList from "~/components/Cart/List";
import OrderSummary from "~/components/Cart/OrderSummary";
import EmptyState from "~/components/atoms/EmptyState";
import { useNotification } from "~/contexts/Notification";
import { useCartStore } from "~/stores/cart";
import { cartService } from "~/services/cart";
import { TAX_RATE } from "~/hooks/usePaymentSummary";
import { CartPageSkeleton } from "~/components/Skeletons/index";
import HydrationGuard from "~/components/HydrationGuard";
import YouMayAlsoLike from "~/components/Products/YouMayAlsoLike";

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
	const fetchCart = useCartStore(state => state.fetchCart);
	const _hasHydrated = useCartStore(state => state._hasHydrated);
	const { showNotification } = useNotification();
	const [isLoading, setIsLoading] = useState(true);
	const debounceTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
	const pendingQuantity = useRef<Record<number, number>>({});

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
		const calculatedTax = subtotal * TAX_RATE;
		return { subtotal, tax: calculatedTax, shipping: null, total: subtotal + calculatedTax };
	}, [cartItems]);

	const handleRemove = async (cartItemId: number) => {
		try {
			await removeFromCart(cartItemId);
		} catch (error: any) {
			showNotification(error?.response?.data?.message || "Failed to remove item from cart", "error");
		}
	};

	const handleIncrease = useCallback(
		(cartItemId: number) => {
			const items = useCartStore.getState().cartItems;
			const item = items.find(i => i.cartItemId === cartItemId);
			if (!item) return;
			const current = pendingQuantity.current[cartItemId] ?? item.quantity;
			if (item.stock && current >= item.stock) {
				showNotification(`Only ${item.stock} items available. Cannot add more.`, "error");
				return;
			}
			const next = current + 1;
			pendingQuantity.current[cartItemId] = next;
			useCartStore.setState({
				cartItems: items.map(i => (i.cartItemId === cartItemId ? { ...i, quantity: next } : i)),
			});
			if (debounceTimers.current[cartItemId]) clearTimeout(debounceTimers.current[cartItemId]);
			debounceTimers.current[cartItemId] = setTimeout(async () => {
				try {
					await cartService.update(cartItemId, next);
					await useCartStore.getState().fetchCart();
				} catch (error: any) {
					useCartStore.setState({
						cartItems: useCartStore
							.getState()
							.cartItems.map(i => (i.cartItemId === cartItemId ? { ...i, quantity: item.quantity } : i)),
					});
					showNotification(error?.response?.data?.message || "Cannot increase quantity", "error");
				} finally {
					delete pendingQuantity.current[cartItemId];
				}
			}, 600);
		},
		[showNotification],
	);

	const handleDecrease = useCallback(
		(cartItemId: number) => {
			const items = useCartStore.getState().cartItems;
			const item = items.find(i => i.cartItemId === cartItemId);
			if (!item) return;
			const current = pendingQuantity.current[cartItemId] ?? item.quantity;
			if (current <= 1) return;

			const next = current - 1;
			pendingQuantity.current[cartItemId] = next;
			useCartStore.setState({
				cartItems: items.map(i => (i.cartItemId === cartItemId ? { ...i, quantity: next } : i)),
			});

			if (debounceTimers.current[cartItemId]) clearTimeout(debounceTimers.current[cartItemId]);
			debounceTimers.current[cartItemId] = setTimeout(async () => {
				try {
					await cartService.update(cartItemId, next);
					await useCartStore.getState().fetchCart();
				} catch (error: any) {
					useCartStore.setState({
						cartItems: useCartStore
							.getState()
							.cartItems.map(i => (i.cartItemId === cartItemId ? { ...i, quantity: item.quantity } : i)),
					});
					showNotification(error?.response?.data?.message || "Failed to decrease quantity", "error");
				} finally {
					delete pendingQuantity.current[cartItemId];
				}
			}, 600);
		},
		[showNotification],
	);
	if (isLoading) return <CartPageSkeleton />;
	if (cartItems.length === 0) {
		return <EmptyState title="Your Cart is Empty" description="Looks like you haven't made your choice yet." />;
	}

	return (
		<div className="flex flex-col gap-10 md:gap-[64px]">
			<div className="flex flex-col md:flex-row gap-6 md:gap-[48px]">
				<div className="w-full md:w-[536px] flex flex-col gap-6 md:gap-[40px]">
					<h1 className="text-2xl md:text-3xl font-bold text-black">Shopping Cart</h1>
					<CartList items={cartItems} onRemove={handleRemove} onIncrease={handleIncrease} onDecrease={handleDecrease} />
				</div>
				<div className="w-full md:w-[536px]">
					<OrderSummary subtotal={subtotal} tax={tax} shipping={shipping} total={total} />
				</div>
			</div>
			<YouMayAlsoLike />
		</div>
	);
}
