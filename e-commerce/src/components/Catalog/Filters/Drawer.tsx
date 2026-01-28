"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { MobileFilterContext } from "~/contexts/MobileFilterContext";

const SORT_OPTIONS = [
	{ value: "rating", label: "By Rating" },
	{ value: "newest", label: "Newest Arrivals" },
	{ value: "price_asc", label: "Price: Low to High" },
	{ value: "price_desc", label: "Price: High to Low" },
];

interface FilterDrawerProps {
	children: React.ReactNode;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const [tempSort, setTempSort] = useState("rating");
	const [tempFilters, setTempFilters] = useState<Record<string, string[]>>({});

	useEffect(() => {
		if (isOpen) {
			setTempSort(searchParams.get("sort") || "rating");
		}
	}, [isOpen, searchParams]);

	const toggleTempFilter = (categoryId: string, optionName: string) => {
		setTempFilters(prev => {
			const currentOptions = prev[categoryId] || [];
			if (currentOptions.includes(optionName)) {
				return { ...prev, [categoryId]: currentOptions.filter(o => o !== optionName) };
			} else {
				return { ...prev, [categoryId]: [...currentOptions, optionName] };
			}
		});
	};

	const handleApply = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("sort", tempSort);
		Object.entries(tempFilters).forEach(([key, values]) => {
			if (values.length > 0) {
				params.set(key, values.join(","));
			} else {
				params.delete(key);
			}
		});
		router.push(`?${params.toString()}`, { scroll: false });
		setIsOpen(false);
	};

	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "unset";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	return (
		<MobileFilterContext.Provider value={{ isMobileDrawerOpen: isOpen, tempFilters, setTempFilters, toggleTempFilter }}>
			<div className="md:hidden w-full mb-4 sticky top-[60px] z-30">
				<button
					onClick={() => setIsOpen(true)}
					className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-lg shadow-md text-sm font-medium hover:bg-gray-800 transition-colors"
				>
					<FilterListIcon fontSize="small" />
					Filter & Sort
				</button>
			</div>

			{isOpen && (
				<div className="fixed inset-0 z-40 bg-black/50 md:hidden animate-fade-in" onClick={() => setIsOpen(false)} />
			)}

			<aside
				className={`
          fixed top-0 left-0 z-50 h-full w-[85%] max-w-[320px] bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out p-5
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:static md:translate-x-0 md:h-auto md:w-full md:shadow-none md:bg-transparent md:p-0 md:overflow-visible md:block
        `}
			>
				<div className="flex justify-between items-center mb-6 md:hidden border-b pb-4">
					<span className="text-lg font-bold uppercase tracking-wide">Filters</span>
					<button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-gray-500">
						<CloseIcon />
					</button>
				</div>

				<div className="flex flex-col gap-6">
					<div className="md:hidden">
						<h3 className="font-bold text-base mb-3 text-black">Sort By</h3>
						<div className="flex flex-col gap-3">
							{SORT_OPTIONS.map(opt => {
								const isSelected = tempSort === opt.value;
								return (
									<div
										key={opt.value}
										onClick={() => setTempSort(opt.value)}
										className="flex items-center gap-3 cursor-pointer py-1"
									>
										{isSelected ? (
											<RadioButtonCheckedIcon className="text-black" fontSize="small" />
										) : (
											<RadioButtonUncheckedIcon className="text-gray-400" fontSize="small" />
										)}
										<span className={`text-sm ${isSelected ? "font-bold text-black" : "text-gray-600"}`}>
											{opt.label}
										</span>
									</div>
								);
							})}
						</div>
						<hr className="my-5 border-gray-200" />
					</div>

					<div className="flex flex-col gap-2">{children}</div>
				</div>

				<div className="mt-8 md:hidden pb-10">
					<button onClick={handleApply} className="w-full bg-black text-white py-3 rounded-lg font-medium">
						View Results
					</button>
				</div>
			</aside>
		</MobileFilterContext.Provider>
	);
};

export default FilterDrawer;
