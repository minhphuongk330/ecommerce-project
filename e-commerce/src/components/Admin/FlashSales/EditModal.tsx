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

interface Props {
	sale: any;
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

// Format datetime-local input value
const toLocalDatetime = (iso: string) => {
	const d = new Date(iso);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function FlashSaleEditModal({ sale, open, onClose, onSuccess }: Props) {
	const { showNotification } = useNotification();
	const [title, setTitle] = useState(sale.title);
	const [endsAt, setEndsAt] = useState(toLocalDatetime(sale.endsAt));
	const [isActive, setIsActive] = useState(sale.isActive);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		setTitle(sale.title);
		setEndsAt(toLocalDatetime(sale.endsAt));
		setIsActive(sale.isActive);
	}, [sale]);

	const handleSubmit = async () => {
		if (!title.trim()) return showNotification("Vui lòng nhập tiêu đề", "error");
		if (!endsAt) return showNotification("Vui lòng chọn thời gian kết thúc", "error");
		try {
			setSubmitting(true);
			await adminService.updateFlashSale(sale.id, {
				title,
				endsAt: new Date(endsAt).toISOString(),
				isActive,
			});
			showNotification("Cập nhật thành công!", "success");
			onSuccess();
		} catch {
			showNotification("Cập nhật thất bại", "error");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ fontWeight: "bold", pr: 6 }}>
				Chỉnh sửa Flash Sale
				<IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<div className="space-y-4 pt-1">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc</label>
						<input
							type="datetime-local"
							value={endsAt}
							onChange={(e) => setEndsAt(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
						/>
					</div>
					<div className="flex items-center gap-3">
						<label className="relative inline-flex items-center cursor-pointer">
							<input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="sr-only peer" />
							<div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-red-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
						</label>
						<span className="text-sm font-medium text-gray-700">Kích hoạt</span>
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
					{submitting ? "Đang lưu..." : "Lưu thay đổi"}
				</button>
			</DialogActions>
		</Dialog>
	);
}
