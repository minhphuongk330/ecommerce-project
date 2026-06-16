"use client";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import BaseDialog from "~/components/atoms/Dialog";
import Button from "~/components/atoms/Button";

interface SuccessModalProps {
	isOpen: boolean;
	onConfirm: () => void;
	onContinueShopping: () => void;
}

export default function SuccessModal({ isOpen, onConfirm, onContinueShopping }: SuccessModalProps) {
	return (
		<BaseDialog isOpen={isOpen} onClose={() => {}} width={450}>
			<div className="flex flex-col items-center text-center">
				<CheckCircleOutline sx={{ fontSize: 80 }} className="text-green-500 mb-6" />
				<h3 className="text-[28px] font-bold text-black mb-3 leading-tight">Thanh toán thành công!</h3>
				<p className="mb-8 text-[16px] text-gray-600">
					Cảm ơn bạn đã đặt hàng. Giao dịch của bạn đã được hoàn thành thành công.
				</p>

				<div className="w-full flex flex-col gap-3">
					<Button
						type="button"
						onClick={onConfirm}
						variant="solid"
						className="!w-full !h-[52px] !rounded-[8px] !bg-green-600 hover:!bg-green-700 !text-white !text-lg !font-medium"
					>
						Xem đơn hàng của tôi
					</Button>
					<Button
						type="button"
						onClick={onContinueShopping}
						variant="outline"
						className="!w-full !h-[52px] !rounded-[8px] !text-lg !font-medium"
					>
						Tiếp tục mua sắm
					</Button>
				</div>
			</div>
		</BaseDialog>
	);
}
