"use client";
import React from "react";
import Pagination from "@mui/material/Pagination";
import { PaginationProps } from "~/types/catalog";

const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
	return (
		<div className="flex justify-center">
			<Pagination
				count={totalPages}
				page={currentPage}
				onChange={(_, page) => onPageChange(page)}
				variant="outlined"
				shape="rounded"
				size="large"
				sx={{
					"& .MuiPaginationItem-root.Mui-selected": {
						backgroundColor: "black !important",
						color: "white",
						borderColor: "black",
					},
				}}
			/>
		</div>
	);
};

export default PaginationComponent;
