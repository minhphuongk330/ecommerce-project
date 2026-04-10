"use client";
import Image from "next/image";
import ImageIcon from "@mui/icons-material/Image";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { useState } from "react";

interface ImagePreviewProps {
	src?: string;
	alt?: string;
	size?: number;
}

export default function ImagePreview({ src, alt = "Preview", size = 64 }: ImagePreviewProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<div
				className={`flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center relative group ${src ? "cursor-pointer" : ""}`}
				style={{ width: size, height: size }}
				onClick={() => src && setIsOpen(true)}
			>
				{src ? (
					<>
						<div className="relative w-full h-full">
							<Image src={src} alt={alt} fill sizes={`${size}px`} className="object-contain p-1" />
						</div>
						<div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
							<ZoomInIcon sx={{ color: "white", fontSize: 20 }} />
						</div>
					</>
				) : (
					<ImageIcon sx={{ fontSize: size * 0.4, color: "#d1d5db" }} />
				)}
			</div>

			{isOpen && src && (
				<div
					className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
					onClick={() => setIsOpen(false)}
				>
					<div className="relative max-w-2xl max-h-[80vh] w-full h-full" onClick={e => e.stopPropagation()}>
						<Image src={src} alt={alt} fill className="object-contain" />
					</div>
					<button
						className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300"
						onClick={() => setIsOpen(false)}
					>
						✕
					</button>
				</div>
			)}
		</>
	);
}
