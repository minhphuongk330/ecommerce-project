"use client";
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { adminService } from "~/services/admin";
import { useNotification } from "~/contexts/Notification";

interface FlashSaleItem {
	productId: number;
	productName: string;
	productImage: string;
	originalPrice: number;
	salePrice: number;
	discountPct: number;
	quantity: number;
	maxQuantity: number; // stock thực tế của sản phẩm
}

interface Props {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export default function FlashSaleCreateModal({ open, onClose, onSuccess }: Props) {
	const { showNotification } = useNotification();
	const [title, setTitle] = useState("");
	const [endsAt, setEndsAt] = useState("");
	const [isActive, setIsActive] = useState(true);
	const [items, setItems] = useState<FlashSaleItem[]>([]);
	const [products, setProducts] = useState<any[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [showProductPicker, setShowProductPicker] = useState(false);

	useEffect(() => {
		if (open) {
			adminService.getProducts().then(setProducts).catch(console.error);
		}
	}, [open]);

	const filteredProducts = products.filter(
		(p) =>
			p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
			!items.find((i) => i.productId === Number(p.id)),
	);

	const addProduct = (product: any) => {
		const originalPrice = Number(product.price);
		const stock = Number(product.stock) || 0;
		const discountPct = 10;
		const salePrice = Math.round(originalPrice * (1 - discountPct / 100));
		setItems((prev) => [
			...prev,
			{
				productId: Number(product.id),
				productName: product.name,
				productImage: product.mainImageUrl,
				originalPrice,
				salePrice,
				discountPct,
				quantity: Math.min(10, stock), // default 10 nhưng không vượt stock
				maxQuantity: stock,
			},
		]);
		setShowProductPicker(false);
		setSearchTerm("");
	};

	// Khi đổi % → tính lại salePrice
	const updateDiscountPct = (idx: number, pct: number) => {
		setItems((prev) =>
			prev.map((item, i) => {
				if (i !== idx) return item;
				const clampedPct = Math.min(99, Math.max(0, pct));
				const salePrice = Math.round(item.originalPrice * (1 - clampedPct / 100));
				return { ...item, discountPct: clampedPct, salePrice };
			}),
		);
	};

	// Khi đổi salePrice → tính lại %
	const updateSalePrice = (idx: number, salePrice: number) => {
		setItems((prev) =>
			prev.map((item, i) => {
				if (i !== idx) return item;
				const discountPct =
					item.originalPrice > 0
						? Math.round(((item.originalPrice - salePrice) / item.originalPrice) * 100)
						: 0;
				return { ...item, salePrice, discountPct };
			}),
		);
	};

	const updateItem = (idx: number, field: "originalPrice" | "quantity", value: number) => {
		setItems((prev) =>
			prev.map((item, i) => {
				if (i !== idx) return item;
				if (field === "originalPrice") {
					const salePrice = Math.round(value * (1 - item.discountPct / 100));
					return { ...item, originalPrice: value, salePrice };
				}
				if (field === "quantity") {
					// Không cho vượt quá stock
					const clamped = Math.min(Math.max(1, value), item.maxQuantity);
					return { ...item, quantity: clamped };
				}
				return { ...item, [field]: value };
			}),
		);
	};

	const removeItem = (idx: number) => {
		setItems((prev) => prev.filter((_, i) => i !== idx));
	};

	const handleSubmit = async () => {
		if (!title.trim()) return showNotification("Vui lòng nhập tiêu đề", "error");
		if (!endsAt) return showNotification("Vui lòng chọn thời gian kết thúc", "error");
		if (items.length === 0) return showNotification("Vui lòng thêm ít nhất 1 sản phẩm", "error");

		// Validate stock
		const outOfStock = items.find((i) => i.maxQuantity === 0);
		if (outOfStock) {
			return showNotification(`"${outOfStock.productName}" đã hết hàng`, "error");
		}
		const overStock = items.find((i) => i.quantity > i.maxQuantity);
		if (overStock) {
			return showNotification(
				`"${overStock.productName}" chỉ còn ${overStock.maxQuantity} sản phẩm`,
				"error",
			);
		}

		try {
			setSubmitting(true);
			await adminService.createFlashSale({
				title,
				endsAt: new Date(endsAt).toISOString(),
				isActive,
				items: items.map((i) => ({
					productId: i.productId,
					salePrice: i.salePrice,
					originalPrice: i.originalPrice,
					quantity: i.quantity,
				})),
			});
			showNotification("Tạo Flash Sale thành công!", "success");
			onSuccess();
			// Reset
			setTitle("");
			setEndsAt("");
			setItems([]);
			setIsActive(true);
		} catch {
			showNotification("Tạo Flash Sale thất bại", "error");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle sx={{ fontWeight: "bold", pr: 6 }}>
				⚡ Tạo Flash Sale mới
				<IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<div className="space-y-5">
					{/* Title */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="VD: Flash Sale Cuối Tuần"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
						/>
					</div>

					{/* Ends At */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc *</label>
						<input
							type="datetime-local"
							value={endsAt}
							onChange={(e) => setEndsAt(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
						/>
					</div>

					{/* Active toggle */}
					<div className="flex items-center gap-3">
						<label className="relative inline-flex items-center cursor-pointer">
							<input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="sr-only peer" />
							<div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-red-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
						</label>
						<span className="text-sm font-medium text-gray-700">Kích hoạt ngay</span>
					</div>

					{/* Products */}
					<div>
						<div className="flex items-center justify-between mb-2">
							<label className="text-sm font-medium text-gray-700">Sản phẩm ({items.length})</label>
							<button
								type="button"
								onClick={() => setShowProductPicker(!showProductPicker)}
								className="flex items-center gap-1 text-sm text-red-600 font-medium hover:underline"
							>
								<AddIcon fontSize="small" /> Thêm sản phẩm
							</button>
						</div>

						{/* Product picker */}
						{showProductPicker && (
							<div className="border border-gray-200 rounded-xl p-3 mb-3 bg-gray-50">
								<input
									type="text"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									placeholder="Tìm sản phẩm..."
									className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-red-400"
									autoFocus
								/>
								<div className="max-h-[200px] overflow-y-auto space-y-1">
									{filteredProducts.slice(0, 20).map((p) => (
										<button
											key={p.id}
											type="button"
											onClick={() => addProduct(p)}
											className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white rounded-lg text-left transition-colors"
										>
											<img src={p.mainImageUrl} alt={p.name} className="w-8 h-8 object-contain rounded bg-white flex-shrink-0" />
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
												<p className="text-xs text-gray-400">{Number(p.price).toLocaleString("vi-VN")}₫</p>
											</div>
										</button>
									))}
									{filteredProducts.length === 0 && (
										<p className="text-sm text-gray-400 text-center py-3">Không tìm thấy sản phẩm</p>
									)}
								</div>
							</div>
						)}

						{/* Items list */}
						{items.length > 0 && (
							<div className="space-y-2">
								{items.map((item, idx) => (
									<div key={idx} className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl bg-white">
										<img src={item.productImage} alt={item.productName} className="w-10 h-10 object-contain rounded-lg bg-gray-50 flex-shrink-0 mt-1" />
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-800 truncate mb-2">{item.productName}</p>
											<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
												{/* % giảm */}
												<div>
													<label className="text-[10px] text-gray-500 font-medium block mb-0.5">Giảm (%)</label>
													<div className="flex items-center border border-gray-200 rounded overflow-hidden focus-within:ring-1 focus-within:ring-red-400">
														<input
															type="number"
															min={0}
															max={99}
															value={item.discountPct}
															onChange={(e) => updateDiscountPct(idx, Number(e.target.value))}
															className="w-full px-2 py-1 text-xs focus:outline-none"
														/>
														<span className="px-1.5 text-xs text-gray-400 bg-gray-50 border-l border-gray-200">%</span>
													</div>
												</div>
												{/* Giá sale */}
												<div>
													<label className="text-[10px] text-gray-500 font-medium block mb-0.5">Giá sale</label>
													<input
														type="number"
														value={item.salePrice}
														onChange={(e) => updateSalePrice(idx, Number(e.target.value))}
														className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-400"
													/>
												</div>
												{/* Giá gốc */}
												<div>
													<label className="text-[10px] text-gray-500 font-medium block mb-0.5">Giá gốc</label>
													<input
														type="number"
														value={item.originalPrice}
														onChange={(e) => updateItem(idx, "originalPrice", Number(e.target.value))}
														className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-400"
													/>
												</div>
												{/* Số lượng */}
												<div>
													<label className="text-[10px] text-gray-500 font-medium block mb-0.5">
														Số lượng <span className="text-gray-400">(tối đa: {item.maxQuantity})</span>
													</label>
													<input
														type="number"
														min={1}
														max={item.maxQuantity}
														value={item.quantity}
														onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
														className={`w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-400 ${
															item.quantity > item.maxQuantity
																? "border-red-400 bg-red-50"
																: "border-gray-200"
														}`}
													/>
													{item.maxQuantity === 0 && (
														<p className="text-[10px] text-red-500 mt-0.5">Hết hàng</p>
													)}
												</div>
											</div>
										</div>
										<button
											onClick={() => removeItem(idx)}
											className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 mt-1"
										>
											<DeleteOutline fontSize="small" />
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</DialogContent>

			<DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
				<button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
					Hủy
				</button>
				<button
					onClick={handleSubmit}
					disabled={submitting}
					className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg transition-colors"
				>
					{submitting ? "Đang tạo..." : "Tạo Flash Sale"}
				</button>
			</DialogActions>
		</Dialog>
	);
}
