"use client";
import MuiSlider from "@mui/material/Slider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "~/components/atoms/Button";
import { formatPrice } from "~/utils/format";
import FiltersAccordion from "./Accordion";

interface PriceRangeFilterProps {
	minPrice: number;
	maxPrice: number;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ minPrice, maxPrice }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Ensure we have valid numbers (fallback if API hasn't loaded yet)
	const safeMin = Math.max(0, Number(minPrice) || 0);
	const safeMax = Math.max(safeMin + 1000000, Number(maxPrice) || 100000000);

	const urlMin = searchParams.get("minPrice");
	const urlMax = searchParams.get("maxPrice");

	// Use URL values if present, otherwise use the dynamic range
	const initMin = urlMin ? Number(urlMin) : safeMin;
	const initMax = urlMax ? Number(urlMax) : safeMax;

	const [sliderValues, setSliderValues] = useState<[number, number]>([initMin, initMax]);
	const [focusedMin, setFocusedMin] = useState(false);
	const [focusedMax, setFocusedMax] = useState(false);
	const [inputMin, setInputMin] = useState(String(initMin));
	const [inputMax, setInputMax] = useState(String(initMax));

	// Reset slider when min/max price range changes (e.g., when category changes)
	useEffect(() => {
		const urlMinPrice = searchParams.get("minPrice");
		const urlMaxPrice = searchParams.get("maxPrice");

		if (urlMinPrice || urlMaxPrice) {
			// User has set filters, respect them but clamp to valid range
			const min = Math.max(safeMin, Number(urlMinPrice) || safeMin);
			const max = Math.min(safeMax, Number(urlMaxPrice) || safeMax);
			setSliderValues([min, max]);
			setInputMin(String(min));
			setInputMax(String(max));
		} else {
			// No URL filters, reset to full range
			setSliderValues([safeMin, safeMax]);
			setInputMin(String(safeMin));
			setInputMax(String(safeMax));
		}
	}, [searchParams, safeMin, safeMax]);

	const handleSliderChange = (_: Event, value: number | number[]) => {
		const [min, max] = value as number[];
		setSliderValues([min, max]);
		setInputMin(String(min));
		setInputMax(String(max));
	};

	const handleMinBlur = () => {
		const val = Math.max(safeMin, Math.min(Number(inputMin) || safeMin, sliderValues[1] - 100000));
		setSliderValues([val, sliderValues[1]]);
		setInputMin(String(val));
		setFocusedMin(false);
	};

	const handleMaxBlur = () => {
		const val = Math.min(safeMax, Math.max(Number(inputMax) || safeMax, sliderValues[0] + 100000));
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
						min={safeMin}
						max={safeMax}
						step={500000}
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
