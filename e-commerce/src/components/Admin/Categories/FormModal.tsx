"use client";
import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminService } from "~/services/admin";
import { useNotification } from "~/contexts/Notification";
import { categorySchema, CategoryFormValues } from "~/utils/validator/category";
import CommonInput from "~/components/atoms/Input";
import { AdminCategory } from "~/types/admin";
import { categoryCache } from "~/utils/lruCache";

interface CategoryFormModalProps {
	open: boolean;
	category?: AdminCategory | null;
	onClose: () => void;
	onSuccess: () => void;
}

const initialValues: CategoryFormValues = {
	name: "",
};

export default function CategoryFormModal({ open, category, onClose, onSuccess }: CategoryFormModalProps) {
	const { showNotification } = useNotification();
	const isEdit = !!category;

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: initialValues as DefaultValues<CategoryFormValues>,
	});

	// Load data when editing
	useEffect(() => {
		if (open) {
			if (category) {
				reset({
					name: category.name ?? "",
				});
			} else {
				reset(initialValues);
			}
		}
	}, [category, open, reset]);

	const handleFormSubmit = async (data: CategoryFormValues) => {
		try {
			const payload = {
				name: data.name.trim(),
			};

			if (isEdit && category) {
				await adminService.updateCategory(category.id, payload);
				showNotification("Cập nhật danh mục thành công!", "success");
			} else {
				await adminService.createCategory(payload);
				showNotification("Thêm danh mục thành công!", "success");
			}
			categoryCache.clear();
			onSuccess();
		} catch (err: any) {
			const msg = err?.response?.data?.message || (isEdit ? "Cập nhật thất bại" : "Thêm thất bại");
			showNotification(msg, "error");
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ fontWeight: "bold", pr: 6 }}>
				{isEdit ? "✏️ Chỉnh sửa danh mục" : "📂 Thêm danh mục mới"}
				<IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pt-1">
					{/* Tên danh mục */}
					<CommonInput
						name="name"
						control={control}
						label="Tên danh mục sản phẩm"
						placeholder="VD: Điện thoại, Laptop, Phụ kiện..."
						required
					/>
				</form>
			</DialogContent>

			<DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
				<button
					onClick={onClose}
					className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
				>
					Hủy
				</button>
				<button
					onClick={handleSubmit(handleFormSubmit)}
					disabled={isSubmitting}
					className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg transition-colors"
				>
					{isSubmitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm danh mục"}
				</button>
			</DialogActions>
		</Dialog>
	);
}
