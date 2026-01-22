import React from "react";
import { SxProps, Theme, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Search from "@mui/icons-material/Search";
import { SearchFieldProps } from "~/types/common";

interface ExtendedSearchFieldProps extends SearchFieldProps {
	onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
	sx?: SxProps<Theme>;
}

const SearchField: React.FC<ExtendedSearchFieldProps> = ({
	value,
	onChange,
	className,
	placeholder,
	onKeyDown,
	sx,
}) => {
	return (
		<Box
			className={className}
			sx={{
				width: "100%",
				display: "flex",
				alignItems: "center",
			}}
		>
			<TextField
				fullWidth
				placeholder={placeholder || "Search"}
				variant="outlined"
				size="small"
				value={value}
				onChange={onChange}
				onKeyDown={onKeyDown}
				slotProps={{
					input: {
						startAdornment: (
							<InputAdornment position="start">
								<Search sx={{ color: "gray" }} />
							</InputAdornment>
						),
					},
				}}
				sx={{
					"& .MuiOutlinedInput-root": {
						bgcolor: "#F5F5F5",
						borderRadius: "8px",
						"& fieldset": { borderColor: "transparent" },
						"&:hover fieldset": { borderColor: "#ccc" },
						"&.Mui-focused fieldset": { borderColor: "transparent" },
						"& input": {
							padding: "10px 12px 10px 0",
							fontSize: "0.875rem",
						},
					},
					...sx,
				}}
			/>
		</Box>
	);
};
export default SearchField;
