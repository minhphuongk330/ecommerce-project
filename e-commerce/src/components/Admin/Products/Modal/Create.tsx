"use client";
import { useState } from "react";
import Add from "@mui/icons-material/Add";
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
			<Button
				variant="solid"
				theme="dark"
				className="!w-10 !h-10 !p-0 md:!w-auto md:!h-auto md:!px-4 flex items-center justify-center md:gap-2 min-w-0 flex-shrink-0"
				onClick={() => setIsOpen(true)}
			>
				<Add fontSize="small" />

				<span className="hidden md:inline">Add Product</span>
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
