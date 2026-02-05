"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import StepButton from "~/components/checkout/Button";
import PaymentSummary from "~/components/Payment/Index";
import { usePayment } from "~/hooks/usePayment";

const SuccessModalLazy = dynamic(() => import("~/components/Payment/Modal/Success"), {
	loading: () => null,
});

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

			{isSuccessModalOpen && (
				<Suspense fallback={null}>
					<SuccessModalLazy isOpen={isSuccessModalOpen} onConfirm={handleRedirectHome} />
				</Suspense>
			)}
		</div>
	);
}
