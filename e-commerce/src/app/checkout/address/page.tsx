"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddressList from "~/components/Address/List";
import CreateAddress from "~/components/Address/Modal/Create";
import StepButton from "~/components/checkout/Button";
import { useCheckoutContext } from "~/contexts/CheckoutContext";
import { useNotification } from "~/contexts/Notification";
import { useAddress } from "~/hooks/useAddress";
import { routerPaths } from "~/utils/router";

export default function AddressPage() {
	const router = useRouter();
	const { showNotification } = useNotification();
	const { addresses, refresh } = useAddress();
	const { selectedAddress, setSelectedAddress } = useCheckoutContext();
	const [selectedId, setSelectedId] = useState<number | null>(selectedAddress?.id ? Number(selectedAddress.id) : null);

	const handleNext = () => {
		if (!selectedId) {
			showNotification("Please select an address to continue.", "error");
			return;
		}

		const address = addresses.find(a => a.id === selectedId);

		if (address) {
			setSelectedAddress(address);
			router.push(routerPaths.shipping);
		} else {
			showNotification("Selected address not found.", "error");
		}
	};

	return (
		<div className="w-full flex flex-col gap-[64px]">
			<div className="w-full max-w-[1120px] mx-auto flex flex-col gap-[24px]">
				<AddressList addresses={addresses} selectedId={selectedId} onSelect={setSelectedId} onRefresh={refresh} />

				<CreateAddress onSuccess={refresh} />

				<StepButton
					layout="fixed"
					justify="end"
					primaryLabel="Next"
					onPrimaryClick={handleNext}
					disabled={!addresses.length || !selectedId}
					secondaryLabel="Back"
					onSecondaryClick={() => router.back()}
					className="mt-[40px] lg:mt-[100px]"
					buttonClassName="!w-[210px] !h-[64px]"
				/>
			</div>
		</div>
	);
}
