"use client";
import { useMemo } from "react";
import { ShippingMethod } from "~/types/shipping";
import ShippingListItem from "./Item";  

interface ShippingListProps {
  methods: ShippingMethod[];
  selectedMethodId: string;
  onSelectMethod: (id: string) => void;
  scheduledDate: string;
  onDateChange: (date: string) => void;
}

export default function ShippingList({
  methods,
  selectedMethodId,
  onSelectMethod,
  scheduledDate,
  onDateChange,
}: ShippingListProps) {
  
  
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  return (
    <div className="flex flex-col gap-4 md:gap-[32px] w-full">
      {methods.map((method) => (
        <ShippingListItem
          key={method.id}
          method={method}
          isSelected={selectedMethodId === method.id}
          onSelectMethod={() => onSelectMethod(method.id)}
          scheduledDate={scheduledDate}
          onDateChange={onDateChange}
          minDate={minDate}  
        />
      ))}
    </div>
  );
}