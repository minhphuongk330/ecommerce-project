"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, MenuItem, Divider, Typography, ListItemIcon } from "@mui/material";
import { Logout, ShoppingBagOutlined, PersonOutline, Dashboard } from "@mui/icons-material";
import CommonIconButton from "~/components/atoms/IconButton";
import { User, UserProfile } from "~/types/auth";
import { routerPaths } from "~/utils/router";

interface UserMenuProps {
	user: User | UserProfile;
	icon: React.ReactNode;
	onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, icon, onLogout }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogoutClick = () => {
		handleClose();
		onLogout();
	};

	return (
		<>
			<CommonIconButton icon={icon} onClick={handleClick} className="text-black hover:bg-gray-100 p-2" />

			<Menu
				anchorEl={anchorEl}
				open={!!anchorEl}
				onClose={handleClose}
				onClick={handleClose}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
				sx={{ mt: 2 }}
			>
				<MenuItem onClick={handleClose} disabled className="!opacity-100">
					<Typography variant="body2" noWrap className="text-gray-500">
						Hi, <b className="text-black">{user.fullName}</b>
					</Typography>
				</MenuItem>

				<Divider />

				{user.role === "ADMIN" && (
					<div>
						<Link href={routerPaths.adminDashboard} style={{ textDecoration: "none", color: "inherit" }}>
							<MenuItem onClick={handleClose}>
								<ListItemIcon>
									<Dashboard fontSize="small" color="primary" />
								</ListItemIcon>
								<Typography variant="body2" fontWeight="bold" color="primary">
									Admin Dashboard
								</Typography>
							</MenuItem>
						</Link>
						<Divider />
					</div>
				)}

				<Link href={routerPaths.profile} style={{ textDecoration: "none", color: "inherit" }}>
					<MenuItem onClick={handleClose}>
						<ListItemIcon>
							<PersonOutline fontSize="small" />
						</ListItemIcon>
						My Profile
					</MenuItem>
				</Link>

				<Link href={routerPaths.order} style={{ textDecoration: "none", color: "inherit" }}>
					<MenuItem onClick={handleClose}>
						<ListItemIcon>
							<ShoppingBagOutlined fontSize="small" />
						</ListItemIcon>
						My Orders
					</MenuItem>
				</Link>

				<Divider />

				<MenuItem onClick={handleLogoutClick} className="text-red-600">
					<ListItemIcon className="!text-red-600">
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</>
	);
};

export default UserMenu;
