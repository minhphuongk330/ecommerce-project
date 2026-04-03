"use client";
import React from "react";
import Breadcrumb from "~/components/atoms/Breadcrumbs";
import { BreadcrumbProvider } from "~/contexts/BreadcrumbContext";

export default function ProductsGroupedLayout({ children }: { children: React.ReactNode }) {
	return (
		<BreadcrumbProvider>
			<div className="w-full bg-white min-h-screen flex flex-col items-center">
				<Breadcrumb />
				{children}
			</div>
		</BreadcrumbProvider>
	);
}
