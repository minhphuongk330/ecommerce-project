"use client";
import React from "react";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import BaseDialog from "~/components/atoms/Dialog";
import Button from "~/components/atoms/Button";

interface SuccessModalProps {
	isOpen: boolean;
	onConfirm: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onConfirm }) => {
	return (
		<BaseDialog isOpen={isOpen} onClose={() => {}} width={450}>
			<div className="flex flex-col items-center text-center">
				<CheckCircleOutline sx={{ fontSize: 80 }} className="text-green-500 mb-6" />

				<h3 className="text-[28px] font-bold text-black mb-3 leading-tight">Payment Successful!</h3>

				<p className="mb-8 text-[16px] text-gray-600">
					Thank you for your order. Your transaction has been completed successfully.
				</p>

				<div className="w-full">
					<Button
						type="button"
						onClick={onConfirm}
						variant="solid"
						className="!w-full !h-[52px] !rounded-[8px] !bg-green-600 hover:!bg-green-700 !text-white !text-lg !font-medium"
					>
						View my Orders
					</Button>
				</div>
			</div>
		</BaseDialog>
	);
};

export default SuccessModal;
