"use client";
import { useState, useMemo } from "react";
import { IconButton } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
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
			showNotification("Update successful", "success");
			setIsOpen(false);
			onSuccess();
		} catch (error) {
			console.error(error);
			showNotification("Update failed", "error");
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
				title="Update product"
				categories={categories}
				onSubmit={handleUpdate}
				submitLabel="Update"
				defaultValues={{ ...product, id: product.id }}
			/>
		</>
	);
}
