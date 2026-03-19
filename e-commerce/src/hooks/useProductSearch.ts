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
      return;
    }

    try {
      setIsLoading(true);
      const params: any = { name: term, limit: 5 };
      if (scope === "category" && categoryId) params.categoryId = categoryId;

      const response = await productService.getAll(params);
      const data = response.items; // Lấy đúng mảng items từ object BE trả về

      searchCache.current[cacheKey] = data;
      setProducts(data);
    } catch (error) {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !searchTerm) return;
    const timeoutId = setTimeout(() => fetchProducts(searchTerm), 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, isOpen, scope, categoryId]);

  return {
    searchTerm, isOpen, products, isLoading, wrapperRef,
    handleChange: (e: any) => { setSearchTerm(e.target.value); setIsOpen(true); },
    handleFocus: () => setIsOpen(true),
    handleProductClick: (id: number) => { setIsOpen(false); router.push(appRouter.product(id)); },
    handleKeyDown: (e: any) => {
      if (e.key === "Enter") {
        setIsOpen(false);
        const query: any = { name: searchTerm };
        if (scope === "category" && categoryId) query.categoryId = categoryId;
        router.push(`${routerPaths.productDetail}?${new URLSearchParams(query).toString()}`);
      }
    },
    handleViewMore: () => { /* tương tự enter */ }
  };
};