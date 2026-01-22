import Chip from "@mui/material/Chip";

export type ChipColor = "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";

interface StatusChipProps {
	label: string;
	color?: ChipColor;
	className?: string;
	onClick?: () => void;
}

export default function StatusChip({ label, color = "default", className, onClick }: StatusChipProps) {
	return (
		<Chip
			label={label}
			color={color}
			size="small"
			variant="outlined"
			className={`font-medium ${className || ""}`}
			onClick={onClick}
		/>
	);
}
