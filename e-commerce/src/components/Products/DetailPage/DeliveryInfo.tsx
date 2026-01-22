"use client";
import React from "react";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";

import { DeliveryInfoProps } from "~/types/component";

const Item = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => (
	<div className="flex flex-col items-center text-center gap-3 md:flex-row md:text-left md:gap-[16px] flex-1">
		<div className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] bg-[#F4F4F4] rounded-[10px] flex items-center justify-center flex-shrink-0">
			{icon}
		</div>
		<div className="flex flex-col">
			<span className="text-sm text-[#717171] whitespace-nowrap md:whitespace-normal">{title}</span>
			<span className="text-base font-medium text-black md:text-sm">{sub}</span>
		</div>
	</div>
);

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ className = "" }) => {
	return (
		<div className={`flex flex-row justify-between gap-2 md:justify-start md:gap-[32px] ${className} w-full`}>
			<Item
				icon={<LocalShippingOutlined className="!text-[24px] text-gray-500" />}
				title="Free Delivery"
				sub="1-2 day"
			/>
			<Item icon={<StorefrontOutlined className="!text-[24px] text-gray-500" />} title="In Stock" sub="Today" />
			<Item icon={<VerifiedUserOutlined className="!text-[24px] text-gray-500" />} title="Guaranteed" sub="1 year" />
		</div>
	);
};

export default DeliveryInfo;
