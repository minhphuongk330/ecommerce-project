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
	const { selectedAddress, selectedShippingMethod, paymentMethod, appliedCoupon, appliedShippingCoupon } = useCheckoutContext();
	const { total, subtotal, taxAmount, shippingCost, deliveryDateForAPI, discount, shippingDiscount } = usePaymentSummary();
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
			showNotification("Vui lòng đăng nhập để thanh toán.", "warning");
			return;
		}
		if (!selectedAddress) {
			showNotification("Vui lòng chọn địa chỉ giao hàng.", "warning");
			return;
		}
		if (cartItems.length === 0) {
			showNotification("Giỏ hàng của bạn đang trống.", "warning");
			return;
		}
		setIsProcessing(true);

		try {
			const checkoutParams = {
				userId: Number(user.id),
				addressId: selectedAddress.id,
				totalAmount: total,
				subtotal: subtotal,
				taxAmount: taxAmount,
				shippingCost: shippingCost,
				items: cartItems as any,
				scheduledDeliveryDate: deliveryDateForAPI,
				paymentMethod,
				discount,
				shippingDiscount,
				appliedCouponCode: appliedCoupon?.coupon.code,
				appliedShippingCouponCode: appliedShippingCoupon?.coupon.code,
			};

			if (paymentMethod === "VNPAY") {

				const { paymentUrl } = await orderService.createVnpayCheckout(checkoutParams);
				clearCart();
				setIsPaid(true);
				window.location.href = paymentUrl;
			} else {

				const newOrder = await orderService.createFullOrder(checkoutParams);
				clearCart();
				setIsPaid(true);
				router.push(`/payment/result?status=success&orderNo=${newOrder.orderNo}&orderId=${newOrder.id}`);
			}
		} catch (error: any) {
			console.error("Payment Error:", error);
			const errorMessage = error?.response?.data?.message || error?.message || "";
			if (errorMessage.includes("Insufficient stock")) {
				showNotification(errorMessage, "error");
			} else {
				showNotification("Thanh toán thất bại. Vui lòng thử lại.", "error");
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
		paymentMethod,
		handlePay,
		handleRedirectHome,
		handleContinueShopping,
		handleBack: router.back,
	};
};
