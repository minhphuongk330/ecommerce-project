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
			showNotification("Xoá sản phẩm thành công", "success");
			onSuccess();
		} catch (error) {
			showNotification("Xoá thất bại. Vui lòng thử lại.", "error");
		}
	};

	const handleError = (error: any) => {
		const message = error?.response?.data?.message || "Xoá thất bại. Vui lòng thử lại.";
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
				title="Xóa sản phẩm"
				message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
				confirmLabel="Xóa"
				confirmButtonColor="!bg-red-600 hover:!bg-red-700"
			/>
		</>
	);
}
