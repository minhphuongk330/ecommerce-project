import React from "react";
import { TextField, InputAdornment, Box, useTheme, InputBase } from "@mui/material";
import { Search } from "@mui/icons-material";
import { SearchFieldProps } from "~/types/common";

const SearchField: React.FC<SearchFieldProps> = ({ value, onChange, className }) => {
	const theme = useTheme();
	return (
		<Box
			className={className}
			sx={{
				flexGrow: 1,
				maxWidth: 400,
				display: "flex",
				alignItems: "center",
			}}
		>
			<TextField
				fullWidth
				placeholder="Search"
				variant="outlined"
				size="medium"
				value={value}
				onChange={onChange}
				sx={{
					"& .MuiOutlinedInput-root": {
						borderRadius: "10px",
						bgcolor: theme.palette.grey[100],
						"& fieldset": {
							borderColor: "transparent",
						},
						"&:hover fieldset": {
							borderColor: "transparent",
						},
						"&.Mui-focused fieldset": {
							borderColor: "transparent",
						},
					},
				}}
				slotProps={{
					input: {
						startAdornment: (
							<InputAdornment position="start">
								<Search sx={{ color: "gray" }} />
							</InputAdornment>
						),
						style: {},
					},
				}}
			/>
		</Box>
	);
};
export default SearchField;
