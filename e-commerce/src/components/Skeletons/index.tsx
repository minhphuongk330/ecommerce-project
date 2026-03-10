import Skeleton from "@mui/material/Skeleton";

export function PageHeaderSkeleton() {
	return (
		<div className="space-y-4 mb-6">
			<Skeleton width="50%" height={32} />
			<Skeleton width="33.33%" height={16} />
		</div>
	);
}

export function FilterSkeleton() {
	return (
		<div className="p-4 border border-gray-200 rounded-lg space-y-4">
			<Skeleton width="25%" height={16} />
			{[1, 2, 3].map(i => (
				<div key={i} className="space-y-2">
					<Skeleton width="33.33%" height={12} />
					<Skeleton width="100%" height={32} />
				</div>
			))}
			<div className="flex gap-2 pt-2">
				<Skeleton width={80} height={36} />
				<Skeleton width={80} height={36} />
			</div>
		</div>
	);
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
	return (
		<div className="flex gap-4 p-4 border-b border-gray-100 items-center">
			{Array.from({ length: columns }).map((_, i) => (
				<Skeleton key={i} height={16} sx={{ flex: 1 }} />
			))}
		</div>
	);
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
	return (
		<div className="border border-gray-200 rounded-lg overflow-hidden">
			<div className="flex gap-4 p-4 bg-gray-50 border-b border-gray-200 items-center">
				{Array.from({ length: columns }).map((_, i) => (
					<Skeleton key={i} height={16} sx={{ flex: 1 }} />
				))}
			</div>
			{Array.from({ length: rows }).map((_, i) => (
				<TableRowSkeleton key={i} columns={columns} />
			))}
		</div>
	);
}

export function DetailPageSkeleton() {
	return (
		<div className="space-y-6">
			<PageHeaderSkeleton />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-2 space-y-6">
					<div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
						<Skeleton width="100%" height={400} />
					</div>
					<div className="space-y-4">
						<Skeleton width="75%" height={24} />
						<Skeleton width="100%" height={16} />
						<Skeleton width="83.33%" height={16} />
						<Skeleton width="66.67%" height={16} />
					</div>
				</div>
				<div className="space-y-4">
					<Skeleton width="50%" height={32} />
					<Skeleton width="66.67%" height={16} />
					<Skeleton width="100%" height={48} />
					<Skeleton width="100%" height={48} />
				</div>
			</div>
		</div>
	);
}

export function ProductDetailSkeleton() {
	return (
		<div className="w-full bg-white">
			<div className="w-full flex justify-center py-6 md:py-10">
				<div className="w-full max-w-[1440px] px-4 md:px-[160px]">
					<div className="flex flex-col lg:flex-row gap-6 md:gap-[48px] w-full">
						<div className="flex-1">
							<Skeleton width="100%" height={500} variant="rounded" />
							<div className="flex gap-2 mt-4">
								{Array.from({ length: 4 }).map((_, i) => (
									<Skeleton key={i} width={80} height={80} variant="rounded" />
								))}
							</div>
						</div>

						<div className="w-full lg:w-[536px] flex flex-col space-y-6">
							<Skeleton width="100%" height={48} />

							<div className="flex gap-4">
								<Skeleton width={120} height={32} />
								<Skeleton width={100} height={32} />
							</div>

							<div className="space-y-2">
								<Skeleton width={100} height={16} />
								<div className="flex gap-2">
									{Array.from({ length: 3 }).map((_, i) => (
										<Skeleton key={i} width={60} height={40} variant="rounded" />
									))}
								</div>
							</div>

							<div className="space-y-2">
								<Skeleton width={100} height={16} />
								<div className="flex gap-3">
									{Array.from({ length: 4 }).map((_, i) => (
										<Skeleton key={i} variant="circular" width={40} height={40} />
									))}
								</div>
							</div>

							<div className="space-y-2">
								<Skeleton width="100%" height={16} />
								<Skeleton width="95%" height={16} />
								<Skeleton width="90%" height={16} />
								<Skeleton width={120} height={16} />
							</div>

							<div className="flex gap-3">
								<Skeleton width="60%" height={48} variant="rounded" />
								<Skeleton width="40%" height={48} variant="rounded" />
							</div>

							<div className="border-t pt-4 space-y-3">
								<Skeleton width={150} height={16} />
								<Skeleton width="100%" height={16} />
								<Skeleton width="100%" height={16} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
	return (
		<div className="space-y-4">
			{Array.from({ length: fields }).map((_, i) => (
				<div key={i} className="space-y-2">
					<Skeleton width="25%" height={16} />
					<Skeleton width="100%" height={40} />
				</div>
			))}
			<Skeleton width="100%" height={48} />
		</div>
	);
}

export function ProfileSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row gap-6">
				<div className="w-24 h-24 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden">
					<Skeleton variant="circular" width={96} height={96} />
				</div>
				<div className="flex-1 space-y-3">
					<Skeleton width="33.33%" height={24} />
					<Skeleton width="50%" height={16} />
					<Skeleton width="40%" height={16} />
				</div>
			</div>
			<div className="border-t border-gray-200 pt-6">
				<Skeleton width="25%" height={20} />
				<FormSkeleton fields={5} />
			</div>
		</div>
	);
}

export function CheckoutSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div className="md:col-span-2 space-y-6">
				{[1, 2, 3].map(i => (
					<div key={i} className="border border-gray-200 rounded-lg p-6 space-y-4">
						<Skeleton width="33.33%" height={20} />
						<FormSkeleton fields={3} />
					</div>
				))}
			</div>
			<div className="border border-gray-200 rounded-lg p-6 space-y-4 h-fit">
				<Skeleton width="50%" height={20} />
				<div className="space-y-3">
					{[1, 2, 3, 4].map(i => (
						<div key={i} className="flex justify-between">
							<Skeleton width={96} height={16} />
							<Skeleton width={64} height={16} />
						</div>
					))}
				</div>
				<div className="h-px bg-gray-200 my-2" />
				<Skeleton width="100%" height={48} />
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="flex flex-col p-4 border border-gray-100 rounded-2xl h-full">
					<div className="relative w-full aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden">
						<Skeleton width="100%" height={300} />
						<div className="absolute top-3 right-3 w-6 h-6 bg-gray-200 rounded-full opacity-50" />
					</div>
					<div className="flex flex-col items-center gap-2 mb-4">
						<Skeleton width="75%" height={16} />
						<Skeleton width="33.33%" height={24} />
					</div>
					<Skeleton width="100%" height={40} />
				</div>
			))}
		</div>
	);
}

export function CartPageSkeleton() {
	return (
		<div className="flex flex-col md:flex-row gap-8 w-full">
			<div className="w-full md:w-[60%] flex flex-col gap-6">
				<Skeleton width={192} height={32} />
				<div className="flex flex-col gap-6">
					{[1, 2, 3].map(i => (
						<div key={i} className="flex gap-4 pb-6 border-b border-gray-100">
							<Skeleton width={96} height={96} />
							<div className="flex-1 flex flex-col md:flex-row justify-between">
								<div className="space-y-2 mb-4 md:mb-0">
									<Skeleton width={160} height={20} />
									<Skeleton width={96} height={12} />
									<Skeleton width={128} height={12} />
								</div>
								<div className="flex items-center gap-6">
									<Skeleton width={80} height={24} />
									<Skeleton width={80} height={24} />
									<Skeleton variant="circular" width={24} height={24} />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="w-full md:w-[40%]">
				<div className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-6 h-fit">
					<Skeleton width={160} height={24} />
					<div className="space-y-4 my-2">
						<div className="flex justify-between">
							<Skeleton width={80} height={16} />
							<Skeleton width={64} height={16} />
						</div>
						<div className="flex justify-between">
							<Skeleton width={80} height={16} />
							<Skeleton width={64} height={16} />
						</div>
						<div className="flex justify-between">
							<Skeleton width={128} height={16} />
							<Skeleton width={96} height={16} />
						</div>
					</div>
					<div className="h-px bg-gray-100 my-2" />
					<div className="flex justify-between mb-4">
						<Skeleton width={64} height={24} />
						<Skeleton width={96} height={24} />
					</div>
					<Skeleton width="100%" height={48} />
				</div>
			</div>
		</div>
	);
}
