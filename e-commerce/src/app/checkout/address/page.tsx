"use client";
import { useRouter } from "next/navigation";
import AddressList from "~/components/Address/List";
import CreateAddress from "~/components/Address/Modal/Create";
import StepButton from "~/components/checkout/Button";
import { FormSkeleton } from "~/components/Skeletons";
import { useCheckoutContext } from "~/contexts/CheckoutContext";
import { useNotification } from "~/contexts/Notification";
import { useAddress } from "~/hooks/useAddress";
import { useCartStore } from "~/stores/cart";
import { routerPaths } from "~/utils/router";

export default function AddressPage() {
	const router = useRouter();
	const { showNotification } = useNotification();
	const { addresses, refresh, isLoading } = useAddress();
	const { setSelectedAddress } = useCheckoutContext();
	const selectedAddressId = useCartStore(state => state.selectedAddressId);
	const setSelectedAddressId = useCartStore(state => state.setSelectedAddressId);

	const handleCreateSuccess = async (newAddress?: any) => {
		await refresh();
		if (newAddress) {
			setSelectedAddressId(newAddress.id);
		}
	};

	const handleNext = () => {
		if (!selectedAddressId) {
			showNotification("Please select an address to continue.", "error");
			return;
		}

		const address = addresses.find(a => a.id === selectedAddressId);
		if (address) {
			setSelectedAddress(address);
			router.push(routerPaths.shipping);
		} else {
			showNotification("Selected address not found.", "error");
		}
	};

	if (isLoading) {
		return (
			<div className="w-full flex flex-col gap-8 md:gap-[64px]">
				<div className="w-full max-w-[1120px] mx-auto flex flex-col gap-4 md:gap-[24px]">
					<FormSkeleton fields={3} />
				</div>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-8 md:gap-[64px]">
			<div className="w-full max-w-[1120px] mx-auto flex flex-col gap-4 md:gap-[24px]">
				<AddressList
					addresses={addresses}
					selectedId={selectedAddressId}
					onSelect={setSelectedAddressId}
					onRefresh={refresh}
				/>

				<CreateAddress onSuccess={handleCreateSuccess} />

				<StepButton
					layout="fixed"
					justify="end"
					primaryLabel="Next"
					onPrimaryClick={handleNext}
					disabled={!addresses.length || !selectedAddressId}
					secondaryLabel="Back"
					onSecondaryClick={() => router.back()}
					className="mt-6 lg:mt-[100px]"
					buttonClassName="!w-full md:!w-[210px] !h-12 md:!h-[64px]"
				/>
			</div>
		</div>
	);
}
