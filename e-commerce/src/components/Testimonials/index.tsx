"use client";
import React, { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useTopReviews } from "~/hooks/useTopReviews";
import { Review } from "~/types/review";

const AVATAR_COLORS = [
	{ bg: "bg-red-100", text: "text-red-600" },
	{ bg: "bg-blue-100", text: "text-blue-600" },
	{ bg: "bg-green-100", text: "text-green-600" },
	{ bg: "bg-purple-100", text: "text-purple-600" },
	{ bg: "bg-orange-100", text: "text-orange-600" },
];

const getInitials = (name: string) => {
	const parts = name.trim().split(" ");
	if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatDate = (iso: string) => {
	const d = new Date(iso);
	return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

// Fallback khi chưa có review thật
const FALLBACK_REVIEWS = [
	{ id: -1, customerName: "Nguyễn Văn A", role: "Khách hàng thân thiết", rating: 5, comment: "Mua hàng tại đây rất hài lòng, sản phẩm chính hãng, giá tốt, giao hàng nhanh. Sẽ tiếp tục ủng hộ!", productName: "", date: "" },
	{ id: -2, customerName: "Trần Thị B", role: "Khách hàng VIP", rating: 5, comment: "Dịch vụ chăm sóc khách hàng rất tốt, nhân viên tư vấn nhiệt tình. Sản phẩm đúng như mô tả.", productName: "", date: "" },
	{ id: -3, customerName: "Lê Văn C", role: "Khách hàng thân thiết", rating: 5, comment: "Giá cả cạnh tranh, nhiều chương trình khuyến mãi hấp dẫn. Tôi đã mua nhiều lần và rất hài lòng.", productName: "", date: "" },
];

interface DisplayReview {
	id: number;
	productId?: number;
	customerName: string;
	role: string;
	rating: number;
	comment: string;
	productName: string;
	date: string;
}

const mapReview = (r: Review): DisplayReview => ({
	id: Number(r.id),
	productId: Number(r.productId),
	customerName: r.customer?.fullName ?? "Khách hàng",
	role: "Đã mua hàng",
	rating: r.rating,
	comment: r.comment ?? "",
	productName: (r as any).product?.name ?? "",
	date: formatDate(r.createdAt),
});

const CARD_WIDTH = 336;

const Testimonials: React.FC = () => {
	const { reviews, isLoading } = useTopReviews(10);
	const router = useRouter();
	const scrollRef = useRef<HTMLDivElement>(null);
	const [activeIdx, setActiveIdx] = useState(0);

	// Map data thật hoặc dùng fallback
	const displayReviews: DisplayReview[] =
		reviews.length > 0 ? reviews.map(mapReview) : FALLBACK_REVIEWS;

	// ── Drag to scroll ──────────────────────────────────────────
	const isDragging = useRef(false);
	const startX = useRef(0);
	const scrollLeft = useRef(0);
	const hasDragged = useRef(false); // phân biệt click vs drag

	const onMouseDown = (e: React.MouseEvent) => {
		isDragging.current = true;
		hasDragged.current = false;
		startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
		scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
		if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
	};

	const onMouseMove = (e: React.MouseEvent) => {
		if (!isDragging.current || !scrollRef.current) return;
		e.preventDefault();
		const x = e.pageX - scrollRef.current.offsetLeft;
		const walk = (x - startX.current) * 1.2;
		if (Math.abs(walk) > 5) hasDragged.current = true; // đủ xa mới tính là drag
		scrollRef.current.scrollLeft = scrollLeft.current - walk;
	};

	const stopDrag = () => {
		isDragging.current = false;
		if (scrollRef.current) scrollRef.current.style.cursor = "grab";
		updateActiveIdx();
	};

	const updateActiveIdx = useCallback(() => {
		if (!scrollRef.current) return;
		const idx = Math.round(scrollRef.current.scrollLeft / CARD_WIDTH);
		setActiveIdx(Math.min(idx, displayReviews.length - 1));
	}, [displayReviews.length]);

	const scrollTo = (idx: number) => {
		const clamped = Math.max(0, Math.min(idx, displayReviews.length - 1));
		setActiveIdx(clamped);
		scrollRef.current?.scrollTo({ left: clamped * CARD_WIDTH, behavior: "smooth" });
	};

	return (
		<div className="w-full bg-gray-50 py-10">
			<div className="max-w-[1440px] mx-auto px-4 md:px-[160px]">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h2 className="text-lg md:text-2xl font-bold text-gray-900">
							Khách hàng nói gì về chúng tôi
						</h2>
						<p className="text-sm text-gray-500 mt-1">Hơn 50.000 khách hàng tin tưởng lựa chọn</p>
					</div>
					{/* Arrow buttons */}
					<div className="hidden md:flex items-center gap-2">
						<button
							onClick={() => scrollTo(activeIdx - 1)}
							disabled={activeIdx === 0}
							className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-red-600 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						>
							<ChevronLeft fontSize="small" />
						</button>
						<button
							onClick={() => scrollTo(activeIdx + 1)}
							disabled={activeIdx === displayReviews.length - 1}
							className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-red-600 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						>
							<ChevronRight fontSize="small" />
						</button>
					</div>
				</div>

				{/* Skeleton */}
				{isLoading ? (
					<div className="flex gap-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex-shrink-0 w-[320px] h-[180px] bg-gray-200 animate-pulse rounded-2xl" />
						))}
					</div>
				) : (
					<div
						ref={scrollRef}
						onMouseDown={onMouseDown}
						onMouseMove={onMouseMove}
						onMouseUp={stopDrag}
						onMouseLeave={stopDrag}
						onScroll={updateActiveIdx}
						className="flex gap-4 overflow-x-auto pb-4 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
						style={{ cursor: "grab" }}
					>
						{displayReviews.map((r, idx) => {
							const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
							const isReal = r.id > 0; // fallback có id âm
							const handleCardClick = () => {
								if (!isReal || !r.productId || hasDragged.current) return;
								router.push(`/products/${r.productId}#reviews`);
							};

							return (
								<div
									key={r.id}
									onClick={handleCardClick}
									className={`flex-shrink-0 w-[280px] md:w-[320px] bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 transition-all duration-200 ${
										isReal && r.productId
											? "cursor-pointer hover:shadow-md hover:border-red-100 hover:-translate-y-0.5"
											: "cursor-default"
									}`}
								>
									{/* Quote */}
									<span className="text-3xl text-gray-200 font-serif leading-none">"</span>
									<p className="text-sm text-gray-600 leading-relaxed flex-1 -mt-3 line-clamp-4">
										{r.comment || "Sản phẩm rất tốt!"}
									</p>

									{/* Product name + link hint */}
									{r.productName && (
										<p className="text-xs text-gray-400 italic flex items-center gap-1">
											Đã mua: {r.productName}
											{r.productId && (
												<span className="text-red-500 font-medium not-italic">→ Xem sản phẩm</span>
											)}
										</p>
									)}

									{/* Stars */}
									<div className="flex items-center gap-1">
										{Array.from({ length: 5 }).map((_, i) => (
											<span
												key={i}
												className={`text-sm ${i < r.rating ? "text-yellow-400" : "text-gray-200"}`}
											>
												★
											</span>
										))}
										{r.date && (
											<span className="text-xs text-gray-400 ml-auto">{r.date}</span>
										)}
									</div>

									{/* Author */}
									<div className="flex items-center gap-3 pt-2 border-t border-gray-50">
										<div className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center flex-shrink-0`}>
											<span className={`text-sm font-bold ${color.text}`}>
												{getInitials(r.customerName)}
											</span>
										</div>
										<div>
											<p className="font-semibold text-sm text-gray-900">{r.customerName}</p>
											<p className="text-xs text-gray-400">{r.role}</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{/* Dots */}
				{!isLoading && (
					<div className="flex justify-center gap-2 mt-4">
						{displayReviews.map((_, idx) => (
							<button
								key={idx}
								onClick={() => scrollTo(idx)}
								className={`h-1.5 rounded-full transition-all ${
									activeIdx === idx ? "bg-red-600 w-6" : "bg-gray-300 w-1.5"
								}`}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Testimonials;
