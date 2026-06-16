"use client";
import Close from "@mui/icons-material/Close";
import { useState } from "react";
import ConfirmationModal from "~/components/atoms/Confirmation";
import { useNotification } from "~/contexts/Notification";
import { addressService } from "~/services/address";

interface DeleteAddressProps {
	id: number;
	onSuccess: () => void;
}

export default function DeleteAddress({ id, onSuccess }: DeleteAddressProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { showNotification } = useNotification();

	const handleDelete = async () => {
		await addressService.deleteAddress(id);
		showNotification("Đã xóa địa chỉ.", "success");
		setIsOpen(false);
		onSuccess();
	};

	const handleError = (error: any) => {
		const message = error?.response?.data?.message || "Delete failed.";
		showNotification(message, "error");
	};

	return (
		<>
			<button
				onClick={e => {
					e.stopPropagation();
					setIsOpen(true);
				}}
				className="text-black hover:opacity-60 transition-opacity"
				title="Xóa địa chỉ"
			>
				<Close sx={{ fontSize: 24 }} />
			</button>

			<ConfirmationModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Xóa địa chỉ"
				message="Bạn có chắc chắn muốn xóa địa chỉ này?"
				onConfirm={handleDelete}
				onError={handleError}
			/>
		</>
	);
}
