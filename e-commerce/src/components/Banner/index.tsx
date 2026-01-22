"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "~/components/atoms/Button";
import { BannerProps } from "~/types/banner";

interface ExtendedBannerProps extends BannerProps {
	buttonClass?: string;
}

const Banner: React.FC<ExtendedBannerProps> = ({
	data,
	buttonText = "Shop Now",
	onClick,
	bgImage,
	className = "",
	contentClass = "",
	titleClass = "",
	descClass = "text-gray-500",
	imageClass = "",
	btnTheme = "light",
	link,
	buttonClass = "",
}) => {
	const router = useRouter();
	if (!data) return null;
	const { title, content, imageUrl } = data;
	const alignClass = contentClass.includes("text-center") ? "items-center" : "items-start";

	const handleClick = () => {
		if (onClick) {
			onClick();
		} else if (link) {
			router.push(link);
		}
	};

	const handleImageClick = () => {
		if (link) {
			router.push(link);
		}
	};

	return (
		<div
			className={`w-full relative overflow-hidden flex ${className}`}
			style={
				bgImage
					? {
							backgroundImage: `url('${bgImage}')`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}
					: {}
			}
		>
			<div className={`h-full flex relative w-full ${contentClass}`}>
				<div className={`z-7 flex flex-col justify-center h-full w-full ${alignClass}`}>
					{title && (
						<div
							className={`mb-6 leading-none tracking-tight  ${titleClass}`}
							dangerouslySetInnerHTML={{ __html: title }}
						/>
					)}
					{content && <p className={`text-lg mb-8 leading-relaxed w-full whitespace-normal ${descClass}`}>{content}</p>}
					{buttonText && (
						<div>
							<Button theme={btnTheme} onClick={handleClick} className={buttonClass}>
								{buttonText}
							</Button>
						</div>
					)}
				</div>

				{imageUrl && (
					<img
						src={imageUrl}
						alt={title || "Banner Product"}
						onClick={handleImageClick}
						className={`z-[5] object-contain ${imageClass.includes("relative") ? "" : "absolute"} ${link ? "cursor-pointer" : ""} ${imageClass}`}
					/>
				)}
			</div>
		</div>
	);
};

export default Banner;
