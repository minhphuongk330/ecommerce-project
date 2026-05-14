"use client";
import React from "react";
import Link from "next/link";

const ACCESSORY_CATEGORIES = [
	{ name: "Điện thoại", href: "/products?categoryId=1", icon: "📱" },
	{ name: "Laptop", href: "/products?categoryId=2", icon: "💻" },
	{ name: "Tai nghe", href: "/products?categoryId=3", icon: "🎧" },
	{ name: "Máy ảnh", href: "/products?categoryId=4", icon: "📷" },
	{ name: "Đồng hồ", href: "/products?categoryId=5", icon: "⌚" },
	{ name: "Gaming", href: "/products?categoryId=6", icon: "🎮" },
];

const AccessoryScroll: React.FC = () => {
	return (
		<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-4">
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-base md:text-lg font-bold text-gray-900">Danh mục sản phẩm</h2>
			</div>
			<div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
				{ACCESSORY_CATEGORIES.map(cat => (
					<Link
						key={cat.name}
						href={cat.href}
						className="flex-shrink-0 flex flex-col items-center gap-1.5 w-[72px] md:w-[88px] group"
					>
						<div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-full bg-gray-100 group-hover:bg-red-50 flex items-center justify-center text-2xl transition-colors">
							{cat.icon}
						</div>
						<span className="text-[11px] md:text-xs text-gray-700 text-center leading-tight font-medium">
							{cat.name}
						</span>
					</Link>
				))}
			</div>
		</div>
	);
};

export default AccessoryScroll;
