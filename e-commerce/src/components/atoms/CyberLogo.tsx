import React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";

interface LogoProps {
	color?: string;
	onClick?: () => void;
	sx?: object;
}
const CyberLogo: React.FC<LogoProps> = ({ color = "black", onClick, sx }) => {
	const src = color === "black" ? "/icons/logoblack.png" : "/icons/logowhite.png";

	return (
		<Box
			onClick={onClick}
			sx={{
				display: "flex",
				alignItems: "center",
				cursor: onClick ? "pointer" : "default",
				...sx,
			}}
		>
			<Image src={src} alt="Cyber Logo" width={120} height={48} style={{ display: "block" }} priority />
		</Box>
	);
};
export default CyberLogo;
