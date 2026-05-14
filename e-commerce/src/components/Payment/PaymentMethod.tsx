"use client";
import { useCheckoutContext } from "~/contexts/CheckoutContext";

export default function PaymentMethodSelector() {
	const { paymentMethod, setPaymentMethod } = useCheckoutContext();

	const methods = [
		{
			id: "COD" as const,
			label: "Thanh toán khi nhận hàng",
			desc: "Trả tiền mặt khi shipper giao hàng",
			icon: (
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<rect x="2" y="6" width="20" height="12" rx="2" />
					<circle cx="12" cy="12" r="3" />
					<path d="M6 12h.01M18 12h.01" />
				</svg>
			),
		},
		{
			id: "VNPAY" as const,
			label: "Thanh toán online (VNPay)",
			desc: "QR Code, ATM, Visa/Master, Ví điện tử",
			icon: (
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<rect x="2" y="4" width="20" height="16" rx="2" />
					<path d="M2 10h20" />
					<path d="M6 15h4M14 15h4" />
				</svg>
			),
		},
	];

	return (
		<div className="w-full border border-[#EBEBEB] rounded-[10px] p-4 md:p-[24px] bg-white shadow-sm">
			<h3 className="text-lg md:text-[20px] font-medium text-black mb-4">
				Phương thức thanh toán
			</h3>
			<div className="flex flex-col gap-3">
				{methods.map((m) => {
					const isSelected = paymentMethod === m.id;
					return (
						<button
							key={m.id}
							onClick={() => setPaymentMethod(m.id)}
							className={`flex items-center gap-4 w-full p-4 rounded-[8px] border-2 transition-all text-left cursor-pointer
								${isSelected
									? "border-black bg-black/[0.03]"
									: "border-[#EBEBEB] hover:border-gray-300"
								}`}
						>
							{/* Radio indicator */}
							<div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
								${isSelected ? "border-black" : "border-gray-300"}`}>
								{isSelected && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
							</div>

							{/* Icon */}
							<div className={`transition-colors ${isSelected ? "text-black" : "text-gray-400"}`}>
								{m.icon}
							</div>

							{/* Text */}
							<div className="flex flex-col">
								<span className={`font-medium text-sm md:text-base ${isSelected ? "text-black" : "text-gray-600"}`}>
									{m.label}
								</span>
								<span className="text-xs text-gray-400 mt-0.5">{m.desc}</span>
							</div>

							{/* VNPay badge */}
							{m.id === "VNPAY" && (
								<span className="ml-auto text-[10px] font-bold text-white bg-[#E51A1A] px-2 py-0.5 rounded">
									VNPay
								</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
