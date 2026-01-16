"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { BreadcrumbItem } from "~/types/breadcrumb";
import { BreadcrumbContextType } from "~/types/breadcrumb";

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
	const [items, setItems] = useState<BreadcrumbItem[]>([{ label: "Home", href: "/" }]);
	return (
		<BreadcrumbContext.Provider value={{ items, setBreadcrumbs: setItems }}>{children}</BreadcrumbContext.Provider>
	);
};

export const useBreadcrumb = () => {
	const context = useContext(BreadcrumbContext);
	if (!context) throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
	return context;
};
