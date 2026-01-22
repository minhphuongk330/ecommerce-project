"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import MuiIconButton from "@mui/material/IconButton";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Menu from "@mui/icons-material/Menu";
import Close from "@mui/icons-material/Close";
import CommonIconButton from "~/components/atoms/IconButton";
import CyberLogo from "../CyberLogo";
import UserMenu from "../UserMenu";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/useAuth";
import { useFavoriteStore } from "~/stores/useFavorite";
import { useFromStore } from "~/hooks/useFromStore";
import { routerPaths } from "~/utils/router";
import { authService } from "~/services/auth";
import ProductSearch from "~/components/Products/Search";
import { useScrollDirection } from "~/hooks/useScrollDirection";

const ACTION_ICONS = [
	{ name: "Favorite", icon: FavoriteBorderOutlined, href: routerPaths.favorite, hasBadge: true },
	{ name: "ShoppingCart", icon: ShoppingCartOutlined, href: routerPaths.cart, hasBadge: true },
	{ name: "Person", icon: PersonOutline, href: routerPaths.login, hasBadge: false },
];

const NAV_LINKS = [
	{ name: "Home", href: routerPaths.index },
	{ name: "About", href: routerPaths.about },
	{ name: "Contact Us", href: routerPaths.contact },
	{ name: "Blog", href: routerPaths.blog },
];

const Header: React.FC = () => {
	const currentPath = usePathname();
	const router = useRouter();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const scrollDirection = useScrollDirection();
	const isHidden = scrollDirection === "down";
	const cartItems = useFromStore(useCartStore, state => state.cartItems);
	const favorites = useFromStore(useFavoriteStore, state => state.favorites);
	const user = useFromStore(useAuthStore, state => state.user);
	const isAuthenticated = useFromStore(useAuthStore, state => state.isAuthenticated);
	const { logout, setUser } = useAuthStore();

	const checkAuth = async () => {
		if (isAuthenticated) {
			try {
				const profile = await authService.getProfile();
				setUser(profile);
			} catch (error) {
				console.error("Session expired:", error);
				logout();
			}
		}
	};

	useEffect(() => {
		checkAuth();
	}, [isAuthenticated]);

	const totalCartItems = useMemo(() => {
		if (!cartItems) return 0;
		return cartItems.reduce((sum, item) => sum + item.quantity, 0);
	}, [cartItems]);

	const totalFavoriteItems = useMemo(() => {
		if (!favorites) return 0;
		return favorites.length;
	}, [favorites]);

	const handleLogout = () => {
		logout();
		router.push(routerPaths.login);
	};

	const badgeCountMap: Record<string, number> = {
		ShoppingCart: totalCartItems,
		Favorite: totalFavoriteItems,
	};

	const renderNavItems = (isMobile = false) => (
		<Box
			sx={{
				display: "flex",
				alignItems: isMobile ? "flex-start" : "center",
				gap: isMobile ? 2 : 3,
				flexDirection: isMobile ? "column" : "row",
				width: isMobile ? "100%" : "auto",
			}}
		>
			{NAV_LINKS.map(link => {
				const isActive = currentPath === link.href;
				return (
					<Link
						key={link.name}
						href={link.href}
						style={{ textDecoration: "none", width: isMobile ? "100%" : "auto" }}
						onClick={() => isMobile && setMobileMenuOpen(false)}
					>
						<Typography
							variant="body2"
							sx={{
								cursor: "pointer",
								color: isActive ? "text.primary" : "grey.600",
								fontWeight: isActive ? "bold" : "normal",
								"&:hover": { color: "primary.dark" },
								padding: isMobile ? "8px 0" : 0,
								fontSize: isMobile ? "16px" : "inherit",
							}}
						>
							{link.name}
						</Typography>
					</Link>
				);
			})}
		</Box>
	);

	return (
		<>
			<Box
				component="header"
				sx={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					width: "100%",
					zIndex: 50,
					bgcolor: "white",
					borderBottom: "1px solid #eee",
					transition: "transform 0.3s ease-in-out",
					transform: isHidden ? "translateY(-100%)" : "translateY(0)",
					boxShadow: isHidden ? "none" : "0 2px 4px rgba(0,0,0,0.02)",
				}}
			>
				<Box
					sx={{
						maxWidth: 1280,
						mx: "auto",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						p: { xs: 1.5, md: 2 },
						gap: { xs: 1, md: 4 },
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 0 } }}>
						<MuiIconButton
							onClick={() => setMobileMenuOpen(true)}
							sx={{ display: { xs: "flex", md: "none" }, color: "black" }}
						>
							<Menu />
						</MuiIconButton>

						<Box sx={{ display: { xs: "none", md: "block" } }}>
							<Link href={routerPaths.index}>
								<CyberLogo color="black" />
							</Link>
						</Box>
					</Box>

					<Box sx={{ display: { xs: "none", md: "block" }, flex: 1, maxWidth: 400, mx: 2 }}>
						<ProductSearch />
					</Box>

					<Box sx={{ display: { xs: "none", md: "flex" } }}>{renderNavItems()}</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 3 } }}>
						<Box sx={{ display: { xs: "block", md: "none" } }}>
							<ProductSearch />
						</Box>
						{ACTION_ICONS.map(item => {
							const IconComponent = item.icon;
							let iconElement = <IconComponent sx={{ fontSize: { xs: 24, md: 28 } }} />;
							const badgeCount = badgeCountMap[item.name] ?? 0;

							if (item.hasBadge && badgeCount > 0) {
								iconElement = (
									<Badge badgeContent={badgeCount} color="error" max={99}>
										{iconElement}
									</Badge>
								);
							}

							if (item.name === "Person" && user) {
								return <UserMenu key={item.name} user={user} icon={iconElement} onLogout={handleLogout} />;
							}

							return (
								<Link key={item.name} href={item.href}>
									<CommonIconButton icon={iconElement} className="text-black hover:bg-gray-100 p-2" />
								</Link>
							);
						})}
					</Box>
				</Box>
			</Box>

			<Box sx={{ height: { xs: "64px", md: "88px" } }} />

			<Drawer
				anchor="left"
				open={mobileMenuOpen}
				onClose={() => setMobileMenuOpen(false)}
				sx={{
					display: { xs: "block", md: "none" },
					"& .MuiDrawer-paper": {
						width: "80%",
						maxWidth: 300,
						padding: 2,
						display: "flex",
						flexDirection: "column",
					},
				}}
			>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
					<Typography variant="h6" sx={{ fontWeight: "bold" }}>
						Menu
					</Typography>
					<MuiIconButton onClick={() => setMobileMenuOpen(false)}>
						<Close />
					</MuiIconButton>
				</Box>
				{renderNavItems(true)}
			</Drawer>
		</>
	);
};

export default Header;
