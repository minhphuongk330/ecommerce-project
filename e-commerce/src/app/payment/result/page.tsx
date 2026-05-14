"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axiosClient from "~/services/axiosClient";

export default function PaymentResultPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const status = searchParams.get("status");
	const [result, setResult] = useState<{
		success: boolean;
		orderNo?: string;
		message: string;
	} | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Lấy tất cả query params từ URL (VNPay gửi về)
		const params: Record<string, string> = {};
		searchParams.forEach((value, key) => {
			params[key] = value;
		});

		if (params["vnp_ResponseCode"]) {
			// Gọi backend verify VNPay
			axiosClient
				.get("/payments/vnpay-return", { params })
				.then((res: any) => setResult(res))
				.catch(() => setResult({ success: false, message: "Không thể xác nhận thanh toán" }))
				.finally(() => setLoading(false));
		} else if (status === "success") {
			// Thanh toán COD thành công
			setResult({ success: true, message: "Đặt hàng thành công", orderNo: params["orderNo"] });
			setLoading(false);
		} else {
			setResult({ success: false, message: "Thanh toán đã bị huỷ" });
			setLoading(false);
		}
	}, [searchParams, status]);

	if (loading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
					<p className="text-gray-500">Đang xác nhận thanh toán...</p>
				</div>
			</div>
		);
	}

	const isSuccess = result?.success;

	return (
		<div className="min-h-[60vh] flex items-center justify-center px-4">
			<div className="w-full max-w-md text-center border border-[#EBEBEB] rounded-[16px] p-8 bg-white shadow-sm">
				{/* Icon */}
				<div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center
					${isSuccess ? "bg-green-100" : "bg-red-100"}`}>
					{isSuccess ? (
						<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
							<path d="M20 6L9 17l-5-5" />
						</svg>
					) : (
						<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					)}
				</div>

				<h1 className={`text-2xl font-bold mb-2 ${isSuccess ? "text-green-700" : "text-red-600"}`}>
					{isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
				</h1>

				{result?.orderNo && (
					<p className="text-gray-500 text-sm mb-1">
						Mã đơn hàng: <span className="font-mono font-medium text-black">{result.orderNo}</span>
					</p>
				)}

				<p className="text-gray-400 text-sm mb-8">{result?.message}</p>

				<div className="flex flex-col gap-3">
					{isSuccess ? (
						<>
							<Link
								href="/profile/orders"
								className="w-full py-3 bg-black text-white rounded-[8px] font-medium hover:bg-gray-800 transition-colors"
							>
								Xem đơn hàng
							</Link>
							<Link
								href="/"
								className="w-full py-3 border border-[#EBEBEB] text-black rounded-[8px] font-medium hover:bg-gray-50 transition-colors"
							>
								Tiếp tục mua sắm
							</Link>
						</>
					) : (
						<>
							<button
								onClick={() => router.back()}
								className="w-full py-3 bg-black text-white rounded-[8px] font-medium hover:bg-gray-800 transition-colors"
							>
								Thử lại
							</button>
							<Link
								href="/"
								className="w-full py-3 border border-[#EBEBEB] text-black rounded-[8px] font-medium hover:bg-gray-50 transition-colors"
							>
								Về trang chủ
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
