import Skeleton from "~/components/atoms/Skeleton";

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="flex flex-col p-4 border border-gray-100 rounded-2xl h-full">
					<div className="relative w-full aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden">
						<Skeleton className="w-full h-full" />
						<div className="absolute top-3 right-3 w-6 h-6 bg-gray-200 rounded-full opacity-50" />
					</div>
					<div className="flex flex-col items-center gap-2 mb-4">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-6 w-1/3 mt-1" />
					</div>
					<Skeleton className="h-10 w-full rounded-lg mt-auto" />
				</div>
			))}
		</div>
	);
}

export function CartPageSkeleton() {
	return (
		<div className="flex flex-col md:flex-row gap-8 w-full">
			<div className="w-full md:w-[60%] flex flex-col gap-6">
				<Skeleton className="h-8 w-48 mb-2" />
				<div className="flex flex-col gap-6">
					{[1, 2, 3].map(i => (
						<div key={i} className="flex gap-4 pb-6 border-b border-gray-100">
							<Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
							<div className="flex-1 flex flex-col md:flex-row justify-between">
								<div className="space-y-2 mb-4 md:mb-0">
									<Skeleton className="h-5 w-40" />
									<Skeleton className="h-3 w-24" />
									<Skeleton className="h-3 w-32" />
								</div>
								<div className="flex items-center gap-6">
									<Skeleton className="h-6 w-20 rounded-md" />
									<Skeleton className="h-6 w-20" />
									<Skeleton className="w-6 h-6 rounded-full" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="w-full md:w-[40%]">
				<div className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-6 h-fit">
					<Skeleton className="h-6 w-40" />
					<div className="space-y-4 my-2">
						<div className="flex justify-between">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-16" />
						</div>
						<div className="flex justify-between">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-16" />
						</div>
						<div className="flex justify-between">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-24" />
						</div>
					</div>
					<div className="h-px bg-gray-100 my-2" />
					<div className="flex justify-between mb-4">
						<Skeleton className="h-6 w-16" />
						<Skeleton className="h-6 w-24" />
					</div>
					<Skeleton className="h-12 w-full rounded-lg" />
				</div>
			</div>
		</div>
	);
}
