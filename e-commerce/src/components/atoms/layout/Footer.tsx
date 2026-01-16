"use client";
import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, YouTube } from "@mui/icons-material";
import CyberLogo from "../CyberLogo";

const SOCIAL_ICONS = [
	{ name: "Twitter", icon: Twitter },
	{ name: "Facebook", icon: Facebook },
	{ name: "YouTube", icon: YouTube },
	{ name: "Instagram", icon: Instagram },
];
const SERVICES = [
	"Bonus program",
	"Gift cards",
	"Credit and payment",
	"Service contracts",
	"Non-cash account",
	"Payment",
];
const ASSISTANCE = [
	"Find an order",
	"Terms of delivery",
	"Exchange and return of goods",
	"Guarantee",
	"Frequently asked questions",
	"Terms of use of the site",
];
const FOOTER_LINK_SECTIONS = [
	{
		title: "Services",
		items: SERVICES,
		containerSx: { width: { md: "50%" } },
	},
	{
		title: "Assistance to the buyer",
		items: ASSISTANCE,
		containerSx: { width: { md: "30%" } },
	},
];
const Footer: React.FC = () => {
	return (
		<Box
			component="footer"
			sx={{ bgcolor: "black", color: "white", py: { xs: 4, md: 8 }, mt: "auto", width: "100%", overflow: "hidden" }}
		>
			<Box
				sx={{
					maxWidth: 1280,
					mx: "auto",
					px: { xs: 2, sm: 4 },
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					flexWrap: "wrap",
					gap: { xs: 4, md: 8 },
				}}
			>
				<Box sx={{ width: { xs: "100%", md: "30%" } }}>
					<CyberLogo color="white" />
					<Typography variant="body2" sx={{ color: "gray", mb: { xs: 2, md: 3 }, mt: { xs: 1, md: 0 }, fontSize: { xs: "0.875rem", md: "inherit" } }}>
						We are a residential interior design firm located in Portland. Our boutique-studio offers more than.
					</Typography>
					<Box sx={{ display: "flex", height: 1, gap: { xs: 3, md: 5 } }}>
						{SOCIAL_ICONS.map(item => {
							const Icon = item.icon;
							return (
								<IconButton key={item.name} size="small" sx={{ color: "white" }}>
									<Icon sx={{ fontSize: { xs: 20, md: 24 } }} />
								</IconButton>
							);
						})}
					</Box>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						gap: { xs: 4, md: 8 },
						flexWrap: "wrap",
						width: { xs: "100%", md: "50%" },
					}}
				>
					{FOOTER_LINK_SECTIONS.map(section => (
						<Box 
							key={section.title} 
							sx={{
								...section.containerSx,
								width: { xs: "100%", md: section.containerSx.width.md },
							}}
						>
							<Typography 
								variant="subtitle1" 
								sx={{ 
									fontWeight: "medium", 
									mb: { xs: 1.5, md: 2 },
									fontSize: { xs: "1rem", md: "inherit" }
								}}
							>
								{section.title}
							</Typography>
							<Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 0.5, md: 1 } }}>
								{section.items.map(item => (
									<Link 
										href="#" 
										key={item} 
										color="inherit" 
										underline="hover" 
										variant="body2" 
										sx={{ 
											color: "gray",
											fontSize: { xs: "0.813rem", md: "inherit" }
										}}
									>
										{item}
									</Link>
								))}
							</Box>
						</Box>
					))}
				</Box>
			</Box>
		</Box>
	);
};
export default Footer;
