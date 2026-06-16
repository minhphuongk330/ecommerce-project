import React from "react";

export default function ContactSidebar() {
	return (
		<div className="space-y-6">
			<div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-6">
				<h3 className="text-base font-semibold text-black mb-4">Thông tin liên hệ</h3>
				<div className="space-y-4 text-gray-600">
					<div className="flex items-start gap-3">
						<svg className="w-5 h-5 mt-0.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
						<div>
							<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
							<p className="text-sm font-medium text-gray-800">support@cyberstore.vn</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<svg className="w-5 h-5 mt-0.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
						</svg>
						<div>
							<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Điện thoại</p>
							<p className="text-sm font-medium text-gray-800">1900 xxxx</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<svg className="w-5 h-5 mt-0.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<div>
							<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Giờ làm việc</p>
							<p className="text-sm font-medium text-gray-800">Thứ 2 - Thứ 7, 8:00 - 21:00</p>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-black rounded-2xl p-6 text-white shadow-sm">
				<h3 className="text-base font-semibold mb-2 flex items-center gap-2">
					<span>⚡</span> Phản hồi nhanh
				</h3>
				<p className="text-xs text-gray-300 leading-relaxed">
					Chúng tôi thường phản hồi trong vòng 24 giờ làm việc. Các yêu cầu kỹ thuật chuyên sâu có thể mất nhiều thời gian hơn.
				</p>
			</div>

			<div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-6">
				<h3 className="text-base font-semibold text-black mb-3">Câu hỏi thường gặp</h3>
				<div className="space-y-3.5 text-xs text-gray-600">
					<p><span className="font-semibold text-gray-800">Đổi trả hàng?</span> Hỗ trợ trong 30 ngày kể từ lúc mua.</p>
					<p><span className="font-semibold text-gray-800">Chế độ bảo hành?</span> Bảo hành 12 tháng chính hãng.</p>
					<p><span className="font-semibold text-gray-800">Theo dõi đơn hàng?</span> Tra cứu trực tiếp tại tab Đơn hàng.</p>
				</div>
			</div>
		</div>
	);
}
