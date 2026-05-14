"use client";
import React from "react";
import Link from "next/link";

const TRUST_ITEMS = [
	{
		icon: "🛡️",
		title: "Hàng chính hãng 100%",
		desc: "Cam kết lỗi đổi liền",
		href: "/about",
	},
	{
		icon: "🔄",
		title: "Đổi trả trong 30 ngày",
		desc: "Không cần lý do",
		href: "/contact",
	},
	{
		icon: "🔒",
		title: "Thanh toán bảo mật",
		desc: "Mã hóa SSL 256-bit",
		href: "/contact",
	},
	{
		icon: "🎧",
		title: "Hỗ trợ 24/7",
		desc: "Tư vấn miễn phí",
		href: "/contact",
	},
];

const TrustBar: React.FC = () => {
	return (
		<div className="w-full border-y border-gray-100 bg-gray-50">
			<div className="max-w-[1440px] mx-auto px-4 md:px-[160px]">
				<div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
					{TRUST_ITEMS.map((item) => (
						<Link
							key={item.title}
							href={item.href}
							className="flex items-center gap-3 px-4 py-4 hover:bg-white transition-colors group"
						>
							<span className="text-2xl flex-shrink-0">{item.icon}</span>
							<div className="min-w-0">
								<p className="text-[13px] font-semibold text-gray-800 leading-tight group-hover:text-red-600 transition-colors">
									{item.title}
								</p>
								<p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default TrustBar;
