"use client";
import NextLink from "next/link";
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useBreadcrumb } from "~/contexts/BreadcrumbContext";

const Breadcrumb = () => {
	const { items } = useBreadcrumb();

	return (
		<div className="w-full bg-white py-[40px] px-[160px]">
			<MuiBreadcrumbs
				separator={<KeyboardArrowRight sx={{ color: "#A0A0A0" }} fontSize="small" />}
				aria-label="breadcrumb"
			>
				{items.map((item, index) => {
					const isLast = index === items.length - 1;
					if (isLast) {
						return <span className="text-black font-medium text-base">{item.label}</span>;
					}

					return (
						<NextLink
							href={item.href || "#"}
							className="text-[#A0A0A0] hover:text-black no-underline font-medium text-base transition-colors"
						>
							{item.label}
						</NextLink>
					);
				})}
			</MuiBreadcrumbs>
		</div>
	);
};

export default Breadcrumb;
