"use client";
import Link from "next/link";
import ProductCard from "~/components/Products/Card";
import Button from "~/components/atoms/Button";
import { useFavoriteStore } from "~/stores/useFavorite";
import { useFromStore } from "~/hooks/useFromStore";
import { routerPaths } from "~/utils/router";

export default function FavoritesPage() {
	const favorites = useFromStore(useFavoriteStore, state => state.favorites);
	const isEmpty = !favorites?.length;

	return (
		<div className="w-full bg-white">
			<div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8 md:py-[80px]">
				<h1 className="text-2xl md:text-3xl font-bold text-black mb-6 md:mb-8">Favorites</h1>

				{isEmpty ? (
					<div className="flex flex-col items-center justify-center py-12 md:py-20 text-center px-4">
						<h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
						<p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 max-w-md">You haven't added any items to your favorites yet.</p>
						<Link href={routerPaths.index}>
							<Button theme="dark" className="!px-6 md:!px-8 !py-2.5 md:!py-3 !rounded-lg !bg-black !text-white">
								Start Shopping
							</Button>
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[16px] w-full">
						{favorites.map(item => (
							<div key={item.id} className="h-full">
								<ProductCard product={item.product} />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
