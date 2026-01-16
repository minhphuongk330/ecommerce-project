"use client";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Box, TextField } from "@mui/material";

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
	const displayLabel = label.trim();

	const labelMarkup = (
		<p className="mb-1 text-sm font-medium text-gray-900">
			{displayLabel}
			{required && REQUIRED_MARK}
		</p>
	);

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
							type={type}
							variant="outlined"
							size="small"
							fullWidth
							error={!!error}
							helperText={error?.message}
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
				type={type}
				variant="outlined"
				size="small"
				fullWidth
				{...restProps}
			/>
		</div>
	);
};

export default CommonInput;
