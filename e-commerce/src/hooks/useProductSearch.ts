import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { productService } from "~/services/product";
import { Product } from "~/types/product";
import { routerPaths, router as appRouter } from "~/utils/router";

export const useProductSearch = (scope: "global" | "category", categoryId?: number | null) => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const searchCache = useRef<Record<string, Product[]>>({});

	const fetchProducts = async (term: string) => {
		const cacheKey = scope === "category" ? `${term}_cat_${categoryId}` : `global_${term}`;

		if (searchCache.current[cacheKey]) {
			setProducts(searchCache.current[cacheKey]);
			setIsLoading(false);
			return;
		}

		try {
			const params: any = term ? { name: term } : {};
			if (scope === "category" && categoryId) {
				params.categoryId = categoryId;
			}
			const response = await productService.getAll(params);
			let list = Array.isArray(response) ? response : [];
			if (term) {
				const lowerTerm = term.toLowerCase();
				list = list.filter(product => product.name.toLowerCase().includes(lowerTerm));
			}
			if (scope === "category" && categoryId) {
				list = list.filter(product => String(product.categoryId) === String(categoryId));
			}
			const finalResult = list.slice(0, 5);
			searchCache.current[cacheKey] = finalResult;
			setProducts(finalResult);
		} catch (error) {
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
		if (scope === "category" && !searchTerm) {
			setIsOpen(false);
			setProducts([]);
			setIsLoading(false);
			return;
		}
		if (!searchTerm) {
			fetchProducts("");
			return;
		}

		const cacheKey = scope === "category" ? `${searchTerm}_cat_${categoryId}` : `global_${searchTerm}`;
		if (searchCache.current[cacheKey]) {
			setProducts(searchCache.current[cacheKey]);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		const timeoutId = setTimeout(() => {
			fetchProducts(searchTerm);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchTerm, isOpen, scope, categoryId]);

	const handleFocus = () => {
		if (scope === "global") {
			setIsOpen(true);
		} else if (scope === "category" && searchTerm) {
			setIsOpen(true);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setSearchTerm(val);

		if (scope === "global") {
			setIsOpen(true);
		} else {
			if (val) setIsOpen(true);
			else setIsOpen(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			setIsOpen(false);

			const query: any = {};
			if (searchTerm.trim()) query.name = searchTerm;

			if (scope === "category" && categoryId) {
				query.categoryId = categoryId;
			}

			const queryString = new URLSearchParams(query as any).toString();
			router.push(`${routerPaths.productDetail}?${queryString}`);
			setSearchTerm("");
		}
	};

	const handleProductClick = (id: number) => {
		setIsOpen(false);
		router.push(appRouter.product(id));
		setSearchTerm("");
	};

	const handleViewMore = () => {
		setIsOpen(false);

		const query: any = {};
		if (searchTerm.trim()) query.name = searchTerm;
		if (scope === "category" && categoryId) {
			query.categoryId = categoryId;
		}

		const queryString = new URLSearchParams(query as any).toString();
		router.push(`${routerPaths.productDetail}?${queryString}`);
		setSearchTerm("");
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
