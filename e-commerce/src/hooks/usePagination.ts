import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface UseUrlPaginationReturn {
	currentPage: number;
	totalPages: number;
	handlePageChange: (page: number) => void;
}

/**
 * Hook phân trang dựa trên URL query string (?page=N).
 * Phù hợp cho các trang cần người dùng có thể bookmark hoặc chia sẻ đường dẫn.
 *
 * @param totalItems - Tổng số mục cần phân trang.
 * @param itemsPerPage - Số mục hiển thị trên mỗi trang.
 */
export function useUrlPagination(totalItems: number, itemsPerPage: number): UseUrlPaginationReturn {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const rawPage = parseInt(searchParams.get("page") ?? "", 10);
	const currentPage = Number.isNaN(rawPage) ? 1 : Math.max(1, rawPage);
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const handlePageChange = useCallback(
		(page: number) => {
			const params = new URLSearchParams(searchParams.toString());
			if (page > 1) params.set("page", page.toString());
			else params.delete("page");
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
			window.scrollTo({ top: 0, behavior: "smooth" });
		},
		[router, pathname, searchParams],
	);

	return { currentPage, totalPages, handlePageChange };
}

/**
 * Hàm tiện ích: Cắt mảng lấy đúng trang hiện tại.
 * Dùng kết hợp cùng useUrlPagination hoặc useClientPagination.
 */
export function paginateItems<T>(items: T[], currentPage: number, itemsPerPage: number): T[] {
	return items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
}

interface UseClientPaginationReturn {
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
}

/**
 * Hook phân trang dựa trên React state (client-side).
 * Phù hợp cho các trang admin có bộ lọc tìm kiếm — tự động:
 * 1. Reset về trang 1 khi bất kỳ giá trị nào trong `resetDeps` thay đổi.
 * 2. Clamp trang hiện tại về trang cuối khi dữ liệu bị lọc/xóa bớt.
 *
 * @param totalFilteredItems - Tổng số mục sau khi đã lọc.
 * @param itemsPerPage - Số mục hiển thị trên mỗi trang.
 * @param resetDeps - Danh sách dependencies — khi thay đổi thì reset trang về 1 (thường là các giá trị filter/search).
 */
export function useClientPagination(
	totalFilteredItems: number,
	itemsPerPage: number,
	resetDeps: unknown[],
): UseClientPaginationReturn {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);


	useEffect(() => {
		setCurrentPage(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, resetDeps);


	useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);

	return { currentPage, totalPages, setCurrentPage };
}
