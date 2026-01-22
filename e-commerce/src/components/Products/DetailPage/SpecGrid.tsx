"use client";
import React, { useMemo } from "react";
import ScreenLockPortrait from "@mui/icons-material/ScreenLockPortrait";
import Memory from "@mui/icons-material/Memory";
import SettingsInputComponent from "@mui/icons-material/SettingsInputComponent";
import CameraAlt from "@mui/icons-material/CameraAlt";
import FlipCameraIos from "@mui/icons-material/FlipCameraIos";
import BatteryStd from "@mui/icons-material/BatteryStd";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

import { SpecsGridProps } from "~/types/component";

const SPEC_MAPPING: Record<string, { label: string; icon: React.ReactNode }> = {
	screen: { label: "Screen size", icon: <ScreenLockPortrait /> },
	cpu: { label: "CPU", icon: <Memory /> },
	cores: { label: "Number of Cores", icon: <SettingsInputComponent /> },
	main_camera: { label: "Main camera", icon: <CameraAlt /> },
	front_camera: { label: "Front-camera", icon: <FlipCameraIos /> },
	battery: { label: "Battery capacity", icon: <BatteryStd /> },
};

const formatLabel = (key: string) => {
	return key
		.replace(/_/g, " ")
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, str => str.toUpperCase())
		.trim();
};

const SpecsGrid: React.FC<SpecsGridProps> = ({ specs, className = "" }) => {
	if (!specs) return null;

	const gridItems = useMemo(() => {
		const items: React.ReactNode[] = [];
		for (const key in specs) {
			const value = specs[key as keyof typeof specs];
			if (!value) {
				continue;
			}
			const config = SPEC_MAPPING[key] || {
				label: formatLabel(key),
				icon: <InfoOutlined />,
			};
			items.push(
				<div
					key={key}
					className="w-[168px] h-[64px] bg-[#F4F4F4] rounded-[8px] flex items-center px-4 gap-3 hover:bg-gray-200 transition-colors cursor-default"
				>
					<div className="text-[#4E4E4E] opacity-60">{config.icon}</div>
					<div className="flex flex-col">
						<span className="text-[10px] text-[#A7A7A7]">{config.label}</span>
						<span className="text-[13px] text-[#4E4E4E] font-medium leading-tight line-clamp-1" title={String(value)}>
							{value}
						</span>
					</div>
				</div>,
			);
		}

		return items;
	}, [specs]);
	if (gridItems.length === 0) return null;

	return <div className={`grid grid-cols-3 gap-[16px] ${className}`}>{gridItems}</div>;
};

export default SpecsGrid;
