"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Button,
	TextField,
	Typography,
	Box,
	Alert,
	InputAdornment,
	IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { authService } from "~/services/auth";
import { useNotification } from "~/contexts/Notification";
import {
	forgotPasswordSchema,
	otpSchema,
	newPasswordSchema,
	ForgotPasswordForm,
	OtpForm,
	NewPasswordForm,
} from "~/utils/validator/auth";

const RESEND_COOLDOWN = 60;

interface Props {
	open: boolean;
	onClose: () => void;
}

type Step = 1 | 2 | 3;

export default function ForgotPasswordModal({ open, onClose }: Props) {
	const [step, setStep] = useState<Step>(1);
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [resendCountdown, setResendCountdown] = useState(RESEND_COOLDOWN);
	const { showNotification } = useNotification();

	useEffect(() => {
		if (step !== 2 || resendCountdown <= 0) return;
		const timer = setTimeout(() => setResendCountdown(prev => prev - 1), 1000);
		return () => clearTimeout(timer);
	}, [step, resendCountdown]);

	const emailForm = useForm<ForgotPasswordForm>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const otpForm = useForm<OtpForm>({
		resolver: zodResolver(otpSchema),
	});

	const passwordForm = useForm<NewPasswordForm>({
		resolver: zodResolver(newPasswordSchema),
	});

	const resetAllForms = useCallback(() => {
		emailForm.reset();
		otpForm.reset();
		passwordForm.reset();
		setStep(1);
		setEmail("");
		setOtp("");
		setResendCountdown(RESEND_COOLDOWN);
	}, [emailForm, otpForm, passwordForm]);

	const handleClose = () => {
		onClose();
		setTimeout(resetAllForms, 200);
	};

	const handleSendOtp = async (emailValue: string) => {
		await authService.forgotPassword({ email: emailValue });
		setResendCountdown(RESEND_COOLDOWN);
	};

	const onSubmitEmail = async (data: ForgotPasswordForm) => {
		try {
			await handleSendOtp(data.email);
			setEmail(data.email);
			setStep(2);
			showNotification("OTP sent to your email", "success");
		} catch (error: any) {
			showNotification(error?.response?.data?.message || "Failed to send OTP", "error");
		}
	};

	const onResendOtp = async () => {
		if (resendCountdown > 0) return;
		try {
			await handleSendOtp(email);
			showNotification("OTP resent to your email", "success");
		} catch (error: any) {
			showNotification(error?.response?.data?.message || "Failed to resend OTP", "error");
		}
	};

	const onSubmitOtp = (data: OtpForm) => {
		setOtp(data.otp);
		setStep(3);
	};

	const onSubmitPassword = async (data: NewPasswordForm) => {
		try {
			await authService.resetPassword({
				email,
				otp,
				newPassword: data.newPassword,
				confirmPassword: data.confirmPassword,
			});
			showNotification("Password reset successfully! Please login.", "success");
			handleClose();
		} catch (error: any) {
			showNotification(error?.response?.data?.message || "Reset failed", "error");
		}
	};

	const stepTitles: Record<Step, string> = {
		1: "Forgot Password",
		2: "Enter OTP",
		3: "Reset Password",
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ fontWeight: "bold", pr: 6 }}>
				{stepTitles[step]}
				<IconButton
					onClick={handleClose}
					sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent>
				{step === 1 && (
					<Box component="form" onSubmit={emailForm.handleSubmit(onSubmitEmail)} sx={{ mt: 1 }}>
						<Typography variant="body2" sx={{ mb: 2 }}>
							Enter your email address and we'll send you an OTP code to reset your password.
						</Typography>
						<TextField
							fullWidth
							label="Email Address"
							type="email"
							{...emailForm.register("email")}
							error={!!emailForm.formState.errors.email}
							helperText={emailForm.formState.errors.email?.message}
							disabled={emailForm.formState.isSubmitting}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 1, py: 1.5, borderRadius: "25px", bgcolor: "black" }}
							disabled={emailForm.formState.isSubmitting}
						>
							{emailForm.formState.isSubmitting ? "Sending..." : "Send OTP"}
						</Button>
					</Box>
				)}

				{step === 2 && (
					<Box component="form" onSubmit={otpForm.handleSubmit(onSubmitOtp)} sx={{ mt: 1 }}>
						<Alert severity="info" sx={{ mb: 2 }}>
							OTP sent to <b>{email}</b>
						</Alert>
						<TextField
							fullWidth
							label="OTP Code (6 digits)"
							{...otpForm.register("otp")}
							error={!!otpForm.formState.errors.otp}
							helperText={otpForm.formState.errors.otp?.message}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<Button
											size="small"
											onClick={onResendOtp}
											disabled={resendCountdown > 0}
											sx={{ whiteSpace: "nowrap", minWidth: "auto" }}
										>
											{resendCountdown > 0 ? `${resendCountdown}s` : "Resend"}
										</Button>
									</InputAdornment>
								),
							}}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 1, py: 1.5, borderRadius: "25px", bgcolor: "black" }}
						>
							Next
						</Button>
						<Button fullWidth onClick={() => setStep(1)}>
							Back
						</Button>
					</Box>
				)}

				{step === 3 && (
					<Box component="form" onSubmit={passwordForm.handleSubmit(onSubmitPassword)} sx={{ mt: 1 }}>
						<TextField
							fullWidth
							label="New Password"
							type="password"
							{...passwordForm.register("newPassword")}
							error={!!passwordForm.formState.errors.newPassword}
							helperText={passwordForm.formState.errors.newPassword?.message}
							sx={{ mb: 2 }}
						/>
						<TextField
							fullWidth
							label="Confirm Password"
							type="password"
							{...passwordForm.register("confirmPassword")}
							error={!!passwordForm.formState.errors.confirmPassword}
							helperText={passwordForm.formState.errors.confirmPassword?.message}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 1, py: 1.5, borderRadius: "25px", bgcolor: "black" }}
							disabled={passwordForm.formState.isSubmitting}
						>
							{passwordForm.formState.isSubmitting ? "Processing..." : "Reset Password"}
						</Button>
					</Box>
				)}
			</DialogContent>
		</Dialog>
	);
}
