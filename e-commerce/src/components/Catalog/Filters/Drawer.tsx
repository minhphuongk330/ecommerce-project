"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import { useMobileFilter } from "~/contexts/MobileFilterContext";

const FilterDrawer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { isMobileDrawerOpen, setIsMobileDrawerOpen, tempFilters } = useMobileFilter();

	useEffect(() => {
		document.body.style.overflow = isMobileDrawerOpen ? "hidden" : "unset";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isMobileDrawerOpen]);

	const handleApply = () => {
		const params = new URLSearchParams(searchParams.toString());

		Object.entries(tempFilters).forEach(([key, values]) => {
			if (values.length > 0) {
				params.set(key, values.join(","));
			} else {
				params.delete(key);
			}
		});

		router.push(`?${params.toString()}`, { scroll: false });
		setIsMobileDrawerOpen(false);
	};

	return (
		<>
			{isMobileDrawerOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 md:hidden animate-fade-in"
					onClick={() => setIsMobileDrawerOpen(false)}
				/>
			)}

			<aside
				className={`
          fixed top-0 left-0 z-50 h-full w-[85%] max-w-[320px] bg-white shadow-2xl 
          transition-transform duration-300 ease-in-out flex flex-col
          ${isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"} 
          md:static md:translate-x-0 md:h-auto md:w-full md:shadow-none md:bg-transparent md:block
        `}
			>
				<div className="flex justify-between items-center p-5 border-b md:hidden shrink-0">
					<span className="text-lg font-bold uppercase tracking-wide">Filters</span>
					<button onClick={() => setIsMobileDrawerOpen(false)} className="p-2 -mr-2 text-gray-500">
						<CloseIcon />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-5 md:p-0">
					<div className="flex flex-col gap-2">{children}</div>
				</div>

				<div className="p-5 border-t md:hidden shrink-0 bg-white">
					<button
						onClick={handleApply}
						className="w-full bg-black text-white py-3 rounded-lg font-medium active:scale-95 transition-transform"
					>
						View Results
					</button>
				</div>
			</aside>
		</>
	);
};

export default FilterDrawer;
