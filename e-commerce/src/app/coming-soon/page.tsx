"use client";
import ConstructionIcon from "@mui/icons-material/Construction";
import { useRouter } from "next/navigation";
import { routerPaths } from "~/utils/router";

export default function ComingSoonPage() {
	const router = useRouter();

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
				<div className="flex justify-center mb-4">
					<ConstructionIcon
						sx={{
							fontSize: 100,
							color: "#FCA311",
						}}
					/>
				</div>

				<h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">Coming Soon</h1>

				<h2 className="text-lg md:text-xl text-gray-600 mb-4">This feature is under development</h2>

				<p className="text-base text-gray-500 mb-8">
					We are working hard to bring you a better experience. Please come back later.
				</p>

				<div className="flex gap-3 justify-center flex-wrap">
					<button
						onClick={() => router.push(routerPaths.index)}
						className="px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
					>
						Back to Home
					</button>
					<button
						onClick={() => router.back()}
						className="px-6 py-2 md:py-3 border border-blue-600 text-blue-600 hover:bg-gray-50 font-medium rounded-lg transition duration-200"
					>
						Go Back
					</button>
				</div>
			</div>
		</div>
	);
}
