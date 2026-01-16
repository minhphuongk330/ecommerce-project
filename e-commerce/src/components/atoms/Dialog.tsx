"use client";
import React from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";

interface BaseDialogProps extends Omit<DialogProps, "title" | "open"> {
	isOpen: boolean;
	onClose: () => void;
	title?: React.ReactNode;
	children: React.ReactNode;
	width?: number | string;
	showCloseIcon?: boolean;
	className?: string;
	contentClassName?: string;
}

export default function BaseDialog({
	isOpen,
	onClose,
	title,
	children,
	width = 600,
	showCloseIcon = false,
	className = "",
	contentClassName = "",
	PaperProps,
	...props
}: BaseDialogProps) {
	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			scroll="paper"
			maxWidth={false}
			PaperProps={{
				...PaperProps,
				style: {
					borderRadius: "12px",
					width: width,
					maxWidth: "95%",
					padding: 0,
					overflow: "hidden",
					...PaperProps?.style,
				},
			}}
			className={`relative ${className}`}
			{...props}
		>
			{(title || showCloseIcon) && (
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
					<div className="flex-1">
						{title && <div className="text-[24px] font-bold text-black leading-none">{title}</div>}
					</div>
					{showCloseIcon && (
						<IconButton onClick={onClose} className="!text-gray-500 hover:!text-black !-mr-2" aria-label="close">
							<Close sx={{ fontSize: 24 }} />
						</IconButton>
					)}
				</div>
			)}

			<DialogContent className={`!p-6 scrollbar-hide bg-white ${contentClassName}`}>{children}</DialogContent>
		</Dialog>
	);
}
