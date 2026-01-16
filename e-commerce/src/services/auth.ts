import axiosClient from "./axiosClient";
import { LoginResponse } from "~/types/auth";
import { UserProfile } from "~/types/auth";
import { LoginPayload } from "~/types/auth";
import { RegisterPayload } from "~/types/auth";
import { UpdateProfilePayload } from "~/types/auth";

export const authService = {
	login(payload: LoginPayload): Promise<LoginResponse> {
		return axiosClient.post("/auth/login", payload);
	},

	register(payload: RegisterPayload): Promise<void> {
		return axiosClient.post("/auth/register", payload);
	},

	getProfile(): Promise<UserProfile> {
		return axiosClient.get("/auth/profile");
	},

	updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
		return axiosClient.patch("/auth/profile", payload);
	},
};
