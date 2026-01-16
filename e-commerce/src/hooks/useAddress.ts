import { useState, useEffect, useCallback } from "react";
import { addressService } from "~/services/address";
import { Address } from "~/types/address";
import { useAuthStore } from "~/stores/useAuth";

export const useAddress = () => {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const user = useAuthStore(state => state.user);

	const fetchAddresses = useCallback(async () => {
		if (!user?.id) {
			setAddresses([]);

			return;
		}

		try {
			setIsLoading(true);
			const data = await addressService.getMyAddresses(Number(user.id));
			setAddresses(data);
		} catch (error) {
			console.error("Failed to fetch addresses:", error);
			setAddresses([]);
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	useEffect(() => {
		fetchAddresses();
	}, [fetchAddresses]);

	return { addresses, isLoading, refresh: fetchAddresses };
};
