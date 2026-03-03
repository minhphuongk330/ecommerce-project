"use client";
import { useEffect, useState } from "react";

interface HydratableState {
	_hasHydrated: boolean;
}

interface HydrationGuardProps<T extends HydratableState> {
	children: React.ReactNode;
	fallback?: React.ReactNode;
	store: (selector: (state: T) => boolean) => boolean;
}

export default function HydrationGuard<T extends HydratableState>({
	children,
	fallback,
	store,
}: HydrationGuardProps<T>) {
	const isHydrated = store(state => state._hasHydrated);
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);
	if (!isMounted || !isHydrated) {
		return <>{fallback || <div className="min-h-[400px]" />}</>;
	}
	return <>{children}</>;
}
