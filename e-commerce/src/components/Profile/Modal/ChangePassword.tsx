"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LockReset from "@mui/icons-material/LockReset";
import BaseDialog from "~/components/atoms/Dialog";
import CommonInput from "~/components/atoms/Input";
import StepButton from "~/components/checkout/Button";
import Button from "~/components/atoms/Button";
import { useNotification } from "~/contexts/Notification";
import { authService } from "~/services/auth";
import { changePasswordSchema, ChangePasswordForm } from "~/utils/validator/auth";

export default function ChangePasswordModal() {
	const [isOpen, setIsOpen] = useState(false);
	const { showNotification } = useNotification();

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = useForm<ChangePasswordForm>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	useEffect(() => {
		if (!isOpen) reset();
	}, [isOpen, reset]);

	const onSubmit = async (data: ChangePasswordForm) => {
		try {
			await authService.changePassword(data);
			showNotification("Đổi mật khẩu thành công!", "success");
			setIsOpen(false);
		} catch (error: any) {
			const msg = error?.response?.data?.message || "Không thể đổi mật khẩu!";
			showNotification(msg, "error");
		}
	};

	return (
		<>
			<Button
				variant="outline"
				theme="dark"
				onClick={() => setIsOpen(true)}
				className="!w-auto flex items-center gap-2 !px-4 !py-2 !border-gray-300 hover:!bg-gray-50 !text-black"
			>
				<LockReset sx={{ fontSize: 20 }} />
				<span>Đổi mật khẩu</span>
			</Button>

			<BaseDialog
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Đổi mật khẩu"
				showCloseIcon={true}
				width={500}
			>
				<div className="flex flex-col gap-4 py-2">
					<CommonInput
						name="currentPassword"
						control={control}
						label="Mật khẩu hiện tại"
						placeholder="Nhập mật khẩu hiện tại"
						type="password"
						required
					/>

					<CommonInput
						name="newPassword"
						control={control}
						label="Mật khẩu mới"
						placeholder="Nhập mật khẩu mới"
						type="password"
						required
					/>

					<CommonInput
						name="confirmPassword"
						control={control}
						label="Xác nhận mật khẩu mới"
						placeholder="Nhập lại mật khẩu mới"
						type="password"
						required
					/>

					<div className="mt-4 pt-2 border-t border-gray-100">
						<StepButton
							layout="full"
							type="submit"
							primaryLabel="Đổi mật khẩu"
							isLoading={isSubmitting}
							secondaryLabel="Hủy"
							onSecondaryClick={() => setIsOpen(false)}
							onPrimaryClick={handleSubmit(onSubmit)}
							className="w-full"
							buttonClassName="!h-[48px]"
						/>
					</div>
				</div>
			</BaseDialog>
		</>
	);
}
