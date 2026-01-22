"use client";
import { useState } from "react";
import Close from "@mui/icons-material/Close";
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
		try {
			await addressService.deleteAddress(id);
			showNotification("Address deleted.", "success");
			setIsOpen(false);
			onSuccess();
		} catch (error) {
			console.error(error);
			showNotification("Delete failed.", "error");
		}
	};

	return (
		<>
			<button
				onClick={e => {
					e.stopPropagation();
					setIsOpen(true);
				}}
				className="text-black hover:opacity-60 transition-opacity"
				title="Delete Address"
			>
				<Close sx={{ fontSize: 24 }} />
			</button>

			<ConfirmationModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Delete Address"
				message="Are you sure you want to delete this address?"
				onConfirm={handleDelete}
			/>
		</>
	);
}
