import React from "react";
import Button from "~/components/atoms/Button";
import { BannerProps } from "~/types/banner";

const Banner: React.FC<BannerProps> = ({
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
}) => {
	if (!data) return null;
	const { title, content, imageUrl } = data;
	const alignClass = contentClass.includes("text-center") ? "items-center" : "items-start";

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
							<Button theme={btnTheme} onClick={onClick}>
								{buttonText}
							</Button>
						</div>
					)}
				</div>

				{imageUrl && (
					<img
						src={imageUrl}
						alt={title || "Banner Product"}
						className={`z-[5] object-contain ${imageClass.includes("relative") ? "" : "absolute"} ${imageClass}`}
					/>
				)}
			</div>
		</div>
	);
};

export default Banner;
