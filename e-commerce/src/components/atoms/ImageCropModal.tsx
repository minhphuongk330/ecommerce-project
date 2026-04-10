"use client";
import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import Button from "~/components/atoms/Button";
import { getCroppedBlob, CropArea } from "~/utils/cropImage";

interface ImageCropModalProps {
	imageSrc: string;
	onConfirm: (blob: Blob) => void;
	onCancel: () => void;
}

export default function ImageCropModal({ imageSrc, onConfirm, onCancel }: ImageCropModalProps) {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);

	const onCropComplete = useCallback((_: unknown, pixels: CropArea) => {
		setCroppedAreaPixels(pixels);
	}, []);

	const handleConfirm = async () => {
		if (!croppedAreaPixels) return;
		const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
		onConfirm(blob);
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
			<div className="bg-white rounded-xl w-full max-w-lg flex flex-col gap-4 p-6">
				<div className="flex justify-between items-center">
					<h3 className="text-base font-semibold text-gray-800">Crop Image</h3>
					<button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
						✕
					</button>
				</div>

				<div className="relative w-full h-72 bg-gray-100 rounded-lg overflow-hidden">
					<Cropper
						image={imageSrc}
						crop={crop}
						zoom={zoom}
						aspect={1}
						onCropChange={setCrop}
						onZoomChange={setZoom}
						onCropComplete={onCropComplete}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-xs text-gray-500">Zoom</label>
					<input
						type="range"
						min={1}
						max={3}
						step={0.05}
						value={zoom}
						onChange={e => setZoom(Number(e.target.value))}
						className="w-full accent-black"
					/>
				</div>

				<div className="flex justify-end">
					<Button onClick={handleConfirm} theme="dark" variant="solid" className="!w-auto px-4 !h-10">
						Confirm
					</Button>
				</div>
			</div>
		</div>
	);
}
