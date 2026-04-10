"use client";
import { useEffect, useState } from "react";
import ProductCard from "~/components/Products/Card";
import { productService } from "~/services/product";
import { Product } from "~/types/product";

export default function YouMayAlsoLike() {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		productService
			.getByCollection("Bestseller")
			.then(data => setProducts(data.slice(0, 4)))
			.catch(() => setProducts([]))
			.finally(() => setIsLoading(false));
	}, []);

	if (isLoading || products.length === 0) return null;

	return (
		<div className="w-full">
			<h2 className="text-lg md:text-[24px] font-medium text-black mb-6">You may also like</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-[16px]">
				{products.map(product => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
}
