import React from "react";
import { Typography, Box } from "@mui/material";
import { ListItem, List } from "@mui/material";

interface AuthHeaderProps {
	title: string;
	description: string;
	benefits?: string[];
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, description, benefits }) => {
	return (
		<Box sx={{ mb: 1 }}>
			<Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
				{title}
			</Typography>
			<Typography variant="body2" sx={{ color: "text.secondary" }}>
				{description}
			</Typography>
			{benefits && benefits.length > 0 && (
				<List disablePadding sx={{ mb: 4, ml: 2, listStyleType: "disc" }}>
					{benefits.map((benefit, index) => (
						<ListItem
							key={index}
							disablePadding
							sx={{
								mb: 1.5,
								display: "list-item",
							}}
						>
							<Typography variant="body2">{benefit}</Typography>
						</ListItem>
					))}
				</List>
			)}
		</Box>
	);
};

export default AuthHeader;
