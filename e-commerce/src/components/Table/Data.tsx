"use client";
import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef, GridValidRowModel } from "@mui/x-data-grid";

interface DataTableProps {
  rows: GridValidRowModel[];
  columns: GridColDef[];
  loading?: boolean;
  rowHeight?: number;
  noRowsLabel?: string;
}

export default function DataTable({
  rows,
  columns,
  loading = false,
  rowHeight = 60,
  noRowsLabel = "No data",
}: DataTableProps) {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "none" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        rowHeight={rowHeight}
        localeText={{ noRowsLabel: noRowsLabel }}
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
        }}
      />
    </Paper>
  );
}
