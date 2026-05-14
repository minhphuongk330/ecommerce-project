"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "promo_popup_last_shown";
const SHOW_INTERVAL_MS = 24 * 60 * 60 * 1000; // 1 ngày

const PromoPopup = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const last = localStorage.getItem(STORAGE_KEY);
		const now = Date.now();
		if (!last || now - Number(last) > SHOW_INTERVAL_MS) {
			// Delay nhỏ để trang load xong mới hiện
			const t = setTimeout(() => setVisible(true), 800);
			return () => clearTimeout(t);
		}
	}, []);

	const close = () => {
		localStorage.setItem(STORAGE_KEY, String(Date.now()));
		setVisible(false);
	};

	if (!visible) return null;

	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
			style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
			onClick={close}
		>
			<div
				className="relative w-full max-w-[560px] rounded-2xl overflow-hidden shadow-2xl"
				onClick={e => e.stopPropagation()}
			>
				{/* Close button */}
				<button
					onClick={close}
					className="absolute top-3 right-3 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors text-lg leading-none"
					aria-label="Đóng"
				>
					&times;
				</button>

				{/* Banner content */}
				<div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-[320px] flex flex-col items-center justify-center px-8 py-10 text-center">
					{/* Decorative circles */}
					<div className="absolute top-[-60px] left-[-60px] w-[200px] h-[200px] rounded-full bg-white/5" />
					<div className="absolute bottom-[-40px] right-[-40px] w-[160px] h-[160px] rounded-full bg-white/5" />

					{/* Badge */}
					<span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
						Ưu đãi đặc biệt
					</span>

					{/* Headline */}
					<h2 className="text-white text-3xl md:text-4xl font-bold mb-2 leading-tight">
						Giảm đến <span className="text-red-400">50%</span>
					</h2>
					<p className="text-gray-300 text-sm md:text-base mb-6 max-w-[360px]">
						Hàng ngàn sản phẩm công nghệ chính hãng — điện thoại, laptop, tai nghe, đồng hồ thông minh.
					</p>

					{/* CTA */}
					<Link
						href="/products"
						onClick={close}
						className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm md:text-base"
					>
						Mua sắm ngay →
					</Link>

					{/* Dismiss */}
					<button
						onClick={close}
						className="mt-4 text-gray-500 hover:text-gray-300 text-xs transition-colors"
					>
						Bỏ qua, không cảm ơn
					</button>
				</div>
			</div>
		</div>
	);
};

export default PromoPopup;
