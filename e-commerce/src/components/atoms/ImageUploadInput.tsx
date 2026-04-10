"use client";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CircularProgress, Tooltip } from "@mui/material";
import { useRef, useState } from "react";
import { Control, FieldValues, Path, PathValue, UseFormSetValue, useWatch } from "react-hook-form";
import CommonIconButton from "~/components/atoms/IconButton";
import ImagePreview from "~/components/atoms/ImagePreview";
import ImageCropModal from "~/components/atoms/ImageCropModal";
import { uploadService } from "~/services/upload";

interface ImageUploadInputProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	required?: boolean;
	setValue: UseFormSetValue<T>;
	onRemove?: () => void;
}

const ImageUploadInput = <T extends FieldValues>({
	control,
	name,
	label,
	required = false,
	setValue,
	onRemove,
}: ImageUploadInputProps<T>) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [cropSrc, setCropSrc] = useState<string | null>(null);
	const currentUrl = useWatch({ control, name }) as string | undefined;

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const objectUrl = URL.createObjectURL(file);
		setCropSrc(objectUrl);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleCropConfirm = async (blob: Blob) => {
		if (cropSrc) URL.revokeObjectURL(cropSrc);
		setCropSrc(null);
		setIsUploading(true);
		try {
			const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
			const response = await uploadService.upload(file);
			const url = response?.data?.url || response?.data?.display_url;
			if (url) setValue(name, url as PathValue<T, Path<T>>, { shouldValidate: true });
		} catch (error) {
			console.error("Upload error:", error);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<>
			<div className="flex gap-3 items-center">
				<input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
				<ImagePreview src={currentUrl} alt={label} size={64} />
				<div className="flex-1 flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600">
						{label} {required && <span className="text-red-500">*</span>}
					</label>
					<div className="flex gap-2 items-center">
						<input
							type="text"
							value={currentUrl || ""}
							readOnly
							disabled
							placeholder="No image selected"
							className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed truncate"
						/>
						<Tooltip title="Upload image">
							<div>
								<CommonIconButton
									icon={
										isUploading ? (
											<CircularProgress size={20} color="inherit" />
										) : (
											<CloudUploadIcon className={required ? "text-blue-600" : "text-gray-500"} fontSize="small" />
										)
									}
									onClick={() => fileInputRef.current?.click()}
									disabled={isUploading}
								/>
							</div>
						</Tooltip>
						{onRemove && (
							<Tooltip title="Remove">
								<div>
									<CommonIconButton
										icon={<DeleteOutlineIcon fontSize="small" className="text-red-400" />}
										onClick={onRemove}
									/>
								</div>
							</Tooltip>
						)}
					</div>
				</div>
			</div>

			{cropSrc && (
				<ImageCropModal
					imageSrc={cropSrc}
					onConfirm={handleCropConfirm}
					onCancel={() => {
						URL.revokeObjectURL(cropSrc);
						setCropSrc(null);
					}}
				/>
			)}
		</>
	);
};

export default ImageUploadInput;
