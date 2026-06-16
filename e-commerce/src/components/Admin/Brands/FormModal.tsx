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
import { brandSchema, BrandFormValues } from "~/utils/validator/brand";
import CommonInput from "~/components/atoms/Input";
import ImageUploadInput from "~/components/atoms/ImageUploadInput";
import { AdminBrand } from "~/types/admin";

interface BrandFormModalProps {
	open: boolean;
	brand?: AdminBrand | null;
	onClose: () => void;
	onSuccess: () => void;
}

const initialValues: BrandFormValues = {
	name: "",
	logoUrl: "",
};

export default function BrandFormModal({ open, brand, onClose, onSuccess }: BrandFormModalProps) {
	const { showNotification } = useNotification();
	const isEdit = !!brand;

	const {
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { isSubmitting },
	} = useForm<BrandFormValues>({
		resolver: zodResolver(brandSchema),
		defaultValues: initialValues as DefaultValues<BrandFormValues>,
	});

 
	useEffect(() => {
		if (open) {
			if (brand) {
				reset({
					name: brand.name ?? "",
					logoUrl: brand.logoUrl ?? "",
				});
			} else {
				reset(initialValues);
			}
		}
	}, [brand, open, reset]);

	const handleFormSubmit = async (data: BrandFormValues) => {
		try {
			const payload = {
				name: data.name.trim(),
				logoUrl: data.logoUrl ? data.logoUrl.trim() : undefined,
			};

			if (isEdit && brand) {
				await adminService.updateBrand(brand.id, payload);
				showNotification("Cập nhật thương hiệu thành công!", "success");
			} else {
				await adminService.createBrand(payload);
				showNotification("Thêm thương hiệu thành công!", "success");
			}
			onSuccess();
		} catch (err: any) {
			const msg = err?.response?.data?.message || (isEdit ? "Cập nhật thất bại" : "Thêm thất bại");
			showNotification(msg, "error");
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ fontWeight: "bold", pr: 6 }}>
				{isEdit ? "✏️ Chỉnh sửa thương hiệu" : "🏢 Thêm thương hiệu mới"}
				<IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pt-1">
					{/* Tên thương hiệu */}
					<CommonInput
						name="name"
						control={control}
						label="Tên thương hiệu"
						placeholder="VD: Apple, Samsung, Asus..."
						required
					/>

					{/* Logo thương hiệu */}
					<div className="space-y-2">
						<ImageUploadInput
							name="logoUrl"
							control={control}
							setValue={setValue}
							label="Logo thương hiệu"
							onRemove={() => setValue("logoUrl", "", { shouldValidate: true })}
						/>
					</div>
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
					{isSubmitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm thương hiệu"}
				</button>
			</DialogActions>
		</Dialog>
	);
}
