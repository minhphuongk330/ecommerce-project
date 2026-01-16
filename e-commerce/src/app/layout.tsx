"use client";
import React, { useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Header from "~/components/atoms/layout/Header";
import Footer from "~/components/atoms/layout/Footer";
import "~/styles/globals.css";
import { NotificationProvider } from "~/contexts/Notification";
import { useAuthStore } from "~/stores/useAuth";
import { useFavoriteStore } from "~/stores/useFavorite";

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
				root: {
					textTransform: "none",
				},
			},
		},
	},
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = useAuthStore(state => state.user);
	const { fetchFavorites, clearFavorites } = useFavoriteStore();

	useEffect(() => {
		if (user) {
			fetchFavorites();
		} else {
			clearFavorites();
		}
	}, [user, fetchFavorites, clearFavorites]);

	return (
		<html lang="en">
			<body style={{ margin: 0, padding: 0 }}>
				<ThemeProvider theme={customTheme}>
					<CssBaseline />
					<NotificationProvider>
						<Header />
						<main style={{ minHeight: "calc(85vh - 64px)", flexGrow: 1 }}>{children}</main>
						<Footer />
					</NotificationProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
