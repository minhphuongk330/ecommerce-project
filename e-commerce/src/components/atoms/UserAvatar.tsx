import Avatar from "@mui/material/Avatar";

interface UserAvatarProps {
	src?: string | null;
	alt?: string;
	size?: number;
	className?: string;
	bgColor?: string;
	textColor?: string;
}

export default function UserAvatar({
	src,
	alt = "User",
	size = 40,
	className,
	bgColor = "#FFB547",
	textColor = "#FFFFFF",
}: UserAvatarProps) {
	const firstLetter = alt ? alt.charAt(0).toUpperCase() : "U";

	return (
		<Avatar
			src={src || undefined}
			alt={alt}
			className={className}
			sx={{
				width: size,
				height: size,
				bgcolor: bgColor,
				color: textColor,
				fontWeight: "bold",
				fontSize: size * 0.5,
			}}
		>
			{firstLetter}
		</Avatar>
	);
}
