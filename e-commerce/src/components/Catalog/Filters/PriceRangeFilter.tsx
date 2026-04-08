"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import MuiSlider from "@mui/material/Slider";
import FiltersAccordion from "./Accordion";
import Button from "~/components/atoms/Button";
import { formatPrice } from "~/utils/format";

interface PriceRangeFilterProps {
	minPrice: number;
	maxPrice: number;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ minPrice, maxPrice }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const initMin = Number(searchParams.get("minPrice") ?? minPrice);
	const initMax = Number(searchParams.get("maxPrice") ?? maxPrice);
	const [sliderValues, setSliderValues] = useState<[number, number]>([initMin, initMax]);
	const [focusedMin, setFocusedMin] = useState(false);
	const [focusedMax, setFocusedMax] = useState(false);
	const [inputMin, setInputMin] = useState(String(initMin));
	const [inputMax, setInputMax] = useState(String(initMax));

	useEffect(() => {
		const min = Number(searchParams.get("minPrice") ?? minPrice);
		const max = Number(searchParams.get("maxPrice") ?? maxPrice);
		setSliderValues([min, max]);
		setInputMin(String(min));
		setInputMax(String(max));
	}, [searchParams, minPrice, maxPrice]);

	const handleSliderChange = (_: Event, value: number | number[]) => {
		const [min, max] = value as number[];
		setSliderValues([min, max]);
		setInputMin(String(min));
		setInputMax(String(max));
	};

	const handleMinBlur = () => {
		const val = Math.max(minPrice, Math.min(Number(inputMin) || minPrice, sliderValues[1] - 1));
		setSliderValues([val, sliderValues[1]]);
		setInputMin(String(val));
		setFocusedMin(false);
	};

	const handleMaxBlur = () => {
		const val = Math.min(maxPrice, Math.max(Number(inputMax) || maxPrice, sliderValues[0] + 1));
		setSliderValues([sliderValues[0], val]);
		setInputMax(String(val));
		setFocusedMax(false);
	};

	const handleApply = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("minPrice", String(sliderValues[0]));
		params.set("maxPrice", String(sliderValues[1]));
		params.delete("page");
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	return (
		<FiltersAccordion title="Price Range" defaultOpen={true}>
			<div className="flex flex-col gap-4 px-1">
				<div className="mx-3">
					<MuiSlider
						value={sliderValues}
						onChange={handleSliderChange}
						min={minPrice}
						max={maxPrice}
						disableSwap
						sx={{
							color: "#000",
							width: "calc(100% - 16px)",
							mx: "8px",
							"& .MuiSlider-thumb": {
								width: 18,
								height: 18,
								backgroundColor: "#000",
								"&:hover, &.Mui-focusVisible": { boxShadow: "0 0 0 6px rgba(0,0,0,0.1)" },
							},
							"& .MuiSlider-track": { backgroundColor: "#000", border: "none" },
							"& .MuiSlider-rail": { backgroundColor: "#e5e7eb" },
						}}
					/>
				</div>

				<div className="flex items-center gap-2">
					<input
						type={focusedMin ? "number" : "text"}
						value={focusedMin ? inputMin : formatPrice(Number(inputMin))}
						onChange={e => setInputMin(e.target.value)}
						onFocus={() => setFocusedMin(true)}
						onBlur={handleMinBlur}
						className="min-w-0 flex-1 border border-gray-300 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-black"
					/>
					<span className="text-gray-400 text-xs flex-shrink-0">—</span>
					<input
						type={focusedMax ? "number" : "text"}
						value={focusedMax ? inputMax : formatPrice(Number(inputMax))}
						onChange={e => setInputMax(e.target.value)}
						onFocus={() => setFocusedMax(true)}
						onBlur={handleMaxBlur}
						className="min-w-0 flex-1 border border-gray-300 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-black"
					/>
				</div>

				<Button onClick={handleApply} theme="dark" variant="solid" className="!w-full !rounded-lg !h-10">
					Apply
				</Button>
			</div>
		</FiltersAccordion>
	);
};

export default PriceRangeFilter;
