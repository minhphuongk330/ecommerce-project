"use client";
import SearchField from "~/components/atoms/SearchField";
import CommonButton from "~/components/atoms/Button";
import { useProductSearch } from "~/hooks/useProductSearch";
import { formatPrice } from "~/utils/format";

const ProductSearch = () => {
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
	} = useProductSearch();

	return (
		<div ref={wrapperRef} className="relative w-full max-w-full md:max-w-[400px]">
			<div onClick={handleFocus} onFocus={handleFocus} onKeyDown={handleKeyDown}>
				<SearchField value={searchTerm} onChange={handleChange} className="w-full" />
			</div>
			{isOpen && (
				<div className="absolute top-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[9999] flex flex-col w-[calc(100vw-1.5rem)] md:w-full md:max-w-[400px] max-h-[60vh]">
					<div className="px-3 md:px-4 py-2.5 md:py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
						<span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
							{searchTerm ? "Search Results" : "Newest Products"}
						</span>
					</div>
					<div className="flex-1 overflow-y-auto relative">
						{isLoading ? (
							<div
								className={`${
									products.length > 0 ? "absolute inset-0" : ""
								} bg-white z-10 flex flex-col items-center justify-center p-6 text-gray-400 gap-3 min-h-[200px]`}
							>
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
										<div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100">
											<img
												src={product.mainImageUrl || "/placeholder.png"}
												alt={product.name}
												className="w-full h-full object-cover"
												onError={e => {
													(e.target as HTMLImageElement).src = "/placeholder.png";
												}}
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
