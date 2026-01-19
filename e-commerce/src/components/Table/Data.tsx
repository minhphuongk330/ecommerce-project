"use client";
import Paper from "@mui/material/Paper";
import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import { SxProps, Theme } from "@mui/material";

interface DataTableProps extends DataGridProps {
	noRowsLabel?: string;
	sx?: SxProps<Theme>;
}

export default function DataTable({ noRowsLabel = "No data", sx, ...props }: DataTableProps) {
	return (
		<Paper
			sx={{
				width: "100%",
				overflow: "hidden",
				border: "1px solid #e5e7eb",
				boxShadow: "none",
				...sx,
			}}
		>
			<DataGrid
				initialState={{
					pagination: { paginationModel: { page: 0, pageSize: 5 } },
				}}
				pageSizeOptions={[5]}
				autoHeight
				rowHeight={80}
				disableRowSelectionOnClick
				localeText={{ noRowsLabel: noRowsLabel }}
				{...props}
				sx={{
					border: 0,
					"& .MuiDataGrid-columnHeaders": {
						backgroundColor: "#f9fafb",
						color: "#4b5563",
						fontWeight: 600,
						textTransform: "uppercase",
						fontSize: "0.75rem",
					},
					"& .MuiDataGrid-cell": {
						borderBottom: "1px solid #f3f4f6",
					},
					"& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus": {
						outline: "none",
					},

					"& .MuiTablePagination-selectLabel, & .MuiTablePagination-input": {
						display: "none",
					},
					"& .MuiTablePagination-displayedRows": {
						marginBottom: 0,
					},
				}}
			/>
		</Paper>
	);
}
