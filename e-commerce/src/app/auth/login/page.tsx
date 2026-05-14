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

const REGISTER_BENEFITS = ["Thanh toán nhanh hơn", "Lưu nhiều địa chỉ giao hàng", "Theo dõi đơn hàng dễ dàng"];

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
			showNotification("Đăng nhập thành công", "success");
			router.push(routerPaths.index);
		} catch (error: any) {
			console.error("Login failed:", error);
			if (error.response && error.response.status === 402) {
				showNotification("Email hoặc mật khẩu không đúng", "error");
			} else if (error.response && error.response.status === 401) {
				const message = error.response.data?.message || "";
				if (message.includes("banned")) {
					showNotification("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.", "error");
				} else {
					showNotification("Tài khoản chưa được kích hoạt.", "error");
				}
			} else {
				showNotification("Lỗi hệ thống, vui lòng thử lại sau.", "error");
			}
		}
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
						title="Khách hàng đã có tài khoản"
						description="Đăng nhập bằng địa chỉ email của bạn."
					/>
					<Box sx={{ mb: 2 }}>
						<CommonInput name="email" control={control} label="Email" placeholder="Email của bạn" type="email" required />
					</Box>
					<Box sx={{ mb: 4 }}>
						<CommonInput
							name="password"
							control={control}
							label="Mật khẩu"
							placeholder="Mật khẩu của bạn"
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
							{isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
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
							Quên mật khẩu?
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
						title="Khách hàng mới?"
						description="Tạo tài khoản để trải nghiệm nhiều lợi ích:"
						benefits={REGISTER_BENEFITS}
					/>
					<CommonButton
						theme="dark"
						variant="solid"
						onClick={() => router.push(routerPaths.register)}
						className="!py-3 !rounded-[25px] !max-w-[200px]"
					>
						Tạo tài khoản
					</CommonButton>
				</Box>
			</Box>
		</Box>
	);
}
