"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { OrderSummaryProps } from "~/types/cart";
import { Button } from "@mui/material";
import { routerPaths } from "~/utils/router";

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, tax, shipping, total }) => {
	const router = useRouter();

	return (
		<div className="w-full md:w-[536px] h-fit border border-[#EBEBEB] rounded-[10px] pt-6 md:pt-[56px] px-4 md:px-[64px] pb-6 md:pb-[56px] flex flex-col gap-6 md:gap-[40px] bg-white">
			<h2 className="text-lg md:text-[20px] font-medium text-black">Order Summary</h2>

			<div className="flex flex-col gap-3 md:gap-4 w-full">
				<div className="flex justify-between items-center text-black">
					<span className="text-sm md:text-base font-medium">Subtotal</span>
					<span className="text-sm md:text-base font-medium">${subtotal}</span>
				</div>

				<div className="flex justify-between items-center text-[#545454]">
					<span className="text-sm md:text-base font-normal">Estimated Tax</span>
					<span className="text-sm md:text-base font-medium">${tax}</span>
				</div>

				<div className="flex justify-between items-center text-[#545454]">
					<span className="text-sm md:text-base font-normal">Estimated shipping & Handling</span>
					<span className="text-sm md:text-base font-medium">${shipping}</span>
				</div>

				<div className="flex justify-between items-center text-black mt-2">
					<span className="text-sm md:text-base font-medium">Total</span>
					<span className="text-sm md:text-base font-bold">${total}</span>
				</div>
			</div>

			<Button
				variant="contained"
				onClick={() => router.push(routerPaths.address)}
				disabled={!subtotal}
				className="!w-full !h-12 md:!h-[56px] !rounded-[6px] !text-sm md:!text-base !bg-black !text-white !hover:bg-[#333] disabled:!bg-gray-300 disabled:!text-gray-500"
			>
				Checkout
			</Button>
		</div>
	);
};

export default OrderSummary;
