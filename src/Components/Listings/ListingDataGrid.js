import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";

const ListingDataGrid = ({
  data,
  setData,
  column,
  setColumn,
  type,
  loading,
  setLoading,
}) => {
  const {
    currentMode,
    DataGridStyles,
    BACKEND_URL,
    pageState,
    setpageState,
    User,
    darkModeColors,
    themeBgImg,
    t,
  } = useStateContext();
  const token = localStorage.getItem("auth-token");
  const [last_page, setLastPage] = useState(null);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(null);

  console.log("datagrid:: ", data);
  console.log("type:: ", type);

  return (
    <div>
      <Box
        className={`${currentMode}-mode-datatable`}
        // width={"100%"}
        sx={{ ...DataGridStyles, marginBottom: "5%" }}
      >
        <DataGrid
          disableDensitySelector
          autoHeight
          disableSelectionOnClick
          rows={
            type === "list_type"
              ? data?.list_type
              : type === "list_attribute"
              ? data?.list_attribute
              : type === "list_attr_type"
              ? data?.list_attr_type
              : []
          }
          columns={column}
          //   columns={columns?.filter((c) =>
          //     hasPermission("users_col_" + c?.field)
          //   )}
          rowCount={total}
          loading={loading}
          rowsPerPageOptions={[30, 50, 75, 100]}
          pagination
          width="auto"
          // getRowHeight={() => "auto"}
          paginationMode="server"
          page={page - 1}
          pageSize={pageSize}
          componentsProps={{
            toolbar: {
              printOptions: {
                disableToolbarButton: User?.role !== 1,
              },
              csvOptions: {
                disableToolbarButton: User?.role !== 1,
              },
              showQuickFilter: true,
            },
          }}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          sx={{
            boxShadow: 2,
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
            "& .MuiDataGrid-cell[data-field='edit'] svg": {
              color:
                currentMode === "dark"
                  ? "white !important"
                  : "black !important",
            },
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
        />
      </Box>
    </div>
  );
};

export default ListingDataGrid;
