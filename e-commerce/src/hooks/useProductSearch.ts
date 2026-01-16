import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { productService } from "~/services/product";
import { Product } from "~/types/product";
import { routerPaths, router as appRouter } from "~/utils/router";

export const useProductSearch = () => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const searchCache = useRef<Record<string, Product[]>>({});

	const fetchProducts = async (term: string) => {
		if (searchCache.current[term]) {
			setProducts(searchCache.current[term]);
			setIsLoading(false);
			return;
		}

		try {
			const params = term ? { name: term } : {};
			const response = await productService.getAll(params);
			let list = Array.isArray(response) ? response : [];
			if (term) {
				const lowerTerm = term.toLowerCase();
				list = list.filter(product => product.name.toLowerCase().includes(lowerTerm));
			}
			const finalResult = list.slice(0, 5);
			searchCache.current[term] = finalResult;
			setProducts(finalResult);
		} catch (error) {
			console.error("Search error:", error);
			setProducts([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (!isOpen) return;
		if (!searchTerm) {
			fetchProducts("");
			return;
		}
		if (searchCache.current[searchTerm]) {
			setProducts(searchCache.current[searchTerm]);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		const timeoutId = setTimeout(() => {
			fetchProducts(searchTerm);
		}, 500);
		return () => clearTimeout(timeoutId);
	}, [searchTerm, isOpen]);
	const handleFocus = () => setIsOpen(true);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			setIsOpen(false);
			if (searchTerm.trim()) {
				router.push(`${routerPaths.productDetail}?name=${encodeURIComponent(searchTerm)}`);
			} else {
				router.push(routerPaths.productDetail);
			}
		}
	};

	const handleProductClick = (id: number) => {
		setIsOpen(false);
		router.push(appRouter.product(id));
	};

	const handleViewMore = () => {
		setIsOpen(false);
		router.push(routerPaths.productDetail);
	};

	return {
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
	};
};
