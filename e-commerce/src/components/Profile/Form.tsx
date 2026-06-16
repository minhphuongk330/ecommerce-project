"use client";
import { Control } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import { UpdateProfilePayload } from "~/types/auth";
import CommonInput from "~/components/atoms/Input";

const GENDER_OPTIONS = [
	{ value: "MALE", label: "Nam" },
	{ value: "FEMALE", label: "Nữ" },
	{ value: "OTHER", label: "Khác" },
];

interface Props {
	control: Control<UpdateProfilePayload>;
	email?: string;
}

const ProfileForm = ({ control, email }: Props) => {
	return (
		<>
			<CommonInput
				label="Email"
				value={email || ""}
				disabled
				sx={{
					"& .MuiInputBase-input.Mui-disabled": {
						WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
						backgroundColor: "#f9fafb",
					},
				}}
			/>
			<CommonInput name="fullName" control={control} label="Họ và tên" required />
			<CommonInput name="phoneNumber" control={control} label="Số điện thoại" type="tel" />

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
				<CommonInput name="gender" control={control} label="Giới tính" select>
					{GENDER_OPTIONS.map(option => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</CommonInput>

				<CommonInput
					name="dateOfBirth"
					control={control}
					label="Ngày sinh"
					type="date"
					InputLabelProps={{ shrink: true }}
				/>
			</div>
		</>
	);
};

export default ProfileForm;
