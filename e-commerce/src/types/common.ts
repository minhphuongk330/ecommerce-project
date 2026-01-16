import { IconButtonProps as MuiIconButtonProps } from "@mui/material";

export type ObjectLittle<T> = {
	[key: string]: T;
};
export type RequestStatus = "idle" | "loading" | "success" | "error";
export type Nullable<T> = T | null;
export type ComponentProp<T> = T & {
	className?: string;
	sx?: any;
};
export interface TabsProps {
	options: string[];
	value: string;
	onChange: (value: string) => void;
	className?: string;
}

export interface SearchFieldProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
}
export interface OptionDropDown {
	value: string;
	label: string;
}
export interface CommonIconButtonProps extends MuiIconButtonProps {
	icon: React.ReactNode;
	className?: string;
}
export interface Color {
	name: string;
	hex: string;
}
