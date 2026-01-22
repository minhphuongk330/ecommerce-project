export interface LoginForm {
	email: string;
	password: string;
}
export interface RegisterForm {
	fullName: string;
	email: string;
	password: string;
	confirmPassword: string;
}
export interface User {
	id: number | string;
	email: string;
	fullName: string;
	role?: "ADMIN" | "CUSTOMER";
	phoneNumber?: string | null;
	gender?: "MALE" | "FEMALE" | "OTHER" | null;
	dateOfBirth?: string | null;
}
export interface LoginResponse {
	accessToken: string;
	customer: User;
	refreshToken: string;
}
export interface UserProfile extends User {}
export interface RegisterPayload {
	fullName: string;
	email: string;
	password: string;
	confirm_password: string;
}
export interface LoginPayload {
	email: string;
	password: string;
}

export interface UpdateProfilePayload {
	fullName: string;
	phoneNumber?: string;
	gender?: "MALE" | "FEMALE" | "OTHER";
	dateOfBirth?: string;
}

export interface ChangePasswordForm {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}
