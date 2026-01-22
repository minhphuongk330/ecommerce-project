import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, UserProfile } from "~/types/auth";
import { useCartStore } from "./cart";

interface AuthState {
	user: User | UserProfile | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	setAuthSuccess: (data: { user: User | UserProfile; accessToken: string; refreshToken: string }) => void;
	logout: () => void;
	setAccessToken: (token: string) => void;
	setUser: (user: User | UserProfile) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		set => ({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,

			setAuthSuccess: data => {
				set({
					user: data.user,
					accessToken: data.accessToken,
					refreshToken: data.refreshToken,
					isAuthenticated: true,
				});
				useCartStore.getState().fetchCart();
			},

			setUser: user => {
				set({ user, isAuthenticated: true });
			},

			setAccessToken: token => {
				set({ accessToken: token });
			},

			logout: () => {
				set({
					user: null,
					accessToken: null,
					refreshToken: null,
					isAuthenticated: false,
				});

				useCartStore.getState().resetLocalCart();
			},
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => localStorage),
			partialize: state => ({
				user: state.user,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
