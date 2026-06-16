import { useEffect, useState } from "react";
import { flashSaleService } from "~/services/flashSale";
import { FlashSaleItem } from "~/types/flashSale";
import { Product } from "~/types/product";

export interface FlashSaleItemData {
	flashSalePrice: number;
	flashSaleOriginalPrice: number;
	quantity: number;
	soldQuantity: number;
}


let cachedMap: Map<number, FlashSaleItemData> | null = null;
let fetchPromise: Promise<Map<number, FlashSaleItemData>> | null = null;

const buildMap = (items: FlashSaleItem[]): Map<number, FlashSaleItemData> => {
	const map = new Map<number, FlashSaleItemData>();
	for (const item of items) {
		map.set(Number(item.productId), {
			flashSalePrice: Number(item.salePrice),
			flashSaleOriginalPrice: Number(item.originalPrice),
			quantity: Number(item.quantity),
			soldQuantity: Number(item.soldQuantity),
		});
	}
	return map;
};

const getFlashSaleMap = async (): Promise<Map<number, FlashSaleItemData>> => {
	if (cachedMap !== null) return cachedMap;
	if (fetchPromise) return fetchPromise;

	fetchPromise = flashSaleService.getActive().then((sale) => {
		const map = sale ? buildMap(sale.items || []) : new Map<number, FlashSaleItemData>();
		cachedMap = map;
		fetchPromise = null;
		return map;
	}).catch(() => {
		fetchPromise = null;
		return new Map<number, FlashSaleItemData>();
	});

	return fetchPromise;
};

/** Gắn thêm flash sale fields vào danh sách sản phẩm */
export const enrichWithFlashSale = <T extends { id: number | string }>(
	products: T[],
	map: Map<number, FlashSaleItemData>,
): T[] => {
	if (map.size === 0) return products;
	return products.map((p) => {
		const data = map.get(Number(p.id));
		if (!data) return p;

		const isSoldOut = data.soldQuantity >= data.quantity;

		if (isSoldOut && !(p as any).isFlashSale) {
			return p;
		}

		return {
			...p,
			isFlashSale: true,
			flashSalePrice: data.flashSalePrice,
			flashSaleOriginalPrice: data.flashSaleOriginalPrice,
			quantity: data.quantity,
			soldQuantity: data.soldQuantity,
		};
	});
};

/** Hook trả về flash sale map, empty map khi đang load */
export const useFlashSaleMap = (): Map<number, FlashSaleItemData> => {
	const [map, setMap] = useState<Map<number, FlashSaleItemData>>(
		cachedMap ?? new Map(),
	);

	useEffect(() => {
		if (cachedMap !== null) {
			setMap(cachedMap);
			return;
		}
		getFlashSaleMap().then(setMap);
	}, []);

	return map;
};
