"use client";
import StepButton from "~/components/checkout/Button";
import ShippingList from "~/components/Shipping/Index";
import { useShipping } from "~/hooks/useShipping";

export default function ShippingPage() {
	const { shippingMethods, methodId, setMethodId, date, setDate, handleNext, handleBack } = useShipping();

	return (
		<div className="w-full flex flex-col gap-8 md:gap-[64px] px-4 md:px-0">
			<div className="w-full max-w-[1120px] mx-auto flex flex-col gap-4 md:gap-[32px]">
				<h2 className="text-lg md:text-[20px] font-medium text-black">Shipment Method</h2>

				<ShippingList
					methods={shippingMethods}
					selectedMethodId={methodId}
					onSelectMethod={setMethodId}
					scheduledDate={date}
					onDateChange={setDate}
				/>

				<StepButton
					layout="fixed"
					justify="end"
					primaryLabel="Next"
					onPrimaryClick={handleNext}
					disabled={shippingMethods.length === 0}
					secondaryLabel="Back"
					onSecondaryClick={handleBack}
					className="mt-[100px] lg:mt-[224px]"
					buttonClassName="!w-[180px] md:!w-[210px] !h-12 md:!h-[64px]"
				/>
			</div>
		</div>
	);
}
