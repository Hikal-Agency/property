import { Box, Pagination } from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { AiOutlineTable, AiOutlineAppstore } from "react-icons/ai";
import { Tab, Tabs } from "@mui/material";
import { useEffect } from "react";
import Loader from "../../Components/Loader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GridNewsletter from "../../Components/newsletter/GridNewsletter";
import axios from "axios";

const Newsletter = () => {
  const {
    User,
    setUser,
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    darkModeColors,
  } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setloading] = useState(true);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [searchText, setSearchText] = useState("");

  const [tabValue, setTabValue] = useState(0);

  const HandleQuicSearch = (e) => {
    console.log(e.target.value);
  };

  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
  });

  const columns = [
    {
      field: "id",
      headerName: "#",
      minWidth: "10",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "creationDate",
      headerName: "Date",
      minWidth: 50,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "status",
      headerName: "Note",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
    },
  ];

  const FetchNews = async (token) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    axios
      .get(`${BACKEND_URL}/newsletters?page=${pageState.page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("newsletter ");
        console.log(result.data.newsletters);
        let rowsDataArray = "";
        if (result.data.newsletters.data.current_page > 1) {
          const theme_values = Object.values(result.data.newsletters.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = result.data.newsletters.data;
        }
        console.log("rows array is");
        console.log(rowsDataArray);

        let rowsdata = rowsDataArray.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          creationDate: row?.created_at,
          email: row?.email || "No Email",
          status:
            row?.status === "Subscribed" || row?.status === "Subscribed"
              ? "Subscribed"
              : "UnSubscribed",
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          total: result.data.newsletters.total,
          pageSize: result.data.newsletters.per_page,
        }));
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
      });
  };

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    const token = localStorage.getItem("auth-token");
    FetchNews(token);
    // eslint-disable-next-line
  }, [pageState.page]);

  const DataGridStyles = {
    "& .MuiButtonBase-root": {
      color: "white",
    },
    // TOOLBAR
    "& .MuiDataGrid-toolbarContainer": {
      backgroundColor: currentMode === "dark" ? "#212121" : "#000000",
      paddingTop: "10px",
      paddingBottom: "10px",
      paddingLeft: "20px",
      paddingRight: "20px",
    },

    "& .MuiInputBase-root": {
      color: "white",
    },
    "& .MuiInputBase-root::before": {
      color: "white",
    },
    "& .MuiInputBase-root:hover::before": {
      color: "white",
    },

    // Background color of header of data grid
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
      color: currentMode === "dark" ? "white" : "white",
    },
    "& .MuiIconButton-sizeSmall": {
      color: currentMode === "dark" ? "white" : "white",
    },
    // background color of main table content
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: currentMode === "dark" ? "#212121" : "#ffffff",
      color: currentMode === "dark" ? "white" : "black",
    },
    // changing rows hover color
    "& .css-1uhmucx-MuiDataGrid-root .MuiDataGrid-row:hover .MuiDataGrid-row": {
      backgroundColor: currentMode === "dark" && "#000000",
      border: "none",
    },
    // changing row colors
    " .even": {
      backgroundColor: currentMode === "dark" ? "#212121" : "#ffffff",
    },
    // changing rows right border
    // "& .MuiDataGrid-cell": {
    //   borderRight: "1px solid rgb(240, 240, 240)",
    // },
    // BACKGROUND COLOR OF FOOTER
    "& .MuiDataGrid-footerContainer": {
      borderTop: "none",
      backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
      color: "white",
    },
    "& .MuiTablePagination-selectLabel": {
      color: "white",
    },
    "& .MuiTablePagination-select ": { color: "white" },
    "& .MuiSvgIcon-fontSizeMedium ": { color: "white" },
    "& .MuiTablePagination-displayedRows": { color: "white" },
    // For inner data styling
    "& .MuiDataGrid-virtualScrollerRenderZone": {
      // backgroundColor: "red",
    },
  };

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <>
        <Pagination
          sx={{
            "& .Mui-selected": {
              backgroundColor: "white !important",
              color: "black !important",
              borderRadius: "5px !important",
            },
          }}
          count={pageCount}
          page={page + 1}
          onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className={`w-full `}>
              <div className="pl-3">
                <div className="mt-3 flex justify-between items-center">
                  <h1
                    className={`text-xl border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-red-600 font-bold border-red-600"
                    }`}
                  >
                    Newsletter{" "}
                    <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                      <span>{pageState?.total}</span>
                    </span>
                  </h1>
                  <Link
                    to="/newsletter/addnewsletter"
                    className="bg-main-red-color hover:bg-red-700 text-white px-4 py-2 rounded-sm"
                  >
                    Add Newsletter
                  </Link>
                </div>
                <Box
                  sx={{
                    ...darkModeColors,
                    "& .MuiTabs-indicator": {
                      // height: "100%",
                      borderRadius: "5px",
                      backgroundColor: "#da1f26",
                    },
                    "& .Mui-selected": {
                      color: "white !important",
                      zIndex: "1",
                    },
                  }}
                  className={`w-full rounded-md overflow-hidden ${
                    currentMode === "dark" ? "bg-black" : "bg-white"
                  } `}
                >
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="standard"
                    className="w-full px-1 m-1"
                  >
                    <Tab icon={<AiOutlineTable />} />
                    <Tab icon={<AiOutlineAppstore />} />
                  </Tabs>
                </Box>

                <div className="mt-3 pb-3">
                  <TabPanel value={value} index={0}>
                    <GridNewsletter
                      isLoading={loading}
                      tabValue={tabValue}
                      setTabValue={setTabValue}
                      pageState={pageState}
                      setpageState={setpageState}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Box width={"100%"} sx={DataGridStyles}>
                      <DataGrid
                        autoHeight
                        rows={pageState.data}
                        //   onRowClick={handleRowClick}
                        rowCount={pageState.total}
                        loading={pageState.isLoading}
                        rowsPerPageOptions={[30, 50, 75, 100]}
                        pagination
                        paginationMode="server"
                        page={pageState.page - 1}
                        pageSize={pageState.pageSize}
                        onPageChange={(newPage) => {
                          setpageState((old) => ({
                            ...old,
                            page: newPage + 1,
                          }));
                        }}
                        onPageSizeChange={(newPageSize) =>
                          setpageState((old) => ({
                            ...old,
                            pageSize: newPageSize,
                          }))
                        }
                        columns={columns}
                        components={{
                          Toolbar: GridToolbar,
                          Pagination: CustomPagination,
                        }}
                        componentsProps={{
                          toolbar: {
                            showQuickFilter: true,
                            value: searchText,
                            onChange: HandleQuicSearch,
                          },
                        }}
                        sx={{
                          "& .MuiDataGrid-row": {
                            justifyContent: "center",
                          },
                          "& .MuiDataGrid-cell": {
                            textAlign: "center",
                          },
                        }}
                        getRowClassName={(params) =>
                          params.indexRelativeToCurrentPage % 2 === 0
                            ? "even"
                            : "odd"
                        }
                      />
                    </Box>
                    {/* <AllNewsletters
                      isLoading={loading}
                      tabValue={tabValue}
                      setTabValue={setTabValue}
                      pageState={pageState}
                      setpageState={setpageState}
                    /> */}
                  </TabPanel>
                </div>
                {/* <AllNewsletters
                  pageState={pageState}
                  setpageState={setpageState}
                /> */}
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        )}
      </div>
    </>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Newsletter;
