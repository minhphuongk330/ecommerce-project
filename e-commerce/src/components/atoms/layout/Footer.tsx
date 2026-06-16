"use client";
import Facebook from "@mui/icons-material/Facebook";
import Instagram from "@mui/icons-material/Instagram";
import Twitter from "@mui/icons-material/Twitter";
import YouTube from "@mui/icons-material/YouTube";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import CyberLogo from "../CyberLogo";
import { routerPaths } from "~/utils/router";

const SOCIAL_ICONS = [
	{ name: "Twitter", icon: Twitter },
	{ name: "Facebook", icon: Facebook },
	{ name: "YouTube", icon: YouTube },
	{ name: "Instagram", icon: Instagram },
];

const WEBSITE = [
	{ name: "Giới thiệu về website", path: "/about" },
	{ name: "Gửi góp ý khiếu nại", path: "/contact?subject=feedback" }
];

const INFOMATION = [
	{ name: "Giới thiệu", path: "/about" },
	{ name: "Tuyển dụng", path: "/info/tuyen-dung" },
	{ name: "Chính sách bán hàng", path: "/info/chinh-sach-ban-hang" },
	{ name: "Chính sách bảo mật", path: "/info/chinh-sach-bao-mat" },
	{ name: "Chính sách đổi trả", path: "/info/chinh-sach-doi-tra" },
	{ name: "Chính sách bảo hành", path: "/info/chinh-sach-bao-hanh" },
];

const SUPPORT_CENTER = [
	{ label: "Gọi mua: ", value: "1900 232 461", suffix: " (8:00 - 21:30)" },
	{ label: "Khiếu nại: ", value: "1800.1063", suffix: " (8:00 - 21:30)" },
	{ label: "Bảo hành: ", value: "1900 232 465", suffix: " (8:00 - 21:00)" },
];

const FOOTER_LINK_SECTIONS = [
	{
		title: "Tổng đài hỗ trợ",
		type: "support" as const,
		items: SUPPORT_CENTER,
	},
	{
		title: "Website",
		type: "links" as const,
		items: WEBSITE,
	},
	{
		title: "Thông tin khác",
		type: "links" as const,
		items: INFOMATION,
	},
];

const Footer: React.FC = () => {
	const router = useRouter();

	const handleSocialIconClick = () => {
		router.push(routerPaths.comingsoon);
	};

	return (
		<Box
			component="footer"
			sx={{ bgcolor: "black", color: "white", py: { xs: 4, md: 8 }, mt: "auto", width: "100%", overflow: "hidden" }}
		>
			<Box
				sx={{
					maxWidth: 1280,
					mx: "auto",
					px: { xs: 3, sm: 4 },
					display: "grid",
					gridTemplateColumns: {
						xs: "1fr",
						sm: "repeat(2, 1fr)",
						md: "1.2fr 1fr 1fr 1fr",
					},
					gap: { xs: 4, md: 8 },
				}}
			>
				{/* Column 1: Logo & Info */}
				<Box sx={{ display: "flex", flexDirection: "column" }}>
					<CyberLogo color="white" />
					<Typography
						variant="body2"
						sx={{
							color: "gray",
							mb: { xs: 2, md: 3 },
							mt: { xs: 1.5, md: 2 },
							fontSize: { xs: "0.875rem", md: "inherit" },
							lineHeight: 1.6,
						}}
					>
						Cửa hàng công nghệ chính hãng — điện thoại, laptop, tai nghe và phụ kiện chất lượng cao.
					</Typography>
					<Box sx={{ display: "flex", gap: { xs: 3, md: 4 } }}>
						{SOCIAL_ICONS.map(item => {
							const Icon = item.icon;
							return (
								<IconButton
									key={item.name}
									size="small"
									sx={{ color: "white", cursor: "pointer", p: 0 }}
									onClick={handleSocialIconClick}
								>
									<Icon sx={{ fontSize: { xs: 20, md: 24 } }} />
								</IconButton>
							);
						})}
					</Box>
				</Box>

				{/* Columns 2, 3, 4: Link Sections */}
				{FOOTER_LINK_SECTIONS.map(section => (
					<Box key={section.title} sx={{ display: "flex", flexDirection: "column" }}>
						<Typography
							variant="subtitle1"
							sx={{
								fontWeight: "bold",
								mb: { xs: 1.5, md: 2 },
								fontSize: { xs: "1rem", md: "inherit" },
							}}
						>
							{section.title}
						</Typography>
						<Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 0.8, md: 1.2 } }}>
							{section.type === "support" ? (
								(section.items as typeof SUPPORT_CENTER).map(item => (
									<Typography
										key={item.value}
										variant="body2"
										sx={{
											color: "gray",
											fontSize: { xs: "0.813rem", md: "inherit" },
											lineHeight: 1.4,
										}}
									>
										{item.label}
										<Link
											component={NextLink}
											href={`tel:${item.value.replace(/[^0-9]/g, "")}`}
											sx={{
												color: "#2F80ED",
												fontWeight: "bold",
												textDecoration: "none",
												cursor: "pointer",
												"&:hover": {
													textDecoration: "underline",
												},
											}}
										>
											{item.value}
										</Link>
										{item.suffix}
									</Typography>
								))
							) : (
								(section.items as any[]).map(item => (
									<Link
										component={NextLink}
										href={item.path}
										key={item.name}
										color="inherit"
										underline="hover"
										variant="body2"
										sx={{
											color: "gray",
											fontSize: { xs: "0.813rem", md: "inherit" },
											cursor: "pointer",
										}}
									>
										{item.name}
									</Link>
								))
							)}
						</Box>
					</Box>
				))}
			</Box>
		</Box>
	);
};
export default Footer;
