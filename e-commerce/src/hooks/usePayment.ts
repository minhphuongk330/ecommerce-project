"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCheckoutContext } from "~/contexts/CheckoutContext";
import { useNotification } from "~/contexts/Notification";
import { orderService } from "~/services/order";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/useAuth";
import { routerPaths } from "~/utils/router";
import { usePaymentSummary } from "./usePaymentSummary";

export const usePayment = () => {
	const router = useRouter();
	const { showNotification } = useNotification();
	const user = useAuthStore(state => state.user);
	const clearCart = useCartStore(state => state.clearCart);
	const cartItems = useCartStore(state => state.cartItems);
	const { selectedAddress, selectedShippingMethod } = useCheckoutContext();
	const { total, subtotal, taxAmount, shippingCost, deliveryDateForAPI } = usePaymentSummary();
	const [isProcessing, setIsProcessing] = useState(false);
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
	const [isPaid, setIsPaid] = useState(false);

	const shouldRedirectToCart = cartItems.length === 0 && !isPaid;
	const shouldRedirectToCheckout = !isPaid && !shouldRedirectToCart && (!selectedAddress || !selectedShippingMethod);
	const isRedirecting = shouldRedirectToCart || shouldRedirectToCheckout;

	useEffect(() => {
		if (isPaid) return;
		if (shouldRedirectToCart) {
			router.replace("/cart");
		} else if (shouldRedirectToCheckout) {
			router.replace("/checkout/address");
		}
	}, [shouldRedirectToCart, shouldRedirectToCheckout, isPaid]);

	useEffect(() => {
		const handlePageShow = (e: PageTransitionEvent) => {
			if (!e.persisted || isPaid) return;
			if (cartItems.length === 0) {
				router.replace("/cart");
			} else if (!selectedAddress || !selectedShippingMethod) {
				router.replace("/checkout/address");
			}
		};
		window.addEventListener("pageshow", handlePageShow);
		return () => window.removeEventListener("pageshow", handlePageShow);
	}, [cartItems.length, selectedAddress, selectedShippingMethod, isPaid]);

	const handlePay = async () => {
		if (!user) {
			showNotification("Please sign in to checkout.", "warning");
			return;
		}
		if (!selectedAddress) {
			showNotification("Please select a shipping address.", "warning");
			return;
		}
		if (cartItems.length === 0) {
			showNotification("Your cart is empty.", "warning");
			return;
		}
		setIsProcessing(true);

		try {
			await orderService.createFullOrder({
				userId: Number(user.id),
				addressId: selectedAddress.id,
				totalAmount: total,
				subtotal: subtotal,
				taxAmount: taxAmount,
				shippingCost: shippingCost,
				items: cartItems as any,
				scheduledDeliveryDate: deliveryDateForAPI,
			});

			setIsPaid(true);
			clearCart();
			setIsSuccessModalOpen(true);
		} catch (error: any) {
			console.error("Payment Error:", error);

			const errorMessage = error?.response?.data?.message || error?.message || "";
			if (errorMessage.includes("Insufficient stock")) {
				showNotification(errorMessage, "error");
			} else {
				showNotification("Payment failed. Please try again.", "error");
			}
		} finally {
			setIsProcessing(false);
		}
	};

	const handleRedirectHome = () => {
		setIsSuccessModalOpen(false);
		router.push(routerPaths.order);
	};

	const handleContinueShopping = () => {
		setIsSuccessModalOpen(false);
		router.push("/");
	};

	return {
		isProcessing,
		isSuccessModalOpen,
		isRedirecting,
		handlePay,
		handleRedirectHome,
		handleContinueShopping,
		handleBack: router.back,
	};
};
