import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";

const ListingDataGrid = ({ data, setData, column, setColumn }) => {
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
  const [loading, setLoading] = useState(false);

  const FetchData = async (page = 1) => {
    setLoading(true);
    if (page > 1) {
      setbtnloading(true);
    }
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

      if (page > 1) {
        setData((prevData) => {
          return [
            ...prevData,
            ...listings?.map((listing) => ({
              ...listing,
              page: page,
            })),
          ];
        });
      } else {
        setData(() => {
          return [
            ...listings?.map((listing) => ({
              ...listing,
              page: page,
            })),
          ];
        });
      }
      setLoading(false);
      setLastPage(listingsData?.data?.last_page);
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
          //   rows={pageState.data}
          // columns={columns}
          //   columns={columns?.filter((c) =>
          //     hasPermission("users_col_" + c?.field)
          //   )}
          //   rowCount={pageState.total}
          //   loading={pageState.isLoading}
          rowsPerPageOptions={[30, 50, 75, 100]}
          pagination
          // width="auto"
          getRowHeight={() => "auto"}
          paginationMode="server"
          //   page={pageState.page - 1}
          //   pageSize={pageState.pageSize}
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
          //   onPageChange={(newPage) => {
          //     setpageState((old) => ({
          //       ...old,
          //       page: newPage + 1,
          //     }));
          //   }}
          //   onPageSizeChange={(newPageSize) =>
          //     setpageState((old) => ({
          //       ...old,
          //       pageSize: newPageSize,
          //     }))
          //   }
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
