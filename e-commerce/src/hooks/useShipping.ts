import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShippingMethod } from "~/hooks/useShippingMethod";
import { useCheckoutContext } from "~/contexts/CheckoutContext";
import { useNotification } from "~/contexts/Notification";
import { routerPaths } from "~/utils/router";

export const useShipping = () => {
	const router = useRouter();
	const { showNotification } = useNotification();
	const { shippingMethods } = useShippingMethod();

	const {
		selectedShippingMethod,
		setSelectedShippingMethod,
		scheduledDate: ctxDate,
		setScheduledDate: setCtxDate,
	} = useCheckoutContext();

	const [methodId, setMethodId] = useState<string>(() => selectedShippingMethod?.id || "");
	const [date, setDate] = useState<string>(() => ctxDate || "");

	useEffect(() => {
		if (shippingMethods.length > 0 && !methodId) {
			setMethodId(selectedShippingMethod?.id || shippingMethods[0].id);
		}
	}, [shippingMethods, methodId, selectedShippingMethod]);

	const handleNext = () => {
		if (methodId === "schedule" && !date) {
			return showNotification("Please select a delivery date.", "error");
		}

		const method = shippingMethods.find(m => m.id === methodId);

		if (method) {
			setSelectedShippingMethod(method);

			setCtxDate(methodId === "schedule" ? date : null);

			router.push(routerPaths.payment);
		} else {
			showNotification("Invalid shipping method selected.", "error");
		}
	};

	return {
		shippingMethods,
		methodId,
		setMethodId,
		date,
		setDate,
		handleNext,
		handleBack: router.back,
	};
};
