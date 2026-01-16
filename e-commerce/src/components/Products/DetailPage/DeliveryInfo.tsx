"use client";
import React from "react";
import { LocalShippingOutlined, StorefrontOutlined, VerifiedUserOutlined } from "@mui/icons-material";
import { DeliveryInfoProps } from "~/types/component";

const Item = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => (
	<div className="flex items-center gap-[16px]">
		<div className="w-[56px] h-[56px] bg-[#F4F4F4] rounded-[10px] flex items-center justify-center">{icon}</div>
		<div className="flex flex-col">
			<span className="text-sm text-[#717171]">{title}</span>
			<span className="text-sm font-medium text-black">{sub}</span>
		</div>
	</div>
);

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ className = "" }) => {
	return (
		<div className={`flex gap-[32px] ${className}`}>
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
