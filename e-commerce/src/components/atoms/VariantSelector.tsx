import React from "react";

interface Variant {
  id: number | string;
  sku?: string;
  [key: string]: any;
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedSku: string;
  onSelect: (variant: Variant) => void;
  className?: string;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({ variants, selectedSku, onSelect, className }) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className={`flex flex-col gap-3 mb-6 ${className || ""}`}>
      <span className="text-sm font-medium text-gray-900">
        Select Version: <span className="text-gray-500 font-normal">{selectedSku}</span>
      </span>
      <div className="flex flex-wrap gap-3">
        {variants.map((v) => {
          const isSelected = selectedSku === v.sku;
          return (
            <button
              key={v.id}
              onClick={() => onSelect(v)}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                ${
                  isSelected
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-black hover:bg-gray-50"
                }
              `}
            >
              {v.sku || "Standard"}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;