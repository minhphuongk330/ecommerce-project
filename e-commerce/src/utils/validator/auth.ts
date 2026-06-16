import z from "zod";

export const loginSchema = z.object({
	email: z.string().min(1, { message: "Vui lòng nhập email" }).email({ message: "Email không hợp lệ" }),
	password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
});

export const registerSchema = z
	.object({
		fullName: z.string().min(2, { message: "Họ tên tối thiểu 2 ký tự" }),
		email: z.string().min(1, { message: "Vui lòng nhập email" }).email({ message: "Email không hợp lệ" }),
		password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Mật khẩu không khớp",
		path: ["confirmPassword"],
	});

export const updateProfileSchema = z.object({
	fullName: z.string().min(1, { message: "Vui lòng nhập họ tên" }).trim(),
	phoneNumber: z
		.string()
		.regex(/^0\d{9}$/, { message: "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số" })
		.optional()
		.or(z.literal("")),
	gender: z
		.enum(["MALE", "FEMALE", "OTHER"])
		.optional()
		.or(z.literal(""))
		.transform(val => (val === "" ? undefined : val)),
	dateOfBirth: z
		.string()
		.optional()
		.or(z.literal(""))
		.nullable()
		.transform(val => (val === "" || val === null ? undefined : val)),
});

export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(6, { message: "Mật khẩu hiện tại tối thiểu 6 ký tự" }),
		newPassword: z.string().min(6, { message: "Mật khẩu mới tối thiểu 6 ký tự" }),
		confirmPassword: z.string().min(6, { message: "Xác nhận mật khẩu tối thiểu 6 ký tự" }),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: "Mật khẩu không khớp",
		path: ["confirmPassword"],
	})
	.refine(data => data.currentPassword !== data.newPassword, {
		message: "Mật khẩu mới không được trùng với mật khẩu cũ",
		path: ["newPassword"],
	});

export const forgotPasswordSchema = z.object({
	email: z.string().min(1, { message: "Vui lòng nhập email" }).email({ message: "Email không hợp lệ" }),
});

export const otpSchema = z.object({
	otp: z.string().length(6, "OTP phải có 6 chữ số"),
});

export const newPasswordSchema = z
	.object({
		newPassword: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
		confirmPassword: z.string().min(1, "Xác nhận mật khẩu"),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: "Mật khẩu không khớp",
		path: ["confirmPassword"],
	});

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type OtpForm = z.infer<typeof otpSchema>;
export type NewPasswordForm = z.infer<typeof newPasswordSchema>;
