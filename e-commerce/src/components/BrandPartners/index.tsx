"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Đảm bảo bạn đã cài axios hoặc dùng fetch

interface Brand {
  id: number;
  name: string;
  logoUrl: string; // Lấy từ cột logoUrl trong DB
}

const BrandPartners: React.FC = () => {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Lấy dữ liệu Brand từ Backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:3001/brands"); // Link API của bạn
        setBrands(response.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách brand:", error);
      }
    };
    fetchBrands();
  }, []);

  const handleBrandClick = (brandId: number) => {
    router.push(`/products?brandId=${brandId}`);
  };

  const TOP_BRANDS_COUNT = 12;
  const displayedBrands = showAll ? brands : brands.slice(0, TOP_BRANDS_COUNT);

  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[160px]">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Thương hiệu đối tác</h2>
          <p className="text-gray-600 text-lg">Hợp tác với các công ty công nghệ hàng đầu</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {displayedBrands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand.id)}
              className="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <div className="w-20 h-20 flex items-center justify-center mb-3">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `<span class="text-xl font-bold text-gray-400">${brand.name[0]}</span>`;
                    }}
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-400">{brand.name[0]}</span>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">{brand.name}</span>
            </div>
          ))}
        </div>

        {brands.length > TOP_BRANDS_COUNT && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              {showAll ? "Thu gọn ↑" : "Xem tất cả →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPartners;