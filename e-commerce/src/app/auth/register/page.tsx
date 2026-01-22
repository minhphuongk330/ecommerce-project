"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import CommonButton from "~/components/atoms/Button";
import CommonInput from "~/components/atoms/Input";
import AuthHeader from "~/components/atoms/AuthHeader";
import { registerSchema } from "~/utils/validator/auth";
import { RegisterForm, RegisterPayload } from "~/types/auth";
import { routerPaths } from "~/utils/router";
import { useNotification } from "~/contexts/Notification";
import { authService } from "~/services/auth";

const REGISTER_BENEFITS = ["Check out faster", "Keep more than one address", "Track orders and more"];

export default function RegisterPage() {
	const router = useRouter();
	const { showNotification } = useNotification();

	const {
		control,
		handleSubmit,
		setError,
		formState: { isSubmitting },
	} = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: RegisterForm) => {
		try {
			const payload: RegisterPayload = {
				fullName: data.fullName,
				email: data.email,
				password: data.password,
				confirm_password: data.confirmPassword,
			};
			await authService.register(payload);
			showNotification("Registration successful! Please log in.", "success");
			router.push(routerPaths.login);
		} catch (error: any) {
			const errorMsg = error.response?.data?.message || error.message || "Unknown error";
			console.error("Registration error:", errorMsg);
			if (errorMsg?.includes("Email") && errorMsg?.includes("exists")) {
				setError("email", { type: "manual", message: "This email has already been used." });
			} else {
				showNotification(errorMsg, "error");
			}
		}
	};

	const handleNavigateToLogin = () => {
		router.push(routerPaths.login);
	};

	return (
		<Box sx={{ py: { xs: 4, md: 4 }, bgcolor: "background.default" }}>
			<Box
				sx={{
					maxWidth: 1200,
					mx: "auto",
					display: "flex",
					gap: { xs: 2, md: 4 },
					px: { xs: 2, md: 5 },
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
						py: { xs: 4, md: 7 },
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						bgcolor: "white",
						borderRadius: "8px",
						boxShadow: 3,
					}}
				>
					<AuthHeader title="Create Account" description="" />
					<Box sx={{ mb: 1.5 }}>
						<CommonInput name="fullName" control={control} label="Name " placeholder="Your name" type="text" required />
					</Box>
					<Box sx={{ mb: 1.5 }}>
						<CommonInput name="email" control={control} label="Email " placeholder="Your email" type="email" required />
					</Box>
					<Box sx={{ mb: 1.5 }}>
						<CommonInput
							name="password"
							control={control}
							label="Password "
							placeholder="Your password"
							type="password"
							required
						/>
					</Box>

					<Box sx={{ mb: 1.5 }}>
						<CommonInput
							name="confirmPassword"
							control={control}
							label="Repeat Password "
							placeholder="Your password"
							type="password"
							required
						/>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mt: 2, mb: 3 }}>
						<CommonButton
							type="submit"
							disabled={isSubmitting}
							theme="dark"
							variant="solid"
							className="!py-3 !px-8 !min-w-[120px] !rounded-[25px]"
						>
							{isSubmitting ? "Loading..." : "Sign Up"}
						</CommonButton>

						<Typography variant="body2" align="center" sx={{ mt: 3, color: "text.secondary" }}>
							Have ready an account ?
							<MuiLink
								onClick={handleNavigateToLogin}
								underline="hover"
								sx={{ ml: 0.5, fontWeight: "bold", cursor: "pointer", color: "primary.main" }}
							>
								Login here
							</MuiLink>
						</Typography>
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
				</Box>
			</Box>
		</Box>
	);
}
