import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";

const ListingDataGrid = ({ data, setData, column, setColumn, type }) => {
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
  const [loading, setLoading] = useState(false);

  console.log("datagrid:: ", data);

  const FetchData = async () => {
    setLoading(true);
    // if (page > 1) {
    //   setbtnloading(true);
    // }
    let url;
    if (type === "list_type") url = `${BACKEND_URL}/listing-types?page=${page}`;

    try {
      const listingsData = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("all listings: ", listingsData);
      let listings = listingsData?.data?.data?.data || [];

      let rowsDataArray = "";
      if (listingsData?.data?.data?.current_page > 1) {
        const theme_values = Object.values(listings);
        rowsDataArray = theme_values;
      } else {
        rowsDataArray = listings;
      }

      let rowsData = rowsDataArray?.map((row, index) => ({
        id: page > 1 ? page * pageSize - (pageSize - 1) + index : index + 1,
        name: row?.name,
      }));

      setData({ ...data, list_type: rowsData });

      setLoading(false);
      setLastPage(listingsData?.data?.data?.last_page);
      setPageSize(listingsData?.data?.data?.per_page);
      setTotal(listingsData?.data?.data?.total);
    } catch (error) {
      console.log("listings not fetched. ", error);
      toast.error("Unable to fetch data.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

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
          rows={data?.list_type}
          columns={column}
          //   columns={columns?.filter((c) =>
          //     hasPermission("users_col_" + c?.field)
          //   )}
          rowCount={total}
          loading={loading}
          rowsPerPageOptions={[30, 50, 75, 100]}
          pagination
          // width="auto"
          getRowHeight={() => "auto"}
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
          onPageChange={(newPage) =>
            setPage(() => ({
              page: newPage + 1,
            }))
          }
          onPageSizeChange={(newPageSize) =>
            setPageSize(() => ({
              pageSize: newPageSize,
            }))
          }
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
