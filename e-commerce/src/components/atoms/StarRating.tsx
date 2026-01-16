import { Rating, RatingProps } from "@mui/material";

interface StarRatingProps extends Omit<RatingProps, "onChange"> {
	value: number | null;
	onChange?: (value: number | null) => void;
	size?: "small" | "medium" | "large";
	fontSize?: string | number;
}

export default function StarRating({
	value,
	onChange,
	readOnly = false,
	size = "small",
	fontSize,
	sx,
	...props
}: StarRatingProps) {
	return (
		<Rating
			value={value}
			readOnly={readOnly}
			size={size}
			onChange={(_, newValue) => onChange?.(newValue)}
			sx={{
				color: "#FFB547",
				fontSize: fontSize,
				"& .MuiRating-iconEmpty": {
					color: "#E6E6E6",
				},
				...sx,
			}}
			{...props}
		/>
	);
}
