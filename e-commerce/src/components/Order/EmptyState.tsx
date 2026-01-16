import Link from "next/link";
import { routerPaths } from "~/utils/router";

export default function OrderEmptyState() {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
      <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
      <Link
        href={routerPaths.index}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
      >
        Start Shopping
      </Link>
    </div>
  );
}