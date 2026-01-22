"use client";
import Add from "@mui/icons-material/Add";

interface AddButtonProps {
	onClick: () => void;
}

export default function AddButton({ onClick }: AddButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="w-full flex flex-col items-center mt-6 bg-transparent border-none outline-none cursor-pointer group"
		>
			<div className="relative w-full flex items-center justify-center">
				<div className="absolute left-0 right-1/2 h-px border-t border-dashed border-gray-500/50 [mask-image:linear-gradient(to_right,transparent,black)]" />
				<div className="absolute left-1/2 right-0 h-px border-t border-dashed border-gray-500/50 [mask-image:linear-gradient(to_left,transparent,black)]" />

				<div className="relative z-7 bg-white p-1">
					<div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white group-hover:bg-gray-800 transition-colors">
						<Add sx={{ fontSize: 16 }} />
					</div>
				</div>
			</div>

			<span className="mt-2 text-sm font-medium text-black group-hover:text-gray-600 transition-colors">
				Add New Address
			</span>
		</button>
	);
}
