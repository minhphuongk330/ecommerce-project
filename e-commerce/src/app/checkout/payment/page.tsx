"use client";
import StepButton from "~/components/checkout/Button";
import SuccessModal from "~/components/Payment/Modal/Success";
import PaymentSummary from "~/components/Payment/Index";
import { usePayment } from "~/hooks/usePayment";

export default function PaymentPage() {
	const { isProcessing, isSuccessModalOpen, handlePay, handleRedirectHome, handleBack } = usePayment();

	return (
		<div className="w-full flex flex-col items-center px-4 md:px-0">
			<div className="w-full max-w-[700px] flex flex-col gap-6 md:gap-[32px]">
				<PaymentSummary />

				<StepButton
					layout="fixed"
					justify="end"
					primaryLabel="Pay"
					onPrimaryClick={handlePay}
					isLoading={isProcessing}
					secondaryLabel="Back"
					onSecondaryClick={handleBack}
					buttonClassName="!w-[180px] md:!w-[210px] !h-12 md:!h-[64px]"
					className="mt-[40px]"
				/>
			</div>

			<SuccessModal isOpen={isSuccessModalOpen} onConfirm={handleRedirectHome} />
		</div>
	);
}
