"use client";
import { useCallback, useMemo, useRef } from "react";
import CartList from "~/components/Cart/List";
import OrderSummary from "~/components/Cart/OrderSummary";
import HydrationGuard from "~/components/HydrationGuard";
import YouMayAlsoLike from "~/components/Products/YouMayAlsoLike";
import { CartPageSkeleton } from "~/components/Skeletons/index";
import EmptyState from "~/components/atoms/EmptyState";
import { useNotification } from "~/contexts/Notification";
import { TAX_RATE } from "~/hooks/usePaymentSummary";
import { cartService } from "~/services/cart";
import { useCartStore } from "~/stores/cart";

export default function CartPage() {
	return (
		<div className="w-full bg-white min-h-screen font-sans">
			<div className="w-full max-w-[1440px] mx-auto pt-[40px] pb-[112px] px-4 md:px-[160px]">
				<h1 className="text-2xl md:text-3xl font-bold text-black mb-6 md:mb-8">Giỏ hàng</h1>
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
	const { showNotification } = useNotification();
	const debounceTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
	const pendingQuantity = useRef<Record<number, number>>({});
	const originalQuantity = useRef<Record<number, number>>({});

	const { subtotal, total, tax, shipping } = useMemo(() => {
		const subtotal = cartItems.reduce((sum, item) => {
			return sum + Number(item.price) * Number(item.quantity);
		}, 0);
		const calculatedTax = subtotal * TAX_RATE;
		return { subtotal, tax: calculatedTax, shipping: null, total: subtotal + calculatedTax };
	}, [cartItems]);

	const handleRemove = async (cartItemId: number) => {
		try {
			await removeFromCart(cartItemId);
		} catch (error: any) {
			showNotification(error?.response?.data?.message || "Lỗi khi xóa sản phẩm khỏi giỏ hàng", "error");
		}
	};

	const updateQuantity = useCallback(
		(cartItemId: number, delta: 1 | -1) => {
			const items = useCartStore.getState().cartItems;
			const item = items.find(i => i.cartItemId === cartItemId);
			if (!item) return;
			const current = pendingQuantity.current[cartItemId] ?? item.quantity;
			if (delta === -1 && current <= 1) return;
			if (delta === 1) {
				const isFlashSale = (item as any).isFlashSale;
				const flashSaleRemaining = (item as any).flashSaleRemaining;
				const colorStockMap = item.specifications?.colorStock;
				const selectedColor = item.selectedColor;


				const colorLimit = (colorStockMap && selectedColor) ? Number(colorStockMap[selectedColor] ?? 0) : Number(item.stock);

				const limit = isFlashSale && flashSaleRemaining !== undefined
					? Math.min(colorLimit, flashSaleRemaining)
					: colorLimit;

				if (limit && current >= limit) {
					if (isFlashSale && flashSaleRemaining <= colorLimit) {
						showNotification(`Sản phẩm Flash Sale này chỉ còn ${flashSaleRemaining} suất giảm giá.`, "error");
					} else {
						showNotification(`Chỉ còn ${limit} sản phẩm màu này trong kho.`, "error");
					}
					return;
				}
			}

			const next = current + delta;
			pendingQuantity.current[cartItemId] = next;
			if (originalQuantity.current[cartItemId] === undefined) {
				originalQuantity.current[cartItemId] = item.quantity;
			}
			useCartStore.setState({
				cartItems: items.map(i => (i.cartItemId === cartItemId ? { ...i, quantity: next } : i)),
			});

			if (debounceTimers.current[cartItemId]) clearTimeout(debounceTimers.current[cartItemId]);
			debounceTimers.current[cartItemId] = setTimeout(async () => {
				try {
					await cartService.update(cartItemId, next);
				} catch (error: any) {
					useCartStore.setState({
						cartItems: useCartStore
							.getState()
							.cartItems.map(i =>
								i.cartItemId === cartItemId ? { ...i, quantity: originalQuantity.current[cartItemId] } : i,
							),
					});
					showNotification(error?.response?.data?.message || "Lỗi khi cập nhật số lượng", "error");
				} finally {
					delete pendingQuantity.current[cartItemId];
					delete originalQuantity.current[cartItemId];
				}
			}, 600);
		},
		[showNotification],
	);

	const handleIncrease = useCallback((cartItemId: number) => updateQuantity(cartItemId, 1), [updateQuantity]);
	const handleDecrease = useCallback((cartItemId: number) => updateQuantity(cartItemId, -1), [updateQuantity]);
	if (cartItems.length === 0) {
		return <EmptyState title="Giỏ hàng trống" description="Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm." />;
	}

	return (
		<div className="flex flex-col gap-10 md:gap-[64px]">
			<div className="flex flex-col md:flex-row gap-6 md:gap-[48px]">
				<div className="w-full md:w-[536px] flex flex-col gap-6 md:gap-[40px]">
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
