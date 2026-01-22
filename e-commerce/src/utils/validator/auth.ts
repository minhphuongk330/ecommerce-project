import z from "zod";

export const loginSchema = z.object({
	email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email format" }),
	password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z
	.object({
		fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
		email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email format" }),
		password: z.string().min(6, { message: "Password must be at least 6 characters" }),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const updateProfileSchema = z.object({
	fullName: z.string().min(1, { message: "Please enter full name" }).trim(),
	phoneNumber: z
		.string()
		.regex(/^0\d{9}$/, { message: "Phone number must start with 0 and contain exactly 10 digits" })
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
		currentPassword: z.string().min(6, { message: "Current password must be at least 6 characters" }),
		newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
		confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	})
	.refine(data => data.currentPassword !== data.newPassword, {
		message: "New password must be different from current password",
		path: ["newPassword"],
	});

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
