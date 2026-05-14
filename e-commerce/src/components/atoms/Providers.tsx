"use client";

import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import Footer from "~/components/atoms/layout/Footer";
import Header from "~/components/atoms/layout/Header";
import { NotificationProvider } from "~/contexts/Notification";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/useAuth";
import { useCollectedCoupons } from "~/stores/useCollectedCoupons";
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
	const fetchCart = useCartStore(state => state.fetchCart);
	const resetLocalCart = useCartStore(state => state.resetLocalCart);
	const fetchFavorites = useFavoriteStore(state => state.fetchFavorites);
	const clearFavorites = useFavoriteStore(state => state.clearFavorites);
	const fetchCollectedCoupons = useCollectedCoupons(state => state.fetch);
	const clearCollectedCoupons = useCollectedCoupons(state => state.clear);
	const isAdminPage = usePathname().startsWith("/admin");
	const lastSyncRef = useRef(0);
	const safeSync = async (force = false) => {
		if (!user) return;
		const now = Date.now();
		if (!force && now - lastSyncRef.current < 5000) return;
		lastSyncRef.current = now;
		await Promise.all([fetchCart(force), fetchFavorites(force), fetchCollectedCoupons(force)]);
	};

	const isFirstMount = useRef(true);

	useEffect(() => {
		if (user && !isAdminPage) {
			isFirstMount.current = false;
			const timer = setTimeout(() => safeSync(true), 300);
			return () => clearTimeout(timer);
		} else if (!user && !isFirstMount.current) {
			// Chỉ clear khi user thực sự logout (không phải lần mount đầu chưa hydrate)
			clearFavorites();
			resetLocalCart();
			clearCollectedCoupons();
		}
	}, [user, isAdminPage]);

	useEffect(() => {
		if (!user || isAdminPage) return;
		const handleFocus = () => {
			safeSync();
		};
		const handleVisibility = () => {
			if (document.visibilityState === "visible") {
				safeSync();
			}
		};
		window.addEventListener("focus", handleFocus);
		document.addEventListener("visibilitychange", handleVisibility);
		return () => {
			window.removeEventListener("focus", handleFocus);
			document.removeEventListener("visibilitychange", handleVisibility);
		};
	}, [user, isAdminPage]);

	return (
		<ThemeProvider theme={customTheme}>
			<CssBaseline />
			<NotificationProvider>
				{!isAdminPage && <Header />}
				<main suppressHydrationWarning style={{ minHeight: "calc(85vh - 64px)", flexGrow: 1 }}>
					{children}
				</main>
				{!isAdminPage && <Footer />}
				<BackToTop />
			</NotificationProvider>
		</ThemeProvider>
	);
}
