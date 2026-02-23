"use client";
import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import Header from "~/components/atoms/layout/Header";
import Footer from "~/components/atoms/layout/Footer";
import { NotificationProvider } from "~/contexts/Notification";
import { useAuthStore } from "~/stores/useAuth";
import { useFavoriteStore } from "~/stores/useFavorite";
import BackToTop from "./layout/BackToTop";
import { usePathname } from "next/navigation";

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
	const isAdminPage = usePathname().startsWith("/admin");

	useEffect(() => {
		if (user) {
			fetchFavorites();
		} else {
			clearFavorites();
		}
	}, [user, fetchFavorites, clearFavorites]);

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
