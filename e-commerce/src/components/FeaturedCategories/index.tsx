"use client";
import React from "react";
import Link from "next/link";

// Featured categories data - bạn có thể thay bằng data thật từ API
const FEATURED_CATEGORIES = [
	{
		id: 1,
		name: "Điện thoại",
		description: "Smartphone mới nhất",
		icon: "📱",
		color: "from-blue-500 to-blue-600",
		productCount: 156,
		href: "/products?categoryId=1"
	},
	{
		id: 2,
		name: "Laptop",
		description: "Hiệu năng mạnh mẽ",
		icon: "💻",
		color: "from-purple-500 to-purple-600",
		productCount: 89,
		href: "/products?categoryId=2"
	},
	{
		id: 3,
		name: "Tai nghe",
		description: "Âm thanh chất lượng",
		icon: "🎧",
		color: "from-green-500 to-green-600",
		productCount: 234,
		href: "/products?categoryId=3"
	},
	{
		id: 4,
		name: "Đồng hồ",
		description: "Thông minh thời trang",
		icon: "⌚",
		color: "from-orange-500 to-orange-600",
		productCount: 67,
		href: "/products?categoryId=4"
	},
	{
		id: 5,
		name: "Máy ảnh",
		description: "Khoảnh khắc hoàn hảo",
		icon: "📷",
		color: "from-pink-500 to-pink-600",
		productCount: 45,
		href: "/products?categoryId=5"
	},
	{
		id: 6,
		name: "Phụ kiện",
		description: "Bổ trợ hoàn hảo",
		icon: "🎯",
		color: "from-red-500 to-red-600",
		productCount: 512,
		href: "/products?categoryId=6"
	}
];

const FeaturedCategories: React.FC = () => {
	return (
		<div className="w-full py-12">
			<div className="max-w-[1440px] mx-auto px-4 md:px-[160px]">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
							Danh mục nổi bật
						</h2>
						<p className="text-gray-600 text-lg">
							Khám phá sản phẩm theo danh mục bạn quan tâm
						</p>
					</div>
					<Link
						href="/categories"
						className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
					>
						Xem tất cả danh mục
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<line x1="5" y1="12" x2="19" y2="12"></line>
							<polyline points="12 5 19 12 12 19"></polyline>
						</svg>
					</Link>
				</div>

				{/* Categories Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{FEATURED_CATEGORIES.map((category, index) => (
						<Link
							key={category.id}
							href={category.href}
							className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
							style={{ animationDelay: `${index * 100}ms` }}
						>
							{/* Gradient Background */}
							<div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

							{/* Content */}
							<div className="relative p-6">
								<div className="flex items-start justify-between mb-4">
									<div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
										{category.icon}
									</div>
									<span className="text-sm text-gray-500 font-medium">
										{category.productCount} sản phẩm
									</span>
								</div>

								<div>
									<h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
										{category.name}
									</h3>
									<p className="text-gray-600 text-sm mb-4">
										{category.description}
									</p>
								</div>

								{/* Hover indicator */}
								<div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 transition-colors">
									<span className="text-sm font-medium">Khám phá</span>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
										<line x1="5" y1="12" x2="19" y2="12"></line>
										<polyline points="12 5 19 12 12 19"></polyline>
									</svg>
								</div>
							</div>

							{/* Decorative corner */}
							<div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${category.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity duration-300`} />
						</Link>
					))}
				</div>

				{/* Bottom Stats */}
				<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="text-center p-6 bg-gray-50 rounded-xl">
						<div className="text-3xl font-bold text-gray-900 mb-2">1,103</div>
						<div className="text-gray-600">Sản phẩm chính hãng</div>
					</div>
					<div className="text-center p-6 bg-gray-50 rounded-xl">
						<div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
						<div className="text-gray-600">Thương hiệu uy tín</div>
					</div>
					<div className="text-center p-6 bg-gray-50 rounded-xl">
						<div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
						<div className="text-gray-600">Hỗ trợ khách hàng</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FeaturedCategories;
