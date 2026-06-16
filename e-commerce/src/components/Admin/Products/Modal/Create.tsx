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
			showNotification("Tạo sản phẩm thành công", "success");
			setIsOpen(false);
			onSuccess();
		} catch (error) {
			console.error(error);
			showNotification("Lỗi khi tạo sản phẩm", "error");
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white border border-black rounded-md text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-[#333] active:scale-95"
			>
				<Add sx={{ fontSize: 18 }} />
				<span>Thêm sản phẩm</span>
			</button>

			<ProductFormModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Tạo sản phẩm mới"
				categories={categories}
				onSubmit={handleCreate}
				submitLabel="Tạo mới"
			/>
		</>
	);
}
