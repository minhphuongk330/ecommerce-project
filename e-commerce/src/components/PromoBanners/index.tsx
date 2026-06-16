"use client";
import Link from "next/link";
import React from "react";


const LaptopIcon = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<rect x="2" y="4" width="20" height="12" rx="2" ry="2"></rect>
		<line x1="6" y1="20" x2="18" y2="20"></line>
	</svg>
);

const HeadphonesIcon = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
		<path d="M21 18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3"></path>
	</svg>
);

const SmartphoneIcon = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
		<line x1="12" y1="18" x2="12.01" y2="18"></line>
	</svg>
);

const ShoppingBagIcon = () => (
	<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
		<line x1="3" y1="6" x2="21" y2="6"></line>
		<path d="M16 10a4 4 0 0 1-8 0"></path>
	</svg>
);

const ClockIcon = () => (
	<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="12" cy="12" r="10"></circle>
		<polyline points="12 6 12 12 16 14"></polyline>
	</svg>
);

const FlameIcon = () => (
	<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M12 2L12 7"></path>
		<path d="M12 22C16 22 20 18 20 14C20 12 18 10 16 9C16 11 14 13 12 13C10 13 8 11 8 9C6 10 4 12 4 14C4 18 8 22 12 22Z"></path>
	</svg>
);

interface PromoBanner {
	id: number;
	label: string;
	title: string;
	subtitle: string;
	badge?: string;
	badgeType?: "hot" | "new" | "limited";
	href: string;
	bg: string;
	textColor: string;
	accentColor: string;
	icon: React.ComponentType<any>;
}

const PROMO_BANNERS: PromoBanner[] = [
	{
		id: 1,
		label: "Ưu đãi hôm nay",
		title: "Giảm đến 30%",
		subtitle: "Toàn bộ dòng Laptop",
		badge: "Hot",
		badgeType: "hot",
		href: "/products?categoryId=2",
		bg: "bg-gradient-to-br from-blue-600 to-blue-800",
		textColor: "text-white",
		accentColor: "bg-yellow-400 text-blue-900",
		icon: LaptopIcon,
	},
	{
		id: 2,
		label: "Deal cuối tuần",
		title: "Mua 1 tặng 1",
		subtitle: "Phụ kiện tai nghe",
		badge: "Limited",
		badgeType: "limited",
		href: "/products?categoryId=3",
		bg: "bg-gradient-to-br from-purple-600 to-pink-600",
		textColor: "text-white",
		accentColor: "bg-white text-purple-700",
		icon: HeadphonesIcon,
	},
	{
		id: 3,
		label: "Flash deal",
		title: "Giảm 500K",
		subtitle: "Điện thoại từ 5 triệu",
		badge: "New",
		badgeType: "new",
		href: "/products?categoryId=1",
		bg: "bg-gradient-to-br from-red-500 to-orange-500",
		textColor: "text-white",
		accentColor: "bg-white text-red-600",
		icon: SmartphoneIcon,
	},
];


const Badge: React.FC<{ type?: "hot" | "new" | "limited"; children: string }> = ({ type, children }) => {
	const baseClasses = "flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1";

	switch (type) {
		case "hot":
			return (
				<span className={`${baseClasses} bg-red-500 text-white`}>
					<FlameIcon />
					{children}
				</span>
			);
		case "new":
			return (
				<span className={`${baseClasses} bg-green-500 text-white`}>
					<ShoppingBagIcon />
					{children}
				</span>
			);
		case "limited":
			return (
				<span className={`${baseClasses} bg-yellow-400 text-gray-900`}>
					<ClockIcon />
					{children}
				</span>
			);
		default:
			return <span className={`${baseClasses} bg-gray-200 text-gray-800`}>{children}</span>;
	}
};

const PromoBanners: React.FC = () => {
	return (
		<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8">

			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 text-gray-700">
						<ShoppingBagIcon />
					</div>
					<h2 className="text-xl md:text-2xl font-bold text-gray-900">Ưu đãi nổi bật</h2>
				</div>
				<Link
					href="/products"
					className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
				>
					Xem tất cả →
				</Link>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
				{PROMO_BANNERS.map((banner) => (
					<Link
						key={banner.id}
						href={banner.href}
						className={`${banner.bg} rounded-2xl p-5 md:p-6 flex items-center gap-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden`}
					>

						<div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />


						<div className="relative flex-shrink-0">
							<div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
								<banner.icon className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
							</div>
						</div>


						<div className="flex-1 min-w-0">
							<p className={`text-xs font-medium opacity-90 mb-1 ${banner.textColor} uppercase tracking-wider`}>
								{banner.label}
							</p>
							<h3 className={`text-lg md:text-xl font-bold leading-tight ${banner.textColor} mb-1`}>
								{banner.title}
							</h3>
							<p className={`text-sm opacity-90 ${banner.textColor}`}>
								{banner.subtitle}
							</p>
						</div>


						{banner.badge && (
							<div className="flex-shrink-0">
								<Badge type={banner.badgeType}>
									{banner.badge}
								</Badge>
							</div>
						)}


						<div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
							<div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
								<span className="text-white text-xs">→</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default PromoBanners;
