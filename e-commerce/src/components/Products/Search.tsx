"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import SearchField from "~/components/atoms/SearchField";
import Dropdown, { DropdownOption } from "~/components/atoms/Dropdown";
import CommonButton from "~/components/atoms/Button";
import { useProductSearch } from "~/hooks/useProductSearch";
import { formatPrice } from "~/utils/format";
import { categoryService } from "~/services/category";
import { Category } from "~/types/category";

const useActiveCategory = () => {
	const searchParams = useSearchParams();
	const categoryIdParam = searchParams.get("categoryId");
	const [category, setCategory] = useState<Category | null>(null);

	useEffect(() => {
		const fetchCategoryName = async () => {
			if (!categoryIdParam) {
				setCategory(null);
				return;
			}
			try {
				const categories = await categoryService.getCategories();
				const found = categories.find(c => String(c.id) == String(categoryIdParam));
				if (found) {
					setCategory(found);
				} else {
					setCategory({ id: Number(categoryIdParam), name: "Category", thumbnailUrl: "" } as Category);
				}
			} catch (error) {
				setCategory({ id: Number(categoryIdParam), name: "Category", thumbnailUrl: "" } as Category);
			}
		};
		fetchCategoryName();
	}, [categoryIdParam]);

	return category;
};

type SearchScope = "global" | "category";

const ProductSearch = () => {
	const activeCategory = useActiveCategory();
	const [scope, setScope] = useState<SearchScope>("global");

	useEffect(() => {
		setScope(activeCategory ? "category" : "global");
	}, [activeCategory]);

	const {
		searchTerm,
		isOpen,
		products,
		isLoading,
		wrapperRef,
		handleFocus,
		handleChange,
		handleKeyDown,
		handleProductClick,
		handleViewMore,
	} = useProductSearch(scope, activeCategory?.id);

	const dropdownOptions: DropdownOption[] = [{ value: "global", label: "In Cyber" }];

	if (activeCategory) {
		dropdownOptions.unshift({
			value: "category",
			label: `In ${activeCategory.name}`,
		});
	}

	return (
		<div ref={wrapperRef} className="relative w-full max-w-full md:max-w-[400px]">
			<div className="flex items-center w-full bg-[#F5F5F5] rounded-[10px] h-[40px] md:h-[48px] overflow-hidden">
				<div className="flex-1 h-full min-w-0" onFocus={handleFocus}>
					<SearchField
						value={searchTerm}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						placeholder={
							scope === "category" && activeCategory ? `Search in ${activeCategory.name}` : "Search for products..."
						}
						className="w-full h-full"
						sx={{
							"& .MuiOutlinedInput-root": {
								bgcolor: "transparent !important",
								borderRadius: "0 !important",
								height: "100%",
								"& fieldset": { border: "none !important" },
							},
						}}
					/>
				</div>

				{activeCategory && <div className="h-[24px] border-l border-gray-300 mx-1 flex-shrink-0 hidden md:block"></div>}

				{activeCategory && (
					<div className="h-full relative flex-shrink-0 z-20 hidden md:block">
						<Dropdown
							value={scope}
							options={dropdownOptions}
							onChange={val => setScope(val as SearchScope)}
							className="!w-[140px] !h-full [&>select]:!border-none [&>select]:!rounded-none [&>select]:!bg-transparent [&>select]:!text-sm [&>select]:!text-gray-600 [&>select]:!font-normal [&>select]:!pr-8 [&>select]:!h-full [&>select]:!py-0"
						/>
					</div>
				)}
			</div>

			{isOpen && (
				<div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[9999] flex flex-col max-h-[60vh]">
					<div className="px-3 md:px-4 py-2.5 md:py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
							{searchTerm ? "Search Results" : "Newest Products"}
						</span>
					</div>

					<div className="flex-1 overflow-y-auto relative">
						{isLoading ? (
							<div className="flex flex-col items-center justify-center p-6 text-gray-400 gap-3 min-h-[200px]">
								<div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
							</div>
						) : products.length > 0 ? (
							<div>
								{products.map(product => (
									<div
										key={product.id}
										onClick={() => handleProductClick(product.id)}
										className="flex items-center gap-2.5 md:gap-3 p-2.5 md:p-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
									>
										<div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100">
											<Image
												src={product.mainImageUrl || "/placeholder.png"}
												alt={product.name}
												fill
												sizes="(max-width: 768px) 40px, 48px"
												className="object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
											<p className="text-xs text-gray-500 mt-0.5">{formatPrice(product.price)}</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="p-6 text-center text-gray-400 text-sm min-h-[200px] flex items-center justify-center">
								<p>No products found.</p>
							</div>
						)}
					</div>

					<div className="p-2.5 md:p-3 border-t border-gray-100 bg-white flex-shrink-0">
						<CommonButton
							theme="dark"
							variant="solid"
							onClick={handleViewMore}
							className="w-full !h-9 md:!h-10 !text-xs md:!text-sm !rounded-lg"
						>
							View All Products
						</CommonButton>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductSearch;
