"use client";
import DeleteOutlined from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import ConfirmationModal from "~/components/atoms/Confirmation";
import { useNotification } from "~/contexts/Notification";
import { adminService } from "~/services/admin";

interface Props {
	id: number;
	onSuccess: () => void;
}

export default function DeleteProduct({ id, onSuccess }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const { showNotification } = useNotification();

	const handleDelete = async () => {
		try {
			await adminService.deleteProduct(id);
			showNotification("Product deleted successfully", "success");
			onSuccess();
		} catch (error) {
			showNotification("Deletion failed. Please try again.", "error");
		}
	};

	const handleError = (error: any) => {
		const message = error?.response?.data?.message || "Deletion failed. Please try again.";
		showNotification(message, "error");
	};

	return (
		<>
			<IconButton
				size="small"
				onClick={e => {
					e.stopPropagation();
					setIsOpen(true);
				}}
				className="text-red-600 hover:bg-red-50"
			>
				<DeleteOutlined fontSize="small" />
			</IconButton>

			<ConfirmationModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onConfirm={handleDelete}
				onError={handleError}
				title="Delete product"
				message="Are you sure you want to delete this product? This action cannot be undone."
				confirmLabel="Delete!"
				confirmButtonColor="!bg-red-600 hover:!bg-red-700"
			/>
		</>
	);
}
