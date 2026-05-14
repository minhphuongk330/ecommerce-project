"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const BADGES = [
	{ icon: "✓", text: "Sản phẩm chính hãng 100%" },
	{ icon: "↺", text: "Cam kết lỗi đổi liền" },
	{ icon: "☎", text: "Hotline hỗ trợ 24/7" },
	{ icon: "🔒", text: "Thanh toán bảo mật" },
	{ icon: "★", text: "Bảo hành chính hãng 12 tháng" },
];

const TopBar: React.FC = () => {
	const trackRef = useRef<HTMLDivElement>(null);
	const [isPaused, setIsPaused] = useState(false);

	// Auto-scroll animation via CSS — dùng keyframes inline
	return (
		<>
			<style>{`
				@keyframes topbar-scroll {
					0%   { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}
				.topbar-track {
					animation: topbar-scroll 22s linear infinite;
				}
				.topbar-track:hover {
					animation-play-state: paused;
				}
			`}</style>

			<div className="w-full bg-[#1a1a1a] text-white overflow-hidden" style={{ height: 36 }}>
				<div className="relative flex items-center h-full overflow-hidden">
					{/* Scrolling track — duplicate items để loop mượt */}
					<div
						ref={trackRef}
						className="topbar-track flex items-center gap-0 whitespace-nowrap"
					>
						{[...BADGES, ...BADGES].map((badge, i) => (
							<React.Fragment key={i}>
								<span className="flex items-center gap-1.5 px-6 text-[13px] font-medium">
									<span className="text-yellow-400 text-sm">{badge.icon}</span>
									<span>{badge.text}</span>
								</span>
								<span className="text-gray-600 text-lg select-none">|</span>
							</React.Fragment>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default TopBar;
