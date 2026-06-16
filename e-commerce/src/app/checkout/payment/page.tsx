"use client";
import SummaryCard from "~/components/Payment/SummaryCard";
import CouponSelector from "~/components/Payment/CouponSelector";
import PaymentMethodSelector from "~/components/Payment/PaymentMethod";
import { usePayment } from "~/hooks/usePayment";

export default function PaymentPage() {
	const {
		isProcessing,
		isRedirecting,
		handlePay,
		handleBack,
	} = usePayment();

	if (isRedirecting) return null;

	return (
		<div className="w-full px-4 md:px-0">
			<div className="w-full max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
					<SummaryCard />

					<div className="flex flex-col gap-4">
						<CouponSelector />
						<PaymentMethodSelector />
						<div className="flex gap-3 mt-1">
							<button
								onClick={handleBack}
								className="flex-1 h-12 border border-[#EBEBEB] rounded-[8px] text-black font-medium hover:bg-gray-50 transition-colors"
							>
								Quay lại
							</button>
							<button
								onClick={handlePay}
								disabled={isProcessing}
								className="flex-1 h-12 bg-black text-white rounded-[8px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{isProcessing ? (
									<>
										<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Đang xử lý...
									</>
								) : "Thanh toán"}
							</button>
						</div>
					</div>
				</div>
			</div>
	);
}
