import { Checkbox as Cb } from "@mui/material";
import React from "react";
import { CheckboxProps } from "~/types/catalog";

const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, indeterminate = false, onChange }) => {
	const checkboxStyles = {
		color: "#D9D9D9",
		"&.Mui-checked": {
			color: "black",
		},
		"&.MuiCheckbox-indeterminate": {
			color: "black",
		},
		padding: "5px",
		margin: 0,
	};

	if (!label) {
		return (
			<Cb
				id={id}
				checked={checked}
				indeterminate={indeterminate}
				onChange={onChange}
				size="small"
				sx={checkboxStyles}
			/>
		);
	}

	return (
		<div className="flex flex-row items-center gap-[7px] w-full">
			<Cb
				id={id}
				checked={checked}
				indeterminate={indeterminate}
				onChange={onChange}
				size="small"
				sx={{ ...checkboxStyles, marginRight: "4px" }}
			/>
			<label htmlFor={id} className="cursor-pointer text-sm font-light text-black select-none leading-6">
				{label}
			</label>
		</div>
	);
};

export default Checkbox;
