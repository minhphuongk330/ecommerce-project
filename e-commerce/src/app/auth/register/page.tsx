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

const REGISTER_BENEFITS = ["Thanh toán nhanh hơn", "Lưu nhiều địa chỉ giao hàng", "Theo dõi đơn hàng dễ dàng"];

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
			showNotification("Đăng ký thành công! Vui lòng đăng nhập.", "success");
			router.push(routerPaths.login);
		} catch (error: any) {
			const errorMsg = error.response?.data?.message || error.message || "Lỗi không xác định";
			console.error("Registration error:", errorMsg);
			if (errorMsg?.includes("Email") && errorMsg?.includes("exists")) {
				setError("email", { type: "manual", message: "Email này đã được sử dụng." });
			} else {
				showNotification(errorMsg, "error");
			}
		}
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
					<AuthHeader title="Tạo tài khoản" description="" />
					<Box sx={{ mb: 1.5 }}>
						<CommonInput name="fullName" control={control} label="Họ và tên" placeholder="Họ và tên của bạn" type="text" required />
					</Box>
					<Box sx={{ mb: 1.5 }}>
						<CommonInput name="email" control={control} label="Email" placeholder="Email của bạn" type="email" required />
					</Box>
					<Box sx={{ mb: 1.5 }}>
						<CommonInput name="password" control={control} label="Mật khẩu" placeholder="Mật khẩu của bạn" type="password" required />
					</Box>
					<Box sx={{ mb: 1.5 }}>
						<CommonInput name="confirmPassword" control={control} label="Nhập lại mật khẩu" placeholder="Nhập lại mật khẩu" type="password" required />
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mt: 2, mb: 3 }}>
						<CommonButton
							type="submit"
							disabled={isSubmitting}
							theme="dark"
							variant="solid"
							className="!py-3 !px-8 !min-w-[120px] !rounded-[25px]"
						>
							{isSubmitting ? "Đang xử lý..." : "Đăng ký"}
						</CommonButton>

						<Typography variant="body2" align="center" sx={{ mt: 3, color: "text.secondary" }}>
							Đã có tài khoản?
							<MuiLink
								onClick={() => router.push(routerPaths.login)}
								underline="hover"
								sx={{ ml: 0.5, fontWeight: "bold", cursor: "pointer", color: "primary.main" }}
							>
								Đăng nhập tại đây
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
						title="Khách hàng mới?"
						description="Tạo tài khoản để trải nghiệm nhiều lợi ích:"
						benefits={REGISTER_BENEFITS}
					/>
				</Box>
			</Box>
		</Box>
	);
}
