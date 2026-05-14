"use client";
import React from "react";

const STATS = [
	{ value: "50.000+", label: "Khách hàng tin dùng" },
	{ value: "10.000+", label: "Sản phẩm chính hãng" },
	{ value: "99%", label: "Đánh giá hài lòng" },
	{ value: "5 năm", label: "Kinh nghiệm hoạt động" },
];

const StatsSection: React.FC = () => {
	return (
		<div className="w-full bg-black py-10">
			<div className="max-w-[1440px] mx-auto px-4 md:px-[160px]">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
					{STATS.map((stat) => (
						<div key={stat.label} className="flex flex-col items-center gap-1">
							<span className="text-3xl md:text-4xl font-black text-white">{stat.value}</span>
							<span className="text-sm text-gray-400">{stat.label}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default StatsSection;
