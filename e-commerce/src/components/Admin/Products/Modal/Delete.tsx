"use client";
import { useState } from "react";
import { IconButton } from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import ConfirmationModal from "~/components/atoms/Confirmation";
import { adminService } from "~/services/admin";
import { useNotification } from "~/contexts/Notification";

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
				title="Delete product"
				message="Are you sure you want to delete this product? This action cannot be undone."
				confirmLabel="Delete!"
				confirmButtonColor="!bg-red-600 hover:!bg-red-700"
			/>
		</>
	);
}
