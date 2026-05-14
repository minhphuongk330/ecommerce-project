"use client";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import EditOutlined from "@mui/icons-material/EditOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";

interface CouponListProps {
	coupons: any[];
	onToggleActive: (id: string, isActive: boolean) => void;
	onToggleHomepage: (id: string, showOnHomepage: boolean) => void;
	onEdit: (coupon: any) => void;
	onDelete: (id: string) => void;
}

const formatDate = (d?: string) => {
	if (!d) return "Không giới hạn";
	const date = new Date(d);
	return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const formatDiscount = (coupon: any) => {
	if (coupon.discountType === "percent") {
		return `-${coupon.discountValue}%${coupon.maxDiscountAmount ? ` (tối đa ${Number(coupon.maxDiscountAmount).toLocaleString("vi-VN")}₫)` : ""}`;
	}
	return `-${Number(coupon.discountValue).toLocaleString("vi-VN")}₫`;
};

const statusBadge = (coupon: any) => {
	const now = new Date();
	const expired = coupon.expiresAt && new Date(coupon.expiresAt) < now;
	const exhausted = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

	if (!coupon.isActive) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Tắt</span>;
	if (expired) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">Hết hạn</span>;
	if (exhausted) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Hết lượt</span>;
	return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">Hoạt động</span>;
};

export default function CouponList({ coupons, onToggleActive, onToggleHomepage, onEdit, onDelete }: CouponListProps) {
	if (coupons.length === 0) {
		return (
			<div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
				<p className="text-4xl mb-3">🎁</p>
				<p className="text-gray-500 font-medium">Chưa có coupon nào</p>
				<p className="text-gray-400 text-sm mt-1">Nhấn "Tạo coupon" để bắt đầu</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
			{/* Table header */}
			<div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
				<span>Mã / Mô tả</span>
				<span>Giảm giá</span>
				<span>Đơn tối thiểu</span>
				<span>Lượt dùng</span>
				<span>Hết hạn</span>
				<span>Thao tác</span>
			</div>

			<div className="divide-y divide-gray-50">
				{coupons.map((coupon) => (
					<div key={coupon.id} className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 px-5 py-4 items-center hover:bg-gray-50/50 transition-colors">
						{/* Code + desc */}
						<div className="flex items-start gap-3">
							{/* Active toggle */}
							<label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-0.5">
								<input
									type="checkbox"
									checked={coupon.isActive}
									onChange={(e) => onToggleActive(coupon.id, e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-4 peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
							</label>
							<div className="min-w-0">
								<div className="flex items-center gap-2 flex-wrap">
									<span className="font-bold text-sm text-gray-800 tracking-widest bg-gray-100 px-2 py-0.5 rounded font-mono">
										{coupon.code}
									</span>
									{statusBadge(coupon)}
									{coupon.showOnHomepage && (
										<span className="flex items-center gap-0.5 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full font-medium">
											<HomeOutlined sx={{ fontSize: 10 }} /> Trang chủ
										</span>
									)}
								</div>
								<p className="text-xs text-gray-500 mt-0.5 truncate">{coupon.description}</p>
							</div>
						</div>

						{/* Discount */}
						<div>
							<span className="text-sm font-semibold text-red-600">{formatDiscount(coupon)}</span>
							<p className="text-xs text-gray-400 mt-0.5">
								{coupon.discountType === "percent" ? "Phần trăm" : "Số tiền cố định"}
							</p>
						</div>

						{/* Min order */}
						<div className="text-sm text-gray-700">
							{coupon.minOrderValue > 0
								? `${Number(coupon.minOrderValue).toLocaleString("vi-VN")}₫`
								: "Không giới hạn"}
						</div>

						{/* Usage */}
						<div>
							<span className="text-sm text-gray-700">
								{coupon.usedCount}
								{coupon.usageLimit ? `/${coupon.usageLimit}` : ""}
							</span>
							{coupon.usageLimit && (
								<div className="w-full bg-gray-100 rounded-full h-1 mt-1">
									<div
										className="bg-orange-400 h-1 rounded-full transition-all"
										style={{ width: `${Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100)}%` }}
									/>
								</div>
							)}
						</div>

						{/* Expiry */}
						<div className="text-sm text-gray-600">{formatDate(coupon.expiresAt)}</div>

						{/* Actions */}
						<div className="flex items-center gap-1">
							{/* Toggle homepage */}
							<button
								onClick={() => {
									if (!coupon.isActive) return; // không cho bật homepage khi coupon tắt
									onToggleHomepage(coupon.id, !coupon.showOnHomepage);
								}}
								title={
									!coupon.isActive
										? "Cần kích hoạt coupon trước"
										: coupon.showOnHomepage
											? "Ẩn khỏi trang chủ"
											: "Hiện trên trang chủ"
								}
								className={`p-2 rounded-lg transition-colors ${!coupon.isActive
										? "text-gray-200 cursor-not-allowed"
										: coupon.showOnHomepage
											? "text-blue-600 bg-blue-50 hover:bg-blue-100"
											: "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
									}`}
							>
								<HomeOutlined fontSize="small" />
							</button>
							<button
								onClick={() => onEdit(coupon)}
								className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
								title="Chỉnh sửa"
							>
								<EditOutlined fontSize="small" />
							</button>
							<button
								onClick={() => onDelete(coupon.id)}
								className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
								title="Xóa"
							>
								<DeleteOutline fontSize="small" />
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
