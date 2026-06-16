"use client";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import Button from "~/components/atoms/Button";
import ConfirmationModal from "~/components/atoms/Confirmation";
import { useNotification } from "~/contexts/Notification";

interface BulkDeleteButtonProps {
	selectedIds: Set<string | number>;
	onDelete: (ids: number[]) => Promise<void>;
	label?: string;
	className?: string;
	hideIcon?: boolean;
}

export default function BulkDeleteButton({
	selectedIds,
	onDelete,
	label = "Xóa",
	className,
	hideIcon = false,
}: BulkDeleteButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { showNotification } = useNotification();
	const count = selectedIds.size;

	if (count === 0) return null;

	const handleConfirm = async () => {
		await onDelete(Array.from(selectedIds).map(Number));
		showNotification(`Đã xoá ${count} mục thành công`, "success");
		setIsOpen(false);
	};

	const handleError = (error: any) => {
		const message = error?.response?.data?.message || "Xóa thất bại. Vui lòng thử lại.";
		showNotification(message, "error");
	};

	return (
		<>
			<Button
				onClick={() => setIsOpen(true)}
				className={`!w-auto !h-auto !px-4 !py-2 !text-sm !bg-red-600 hover:!bg-red-700 ${className ?? ""}`}
				theme="dark"
				variant="solid"
				type="button"
			>
				{!hideIcon && <DeleteIcon sx={{ fontSize: 16 }} />}
				<span>
					{label} ({count})
				</span>
			</Button>

			<ConfirmationModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onConfirm={handleConfirm}
				onError={handleError}
				title={`Xóa ${count} mục`}
				message={`Bạn có chắc chắn muốn xóa ${count} mục đã chọn? Hành động này không thể hoàn tác.`}
				confirmLabel="Xóa"
				confirmButtonColor="!bg-red-600 hover:!bg-red-700"
			/>
		</>
	);
}
