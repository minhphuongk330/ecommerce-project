import React from "react";
import { Checkbox as Cb } from "@mui/material";
import { CheckboxProps } from "~/types/catalog";

const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange }) => {
	return (
		<div className="flex flex-row items-center gap-[8px] w-full">
			<Cb
				id={id}
				checked={checked}
				onChange={onChange}
				size="small"
				sx={{
					color: "#D9D9D9",
					"&.Mui-checked": {
						color: "black",
					},
					padding: 0,
					marginRight: "4px",
				}}
			/>
			<label htmlFor={id} className="cursor-pointer text-sm font-light text-black select-none leading-6">
				{label}
			</label>
		</div>
	);
};

export default Checkbox;
