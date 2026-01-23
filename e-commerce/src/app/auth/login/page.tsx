"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import CommonButton from "~/components/atoms/Button";
import CommonInput from "~/components/atoms/Input";
import AuthHeader from "~/components/atoms/AuthHeader";
import { LoginForm } from "~/types/auth";
import { loginSchema } from "~/utils/validator/auth";
import { useAuthStore } from "~/stores/useAuth";
import { routerPaths } from "~/utils/router";
import { useNotification } from "~/contexts/Notification";
import { authService } from "~/services/auth";
import ForgotPasswordModal from "~/components/Auth/ForgotPasswordModal";
import { useState } from "react";

const REGISTER_BENEFITS = ["Check out faster", "Keep more than one address", "Track orders and more"];

export default function LoginPage() {
	const router = useRouter();
	const { setAuthSuccess } = useAuthStore();
	const { showNotification } = useNotification();
	const [isForgotModalOpen, setForgotModalOpen] = useState(false);

	const {
		control,
		formState: { isSubmitting },
		handleSubmit,
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = async (data: LoginForm) => {
		try {
			const response = await authService.login(data);
			setAuthSuccess({
				user: response.customer,
				accessToken: response.accessToken,
				refreshToken: response.refreshToken,
			});
			showNotification("Login successful", "success");
			router.push(routerPaths.index);
		} catch (error: any) {
			console.error("Login failed:", error);
			if (error.response && error.response.status === 402) {
				showNotification("Email or password is incorrect", "error");
			} else {
				showNotification("System error, please try again later.", "error");
			}
		}
	};

	const handleNavigateToRegister = () => {
		router.push(routerPaths.register);
	};

	return (
		<Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "background.default" }}>
			<ForgotPasswordModal open={isForgotModalOpen} onClose={() => setForgotModalOpen(false)} />
			<Box
				sx={{
					maxWidth: 1200,
					mx: "auto",
					display: "flex",
					gap: { xs: 2, md: 4 },
					px: { xs: 2, md: 4 },
					flexDirection: { xs: "column", md: "row" },
				}}
			>
				<Box
					component="form"
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					sx={{
						width: { xs: "100%", md: "50%" },
						px: { xs: 4, md: 8 },
						py: { xs: 4, md: 3 },
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						bgcolor: "white",
						borderRadius: "8px",
						boxShadow: 3,
					}}
				>
					<AuthHeader
						title="Registered Customers"
						description="If you have an account, sign in with your email address."
					/>
					<Box sx={{ mb: 2 }}>
						<CommonInput name="email" control={control} label="Email " placeholder="Your email" type="email" required />
					</Box>
					<Box sx={{ mb: 4 }}>
						<CommonInput
							name="password"
							control={control}
							label="Password"
							placeholder="Your password"
							type="password"
							required
						/>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<CommonButton
							type="submit"
							disabled={isSubmitting}
							theme="dark"
							variant="solid"
							className="!py-3 !px-8 !min-w-[120px] !rounded-[25px]"
						>
							{isSubmitting ? "Logging in..." : "Sign In"}
						</CommonButton>
						<MuiLink
							component="button"
							type="button"
							onClick={() => setForgotModalOpen(true)}
							variant="body2"
							sx={{
								color: "primary.main",
								fontWeight: "medium",
								textDecoration: "underline",
								cursor: "pointer",
								border: "none",
								bgcolor: "transparent",
							}}
						>
							Forgot Your Password?
						</MuiLink>
					</Box>
				</Box>
				<Box
					sx={{
						width: { xs: "100%", md: "50%" },
						backgroundColor: "#f5f5f5",
						px: { xs: 4, md: 8 },
						py: { xs: 6, md: 11 },
						borderRadius: "8px",
						boxShadow: 3,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						height: "100%",
					}}
				>
					<AuthHeader
						title="New Customer?"
						description="Creating an account has many benefits:"
						benefits={REGISTER_BENEFITS}
					/>
					<CommonButton
						theme="dark"
						variant="solid"
						onClick={handleNavigateToRegister}
						className="!py-3 !rounded-[25px] !max-w-[200px]"
					>
						Create An Account
					</CommonButton>
				</Box>
			</Box>
		</Box>
	);
}
