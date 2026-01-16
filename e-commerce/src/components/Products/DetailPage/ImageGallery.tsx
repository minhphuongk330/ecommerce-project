"use client";
import React, { useState, useEffect } from "react";
import { ImageGalleryProps } from "~/types/component";

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
	const [selectedImage, setSelectedImage] = useState(images[0]);
	useEffect(() => {
		if (images.length > 0) {
			setSelectedImage(images[0]);
		}
	}, [images]);

	if (!images || images.length === 0) return null;

	return (
		<div className="w-full lg:w-[536px] flex flex-col lg:flex-row gap-4 lg:gap-[32px] items-center">
			<div className="flex flex-row lg:flex-col gap-3 lg:gap-[24px] w-full lg:w-auto overflow-x-auto lg:overflow-x-visible">
				{images.map((img, index) => (
					<div
						key={index}
						onClick={() => setSelectedImage(img)}
						className={`
                            w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] cursor-pointer border rounded-lg p-1 flex items-center justify-center bg-white transition-all flex-shrink-0
                            ${selectedImage === img ? "border-black" : "border-transparent hover:border-gray-300"}
                        `}
					>
						<img src={img} alt={`thumbnail-${index}`} className="max-w-full max-h-full object-contain" />
					</div>
				))}
			</div>

			<div className="flex-1 w-full lg:w-auto h-[300px] sm:h-[400px] lg:h-[516px] flex items-center justify-center">
				<img src={selectedImage} alt={productName} className="max-w-full max-h-full object-contain" />
			</div>
		</div>
	);
};
export default ImageGallery;
