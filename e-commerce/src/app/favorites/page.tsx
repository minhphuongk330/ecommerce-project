"use client";
import ProductCard from "~/components/Products/Card";
import EmptyState from "~/components/atoms/EmptyState";
import { useFavoriteStore } from "~/stores/useFavorite";
import { useFromStore } from "~/hooks/useFromStore";

export default function FavoritesPage() {
  const favorites = useFromStore(useFavoriteStore, state => state.favorites);
  const isEmpty = !favorites?.length;

  return (
    <div className="w-full bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[160px] py-8 md:py-[40px]">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-6 md:mb-8">Favorites</h1>

        {isEmpty ? (
          <EmptyState title="Your wishlist is empty" description="You haven't added any items to your favorites yet." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[16px] w-full">
            {favorites?.map(item => {
              const displayProduct = {
                ...item.product,
                price: item.variant ? item.variant.price : item.product.price,
                mainImageUrl: (item.variant && item.variant.imageUrl) 
                  ? item.variant.imageUrl 
                  : item.product.mainImageUrl,
              };

              return (
                <div key={item.id} className="h-full">
                  <ProductCard 
                    product={displayProduct} 
                    preselectedSku={item.variant?.sku} 
                  />
                  {item.variant && (
                    <div className="mt-2 text-xs text-gray-500 font-medium px-1">
                      Phân loại: {item.variant.sku}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}