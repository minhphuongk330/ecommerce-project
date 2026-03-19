"use client";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Footer from "~/components/atoms/layout/Footer";
import Header from "~/components/atoms/layout/Header";
import { NotificationProvider } from "~/contexts/Notification";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/useAuth";
import { useFavoriteStore } from "~/stores/useFavorite";
import BackToTop from "./layout/BackToTop";

const customTheme = createTheme({
	palette: {
		primary: { main: "#1976D2" },
		secondary: { main: "#757575" },
	},
	typography: {
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		fontWeightBold: 700,
		fontWeightLight: 300,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: { textTransform: "none" },
			},
		},
	},
});

export default function Providers({ children }: { children: React.ReactNode }) {
	const user = useAuthStore(state => state.user);
	const { fetchFavorites, clearFavorites } = useFavoriteStore();
	const { fetchCart, resetLocalCart } = useCartStore();
	const isAdminPage = usePathname().startsWith("/admin");

	useEffect(() => {
		if (user) {
			fetchFavorites();
			fetchCart();
		} else { 
			clearFavorites();
			resetLocalCart();
		}
	}, [user, fetchFavorites, clearFavorites, fetchCart, resetLocalCart]);

	return (
		<ThemeProvider theme={customTheme}>
			<CssBaseline />
			<NotificationProvider>
				{!isAdminPage && <Header />}
				<main style={{ minHeight: "calc(85vh - 64px)", flexGrow: 1 }}>{children}</main>
				{!isAdminPage && <Footer />}
				<BackToTop />
			</NotificationProvider>
		</ThemeProvider>
	);
}
