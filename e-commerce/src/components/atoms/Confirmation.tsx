"use client";
import React, { useState } from "react";
import BaseDialog from "~/components/atoms/Dialog";
import Button from "~/components/atoms/Button";

interface ConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void> | void;
	title: string;
	message: string;
	confirmLabel?: string;
	confirmButtonColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmLabel = "Delete",
	confirmButtonColor = "!bg-red-600 hover:!bg-red-700",
}) => {
	const [loading, setLoading] = useState(false);

	const handleConfirmAction = async () => {
		setLoading(true);
		try {
			await onConfirm();
		} catch (e) {
			console.error("Confirmation error:", e);
		} finally {
			setLoading(false);
			onClose();
		}
	};

	return (
		<BaseDialog isOpen={isOpen} onClose={onClose} width={450}>
			<div className="flex flex-col items-center text-center">
				<h2 className="text-[28px] font-bold text-black pb-2 leading-tight">{title}</h2>

				<p className="text-[16px] text-gray-700 mb-8">{message}</p>

				<div className="flex justify-center gap-4 w-full">
					<Button
						type="button"
						onClick={onClose}
						theme="light"
						variant="solid"
						className="!w-[140px] !h-[48px] !rounded-[6px] !bg-gray-200 !text-black hover:!bg-gray-300 !border-none"
					>
						Cancel
					</Button>

					<Button
						type="button"
						onClick={handleConfirmAction}
						disabled={loading}
						theme="light"
						variant="solid"
						className={`!w-[140px] !h-[48px] !rounded-[6px] !text-white ${confirmButtonColor}`}
					>
						{loading ? "Processing..." : confirmLabel}
					</Button>
				</div>
			</div>
		</BaseDialog>
	);
};

export default ConfirmationModal;
