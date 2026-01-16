"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/useAuth";
import { useCheckoutContext } from "~/contexts/CheckoutContext";
import { useNotification } from "~/contexts/Notification";
import { orderService } from "~/services/order";
import { routerPaths } from "~/utils/router";
import { usePaymentSummary } from "./usePaymentSummary";

export const usePayment = () => {
	const router = useRouter();
	const { showNotification } = useNotification();
	const user = useAuthStore(state => state.user);
	const clearCart = useCartStore(state => state.clearCart);
	const cartItems = useCartStore(state => state.cartItems);
	const { selectedAddress } = useCheckoutContext();
	const { total } = usePaymentSummary();
	const [isProcessing, setIsProcessing] = useState(false);
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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
				items: cartItems,
			});

			clearCart();
			setIsSuccessModalOpen(true);
		} catch (error) {
			console.error("Payment Error:", error);
			showNotification("Payment failed. Please try again.", "error");
		} finally {
			setIsProcessing(false);
		}
	};

	const handleRedirectHome = () => {
		setIsSuccessModalOpen(false);
		router.push(routerPaths.order);
	};

	return {
		isProcessing,
		isSuccessModalOpen,
		handlePay,
		handleRedirectHome,
		handleBack: router.back,
	};
};
