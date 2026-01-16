"use client";
import { useState } from "react";
import { Add } from "@mui/icons-material";
import { adminService } from "~/services/admin";
import { useNotification } from "~/contexts/Notification";
import { AdminCategory } from "~/types/admin";
import { ProductFormOutput } from "~/utils/validator/adminproduct";
import ProductFormModal from "./Form";
import Button from "~/components/atoms/Button";

interface Props {
	categories: AdminCategory[];
	onSuccess: () => void;
}

export default function CreateProduct({ categories, onSuccess }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const { showNotification } = useNotification();

	const handleCreate = async (data: ProductFormOutput) => {
		try {
			await adminService.createProduct(data);
			showNotification("Product created successfully", "success");
			setIsOpen(false);
			onSuccess();
		} catch (error) {
			console.error(error);
			showNotification("Failed to create product", "error");
		}
	};

	return (
		<>
			<Button variant="solid" theme="dark" className="flex items-center gap-2" onClick={() => setIsOpen(true)}>
				<Add fontSize="small" />
				Add Product
			</Button>

			<ProductFormModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Create New Product"
				categories={categories}
				onSubmit={handleCreate}
				submitLabel="Create"
			/>
		</>
	);
}
