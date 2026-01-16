import React, { useState, useRef } from "react";
import { Control, FieldValues, Path, UseFormSetValue, PathValue } from "react-hook-form";
import { CircularProgress, Tooltip } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CommonInput from "~/components/atoms/Input";
import CommonIconButton from "~/components/atoms/IconButton";
import { uploadService } from "~/services/upload";

interface ImageUploadInputProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	required?: boolean;
	setValue: UseFormSetValue<T>;
}

const ImageUploadInput = <T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	setValue,
}: ImageUploadInputProps<T>) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleTriggerUpload = () => {
		fileInputRef.current?.click();
	};
	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setIsUploading(true);
		try {
			const response = await uploadService.upload(file);
			const url = response?.data?.url || response?.data?.display_url;
			if (url) {
				setValue(name, url as PathValue<T, Path<T>>, { shouldValidate: true });
			}
		} catch (error) {
			console.error("Error upload component:", error);
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	return (
		<div className="flex gap-2 items-center">
			<input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
			<div className="flex-1">
				<CommonInput name={name} control={control} label={label} placeholder="https://..." required={required} />
			</div>
			<Tooltip title="Upload image">
				<div className="mt-4">
					<CommonIconButton
						icon={
							isUploading ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								<CloudUploadIcon className={required ? "text-blue-600" : "text-gray-500"} />
							)
						}
						onClick={handleTriggerUpload}
						disabled={isUploading}
					/>
				</div>
			</Tooltip>
		</div>
	);
};

export default ImageUploadInput;
