"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTitle, DialogContent, Button, TextField, Typography, Box, Alert } from "@mui/material";
import { authService } from "~/services/auth";
import { useNotification } from "~/contexts/Notification";
import {
	forgotPasswordSchema,
	resetPasswordSchema,
	ForgotPasswordForm,
	ResetPasswordForm,
} from "~/utils/validator/auth";

interface Props {
	open: boolean;
	onClose: () => void;
}

export default function ForgotPasswordModal({ open, onClose }: Props) {
	const [step, setStep] = useState<1 | 2>(1);
	const [email, setEmail] = useState("");
	const { showNotification } = useNotification();

	const {
		register: registerEmail,
		handleSubmit: handleSubmitEmail,
		formState: { errors: errorsEmail, isSubmitting: loading1 },
		reset: resetForm1,
	} = useForm<ForgotPasswordForm>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const {
		register: registerReset,
		handleSubmit: handleSubmitReset,
		formState: { errors: errorsReset, isSubmitting: loading2 },
		reset: resetForm2,
	} = useForm<ResetPasswordForm>({
		resolver: zodResolver(resetPasswordSchema),
	});

	const onSubmitEmail = async (data: ForgotPasswordForm) => {
		try {
			await authService.forgotPassword({ email: data.email });
			setEmail(data.email);
			setStep(2);
			showNotification("OTP sent to your email", "success");
		} catch (error: any) {
			showNotification(error?.response?.data?.message || "Failed to send OTP", "error");
		}
	};

	const onSubmitReset = async (data: ResetPasswordForm) => {
		try {
			await authService.resetPassword({
				email: email,
				otp: data.otp,
				newPassword: data.newPassword,
				confirmPassword: data.confirmPassword,
			});
			showNotification("Password reset successfully! Please login.", "success");
			handleClose();
		} catch (error: any) {
			showNotification(error?.response?.data?.message || "Reset failed", "error");
		}
	};

	const handleClose = () => {
		onClose();

		setTimeout(() => {
			setStep(1);
			setEmail("");
			resetForm1();
			resetForm2();
		}, 200);
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ fontWeight: "bold" }}>{step === 1 ? "Forgot Password" : "Reset Password"}</DialogTitle>

			<DialogContent>
				{step === 1 && (
					<Box component="form" onSubmit={handleSubmitEmail(onSubmitEmail)} sx={{ mt: 1 }}>
						<Typography variant="body2" sx={{ mb: 2 }}>
							Enter your email address and we'll send you an OTP code to reset your password.
						</Typography>
						<TextField
							fullWidth
							label="Email Address"
							type="email"
							{...registerEmail("email")}
							error={!!errorsEmail.email}
							helperText={errorsEmail.email?.message}
							disabled={loading1}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 1, py: 1.5, borderRadius: "25px", bgcolor: "black" }}
							disabled={loading1}
						>
							{loading1 ? "Sending..." : "Send OTP"}
						</Button>
					</Box>
				)}

				{step === 2 && (
					<Box component="form" onSubmit={handleSubmitReset(onSubmitReset)} sx={{ mt: 1 }}>
						<Alert severity="info" sx={{ mb: 2 }}>
							OTP sent to <b>{email}</b>
						</Alert>

						<TextField
							fullWidth
							label="OTP Code (6 digits)"
							{...registerReset("otp")}
							error={!!errorsReset.otp}
							helperText={errorsReset.otp?.message}
							sx={{ mb: 2 }}
						/>
						<TextField
							fullWidth
							label="New Password"
							type="password"
							{...registerReset("newPassword")}
							error={!!errorsReset.newPassword}
							helperText={errorsReset.newPassword?.message}
							sx={{ mb: 2 }}
						/>
						<TextField
							fullWidth
							label="Confirm Password"
							type="password"
							{...registerReset("confirmPassword")}
							error={!!errorsReset.confirmPassword}
							helperText={errorsReset.confirmPassword?.message}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 1, py: 1.5, borderRadius: "25px", bgcolor: "black" }}
							disabled={loading2}
						>
							{loading2 ? "Processing..." : "Reset Password"}
						</Button>
						<Button fullWidth onClick={() => setStep(1)} disabled={loading2}>
							Back
						</Button>
					</Box>
				)}
			</DialogContent>
		</Dialog>
	);
}
