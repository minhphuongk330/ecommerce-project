import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { productService } from "~/services/product";
import { Product } from "~/types/product";
import { productCache } from "~/utils/lruCache";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "newest";
  const categoryId = searchParams.get("categoryId");
  const name = searchParams.get("name");
  const page = searchParams.get("page") || "1";

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        sort,
        categoryId: categoryId ? Number(categoryId) : undefined,
        name: name || undefined,
        page: Number(page),
        limit: 9,
      };

      const cacheKey = `products_${JSON.stringify(params)}`;
      const cached = productCache.get(cacheKey);
      
      if (cached && cached.items) {
        setProducts(cached.items);
        setTotalCount(cached.total);
        setIsLoading(false);
        return;
      }

      const response = await productService.getAll(params);

      productCache.set(cacheKey, response);
      setProducts(response.items);
      setTotalCount(response.total);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sort, categoryId, name, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, totalCount, isLoading };
};