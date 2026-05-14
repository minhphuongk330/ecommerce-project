"use client";
import React, { useState } from "react";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import EditOutlined from "@mui/icons-material/EditOutlined";
import FlashSaleEditModal from "./EditModal";

interface FlashSaleListProps {
	flashSales: any[];
	onToggleActive: (id: number, isActive: boolean) => void;
	onDelete: (id: number) => void;
	onRefresh: () => void;
}

const statusBadge = (sale: any) => {
	const now = new Date();
	const endsAt = new Date(sale.endsAt);
	if (!sale.isActive) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Tắt</span>;
	if (endsAt < now) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">Hết hạn</span>;
	return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">Đang chạy</span>;
};

const formatDate = (d: string) => {
	const date = new Date(d);
	return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

export default function FlashSaleList({ flashSales, onToggleActive, onDelete, onRefresh }: FlashSaleListProps) {
	const [expandedId, setExpandedId] = useState<number | null>(null);
	const [editSale, setEditSale] = useState<any | null>(null);

	if (flashSales.length === 0) {
		return (
			<div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
				<p className="text-4xl mb-3">⚡</p>
				<p className="text-gray-500 font-medium">Chưa có Flash Sale nào</p>
				<p className="text-gray-400 text-sm mt-1">Nhấn "Tạo Flash Sale" để bắt đầu</p>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-3">
				{flashSales.map((sale) => (
					<div key={sale.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
						{/* Row header */}
						<div className="flex items-center gap-4 px-5 py-4">
							{/* Toggle active */}
							<label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
								<input
									type="checkbox"
									checked={sale.isActive}
									onChange={(e) => onToggleActive(sale.id, e.target.checked)}
									className="sr-only peer"
								/>
								<div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-red-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
							</label>

							{/* Info */}
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 flex-wrap">
									<span className="font-semibold text-gray-800">{sale.title}</span>
									{statusBadge(sale)}
								</div>
								<p className="text-xs text-gray-400 mt-0.5">
									Kết thúc: {formatDate(sale.endsAt)} &nbsp;·&nbsp;
									{sale.items?.length ?? 0} sản phẩm
								</p>
							</div>

							{/* Actions */}
							<div className="flex items-center gap-2 flex-shrink-0">
								<button
									onClick={() => setEditSale(sale)}
									className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
									title="Chỉnh sửa"
								>
									<EditOutlined fontSize="small" />
								</button>
								<button
									onClick={() => onDelete(sale.id)}
									className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
									title="Xóa"
								>
									<DeleteOutline fontSize="small" />
								</button>
								<button
									onClick={() => setExpandedId(expandedId === sale.id ? null : sale.id)}
									className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
								>
									{expandedId === sale.id ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
								</button>
							</div>
						</div>

						{/* Expanded: product list */}
						{expandedId === sale.id && sale.items?.length > 0 && (
							<div className="border-t border-gray-50 px-5 py-3">
								<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Sản phẩm trong sale</p>
								<div className="space-y-2">
									{sale.items.map((item: any) => (
										<div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
											<img
												src={item.product?.mainImageUrl}
												alt={item.product?.name}
												className="w-10 h-10 object-contain rounded-lg bg-gray-50 flex-shrink-0"
											/>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-800 truncate">{item.product?.name}</p>
												<p className="text-xs text-gray-400">
													Giá gốc: <span className="line-through">{Number(item.originalPrice).toLocaleString("vi-VN")}₫</span>
													&nbsp;→&nbsp;
													<span className="text-red-600 font-semibold">{Number(item.salePrice).toLocaleString("vi-VN")}₫</span>
												</p>
											</div>
											<div className="text-right flex-shrink-0">
												<span className="text-xs bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">
													-{Math.round(((item.originalPrice - item.salePrice) / item.originalPrice) * 100)}%
												</span>
												<p className="text-xs text-gray-400 mt-0.5">SL: {item.quantity}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{/* Edit Modal */}
			{editSale && (
				<FlashSaleEditModal
					sale={editSale}
					open={!!editSale}
					onClose={() => setEditSale(null)}
					onSuccess={() => {
						setEditSale(null);
						onRefresh();
					}}
				/>
			)}
		</>
	);
}
