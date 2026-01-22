"use client";
import { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type Props<T extends FieldValues = FieldValues> = {
	name?: Path<T>;
	control?: Control<T>;
	label: string;
	placeholder?: string;
	type?: string;
	className?: string;
	required?: boolean;
	value?: string | number;
	[key: string]: any;
};

const REQUIRED_MARK = (
	<Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
		*
	</Box>
);

const CommonInput = <T extends FieldValues>({
	name,
	control,
	label,
	placeholder,
	type,
	className,
	required = false,
	value,
	...restProps
}: Props<T>) => {
	const [showPassword, setShowPassword] = useState(false);
	const isPasswordType = type === "password";

	const handleTogglePassword = () => setShowPassword(prev => !prev);
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const displayLabel = label.trim();

	const labelMarkup = (
		<p className="mb-1 text-sm font-medium text-gray-900">
			{displayLabel}
			{required && REQUIRED_MARK}
		</p>
	);

	const passwordInputProps = isPasswordType
		? {
				endAdornment: (
					<InputAdornment position="end">
						<IconButton
							aria-label="toggle password visibility"
							onClick={handleTogglePassword}
							onMouseDown={handleMouseDownPassword}
							edge="end"
							size="small"
						>
							{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
						</IconButton>
					</InputAdornment>
				),
			}
		: null;

	const commonSx = {
		"& input::-ms-reveal, & input::-ms-clear": {
			display: "none",
		},
	};

	if (control && name) {
		return (
			<div className={className}>
				{labelMarkup}
				<Controller
					name={name}
					control={control}
					render={({ field, fieldState: { error } }) => (
						<TextField
							{...field}
							value={field.value ?? ""}
							label=""
							placeholder={placeholder}
							type={isPasswordType && showPassword ? "text" : type}
							variant="outlined"
							size="small"
							fullWidth
							error={!!error}
							helperText={error?.message}
							sx={commonSx}
							InputProps={{
								...restProps.InputProps,
								...passwordInputProps,
							}}
							{...restProps}
						/>
					)}
				/>
			</div>
		);
	}

	return (
		<div className={className}>
			{labelMarkup}
			<TextField
				value={value ?? ""}
				label=""
				placeholder={placeholder}
				type={isPasswordType && showPassword ? "text" : type}
				variant="outlined"
				size="small"
				fullWidth
				sx={commonSx}
				InputProps={{
					...restProps.InputProps,
					...passwordInputProps,
				}}
				{...restProps}
			/>
		</div>
	);
};

export default CommonInput;
