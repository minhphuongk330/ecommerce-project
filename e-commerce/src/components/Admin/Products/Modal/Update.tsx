"use client";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { adminService } from "~/services/admin";
import { useNotification } from "~/contexts/Notification";
import { AdminCategory, AdminProduct } from "~/types/admin";
import { ProductFormOutput } from "~/utils/validator/adminproduct";
import ProductFormModal from "./Form";

interface Props {
	product: AdminProduct;
	categories: AdminCategory[];
	onSuccess: () => void;
}

export default function UpdateProduct({ product, categories, onSuccess }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const { showNotification } = useNotification();

	const handleUpdate = async (data: ProductFormOutput) => {
		try {
			await adminService.updateProduct(product.id, data);
			showNotification("Cập nhật thành công", "success");
			setIsOpen(false);
			onSuccess();
		} catch (error) {
			console.error(error);
			showNotification("Cập nhật thất bại", "error");
		}
	};

	return (
		<>
			<IconButton size="small" onClick={() => setIsOpen(true)} className="text-blue-600 hover:bg-blue-50">
				<EditOutlined fontSize="small" />
			</IconButton>
			<ProductFormModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Cập nhật sản phẩm"
				categories={categories}
				onSubmit={handleUpdate}
				submitLabel="Cập nhật"
				defaultValues={{ ...product, id: product.id }}
			/>
		</>
	);
}
