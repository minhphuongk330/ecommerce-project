"use client";
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { adminService } from "~/services/admin";
import { useNotification } from "~/contexts/Notification";

interface FormState {
	code: string;
	description: string;
	couponType: "product" | "shipping";
	discountType: "percent" | "fixed";
	discountValue: string;
	minOrderValue: string;
	maxDiscountAmount: string;
	usageLimit: string;
	usageLimitPerUser: string;
	expiresAt: string;
	isActive: boolean;
	showOnHomepage: boolean;
}

const EMPTY: FormState = {
	code: "",
	description: "",
	couponType: "product",
	discountType: "percent",
	discountValue: "",
	minOrderValue: "",
	maxDiscountAmount: "",
	usageLimit: "",
	usageLimitPerUser: "1",
	expiresAt: "",
	isActive: true,
	showOnHomepage: true,
};

const toLocalDatetime = (iso?: string) => {
	if (!iso) return "";
	const d = new Date(iso);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

interface Props {
	open: boolean;
	coupon?: any | null; // null = tạo mới, có giá trị = chỉnh sửa
	onClose: () => void;
	onSuccess: () => void;
}

export default function CouponFormModal({ open, coupon, onClose, onSuccess }: Props) {
	const { showNotification } = useNotification();
	const [form, setForm] = useState<FormState>(EMPTY);
	const [submitting, setSubmitting] = useState(false);
	const isEdit = !!coupon;

	// Điền data khi edit
	useEffect(() => {
		if (coupon) {
			setForm({
				code: coupon.code ?? "",
				description: coupon.description ?? "",
				couponType: coupon.couponType ?? "product",
				discountType: coupon.discountType ?? "percent",
				discountValue: String(coupon.discountValue ?? ""),
				minOrderValue: coupon.minOrderValue ? String(coupon.minOrderValue) : "",
				maxDiscountAmount: coupon.maxDiscountAmount ? String(coupon.maxDiscountAmount) : "",
				usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
				usageLimitPerUser: coupon.usageLimitPerUser ? String(coupon.usageLimitPerUser) : "1",
				expiresAt: toLocalDatetime(coupon.expiresAt),
				isActive: coupon.isActive ?? true,
				showOnHomepage: coupon.showOnHomepage ?? false,
			});
		} else {
			setForm(EMPTY);
		}
	}, [coupon, open]);

	const set = (field: keyof FormState, value: any) =>
		setForm((prev) => ({ ...prev, [field]: value }));

	const validate = () => {
		if (!form.code.trim()) { showNotification("Vui lòng nhập mã coupon", "error"); return false; }
		if (!form.description.trim()) { showNotification("Vui lòng nhập mô tả", "error"); return false; }
		if (!form.discountValue || Number(form.discountValue) <= 0) {
			showNotification("Giá trị giảm phải lớn hơn 0", "error"); return false;
		}
		if (form.discountType === "percent" && Number(form.discountValue) > 100) {
			showNotification("Phần trăm giảm không được vượt quá 100%", "error"); return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validate()) return;
		try {
			setSubmitting(true);
			const payload = {
				code: form.code.toUpperCase().trim(),
				description: form.description.trim(),
				couponType: form.couponType,
				discountType: form.discountType,
				discountValue: Number(form.discountValue),
				minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
				maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
				usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
				usageLimitPerUser: form.usageLimitPerUser ? Number(form.usageLimitPerUser) : 1,
				expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
				isActive: form.isActive,
				showOnHomepage: form.showOnHomepage,
			};

			if (isEdit) {
				await adminService.updateCoupon(coupon.id, payload);
				showNotification("Cập nhật coupon thành công!", "success");
			} else {
				await adminService.createCoupon(payload);
				showNotification("Tạo coupon thành công!", "success");
			}
			onSuccess();
		} catch (err: any) {
			const msg = err?.response?.data?.message || (isEdit ? "Cập nhật thất bại" : "Tạo thất bại");
			showNotification(msg, "error");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ fontWeight: "bold", pr: 6 }}>
				{isEdit ? "✏️ Chỉnh sửa coupon" : "🎁 Tạo coupon mới"}
				<IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<div className="space-y-4 pt-1">
					{/* Code */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Mã coupon <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={form.code}
							onChange={(e) => set("code", e.target.value.toUpperCase())}
							placeholder="VD: CYBER50"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-orange-400"
						/>
						<p className="text-xs text-gray-400 mt-0.5">Tự động chuyển thành chữ hoa</p>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Mô tả <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={form.description}
							onChange={(e) => set("description", e.target.value)}
							placeholder="VD: Giảm 50.000đ cho đơn từ 500.000đ"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
						/>
					</div>

					{/* Coupon Type + Discount type */}
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Loại Coupon</label>
							<select
								value={form.couponType}
								onChange={(e) => set("couponType", e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
							>
								<option value="product">Giảm giá sản phẩm</option>
								<option value="shipping">Giảm phí ship</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
							<select
								value={form.discountType}
								onChange={(e) => set("discountType", e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
							>
								<option value="percent">Phần trăm (%)</option>
								<option value="fixed">Số tiền cố định (₫)</option>
							</select>
						</div>
					</div>

					{/* Giá trị giảm */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Giá trị giảm <span className="text-red-500">*</span>
						</label>
						<div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-400">
							<input
								type="number"
								min={0}
								max={form.discountType === "percent" ? 100 : undefined}
								value={form.discountValue}
								onChange={(e) => set("discountValue", e.target.value)}
								placeholder={form.discountType === "percent" ? "10" : "50000"}
								className="flex-1 px-3 py-2 text-sm focus:outline-none"
							/>
							<span className="px-3 text-sm text-gray-500 bg-gray-50 border-l border-gray-300 py-2">
								{form.discountType === "percent" ? "%" : "₫"}
							</span>
						</div>
					</div>

					{/* Max discount (chỉ hiện khi percent) */}
					{form.discountType === "percent" && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Giảm tối đa (₫) <span className="text-gray-400 font-normal">— để trống = không giới hạn</span>
							</label>
							<input
								type="number"
								min={0}
								value={form.maxDiscountAmount}
								onChange={(e) => set("maxDiscountAmount", e.target.value)}
								placeholder="VD: 100000"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
							/>
						</div>
					)}

					{/* Min order */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Đơn hàng tối thiểu (₫) <span className="text-gray-400 font-normal">— để trống = không giới hạn</span>
						</label>
						<input
							type="number"
							min={0}
							value={form.minOrderValue}
							onChange={(e) => set("minOrderValue", e.target.value)}
							placeholder="VD: 500000"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
						/>
					</div>

					{/* Usage limit + Limit per user */}
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Giới hạn lượt dùng <span className="text-gray-400 font-normal">— để trống = không giới hạn</span>
							</label>
							<input
								type="number"
								min={1}
								value={form.usageLimit}
								onChange={(e) => set("usageLimit", e.target.value)}
								placeholder="VD: 100"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Lượt dùng / Mỗi khách <span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								min={1}
								value={form.usageLimitPerUser}
								onChange={(e) => set("usageLimitPerUser", e.target.value)}
								placeholder="VD: 1"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
							/>
						</div>
					</div>

					{/* Expiry */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Ngày hết hạn <span className="text-gray-400 font-normal">— để trống = không hết hạn</span>
						</label>
						<input
							type="datetime-local"
							value={form.expiresAt}
							onChange={(e) => set("expiresAt", e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
						/>
					</div>

					{/* Toggles */}
					<div className="flex flex-col gap-3 pt-1">
						<label className="flex items-center gap-3 cursor-pointer">
							<div className="relative inline-flex items-center">
								<input
									type="checkbox"
									checked={form.isActive}
									onChange={(e) => set("isActive", e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
							</div>
							<span className="text-sm font-medium text-gray-700">Kích hoạt coupon</span>
						</label>

						<label className="flex items-center gap-3 cursor-pointer">
							<div className="relative inline-flex items-center">
								<input
									type="checkbox"
									checked={form.showOnHomepage}
									onChange={(e) => set("showOnHomepage", e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
							</div>
							<div>
								<span className="text-sm font-medium text-gray-700">
									Hiển thị trên trang chủ
									<span className="text-xs text-gray-400 font-normal ml-1">(mục Mã giảm giá)</span>
								</span>
								{form.showOnHomepage && !form.isActive && (
									<p className="text-xs text-orange-500 mt-0.5">
										⚠️ Coupon đang tắt — sẽ không hiện trên trang chủ cho đến khi kích hoạt
									</p>
								)}
							</div>
						</label>
					</div>
				</div>
			</DialogContent>

			<DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
				<button
					onClick={onClose}
					className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
				>
					Hủy
				</button>
				<button
					onClick={handleSubmit}
					disabled={submitting}
					className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg transition-colors"
				>
					{submitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo coupon"}
				</button>
			</DialogActions>
		</Dialog>
	);
}
