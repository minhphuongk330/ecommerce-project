"use client";
import { useMemo } from "react";
import CartList from "~/components/Cart/List";
import OrderSummary from "~/components/Cart/OderSummary";
import EmptyState from "~/components/atoms/EmptyState";
import { useCartStore } from "~/stores/cart";

export default function CartPage() {
	const cartItems = useCartStore(state => state.cartItems);
	const removeFromCart = useCartStore(state => state.removeFromCart);
	const increaseQuantity = useCartStore(state => state.increaseQuantity);
	const decreaseQuantity = useCartStore(state => state.decreaseQuantity);

	const { subtotal, total, tax, shipping } = useMemo(() => {
		const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
		return { subtotal, tax: 50, shipping: null, total: subtotal + 50 };
	}, [cartItems]);

	return (
		<div className="w-full bg-white min-h-screen">
			<div className="w-full max-w-[1440px] mx-auto pt-[40px] pb-[112px] px-4 md:px-[160px]">
				{cartItems.length === 0 ? (
					<EmptyState title="Your Cart is Empty" description="Looks like you haven't made your choice yet." />
				) : (
					<div className="flex flex-col md:flex-row gap-6 md:gap-[48px]">
						<div className="w-full md:w-[536px] flex flex-col gap-6 md:gap-[40px]">
							<h1 className="text-xl md:text-[24px] font-medium text-black">Shopping Cart</h1>
							<CartList
								items={cartItems}
								onRemove={removeFromCart}
								onIncrease={increaseQuantity}
								onDecrease={decreaseQuantity}
							/>
						</div>
						<div className="w-full md:w-[536px]">
							<OrderSummary subtotal={subtotal} tax={tax} shipping={shipping} total={total} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
