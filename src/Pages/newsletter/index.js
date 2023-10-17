import React, { 
  useState,
  useEffect 
} from "react";
import { toast } from "react-toastify";
import { 
  Box, 
  Pagination,
  TextField,
  Tooltip
} from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { Tab, Tabs } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import GridNewsletter from "../../Components/newsletter/GridNewsletter";
import axios from "../../axoisConfig";

import { 
  AiOutlineTable, 
  AiOutlineAppstore 
} from "react-icons/ai";
import {
  RiMailAddLine
} from "react-icons/ri";
import {
  MdClose
} from "react-icons/md";

const Newsletter = () => {
  const {
    User,
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    darkModeColors,
    primaryColor,
    themeBgImg
  } = useStateContext();
  const [loading, setloading] = useState(true);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(value === 0 ? 1 : 0);
  };

  
  const [emailError, setEmailError] = useState(false);
  const [newsletterData, setNewsletterData] = useState({
    email: ""
  });

  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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

  const handleEmail = (e) => {
    setEmailError(false);
    const value = e.target.value;
    setNewsletterData({ ...newsletterData, email: value });

    console.log(value);
    // const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const emailRegex = /^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (emailRegex.test(value)) {
      setEmailError(false);
      setNewsletterData({ ...newsletterData, email: value });
    } else {
      setEmailError("Kindly enter a valid email.");
      return;
    }
    // setNewsletterData({ ...newsletterData, email: value });
    // setEmail(value);
    console.log("Email state: ", newsletterData?.email);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setloading(true);
    if (!newsletterData?.email) {
      toast.error("Kindly enter the email.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setloading(false);

      return;
    }

    if (!emailError === false) {
      toast.error("Kindly enter a valid email.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setloading(false);

      return;
    }

    const token = localStorage.getItem("auth-token");
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("User", user);
    const NewsLetter = new FormData();

    NewsLetter.append("email", newsletterData?.email);
    NewsLetter.append("status", "Subscribed");

    console.log("NewsLetter append: ", NewsLetter);

    try {
      const submitOffer = await axios.post(
        `${BACKEND_URL}/newsletters`,
        NewsLetter,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("NewsLetter Added Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setNewsletterData({
        email: "",
        status: "",
      });

      setloading(false);
      FetchNews(token);
    } catch (error) {
      console.log("Error: ", error);
      setloading(false);
      toast.error("Something went wrong! Please Try Again", {
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

  const columns = [
    {
      field: "creationDate",
      headerName: "Date",
      minWidth: 50,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 150,
      headerAlign: "center",
      flex: 1,
    },

    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      minWidth: 100,
      flex: 1,
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
    ".applied-filter": {
      width: "max-content",
    },
    "& .MuiButtonBase-root": {
      marginTop: "5px",
      color: currentMode === "dark" ? "white" : "black",
    },
    // TOOLBAR
    "& .MuiDataGrid-toolbarContainer": {
      backgroundColor: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
      padding: "10px 5px",
      gap: "15px",
      color: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiInputBase-root::before": {
      color: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiInputBase-root:hover::before": {
      color: currentMode === "dark" ? "white" : "black",
    },

    // DATATABLE BORDER - DARK
    "& .MuiDataGrid-root": { //css-h0wcjk-
      border: "none !important",
      boxShadow: "none !important",
    },
    // DATATABLE BORDER - LIGHT
    "& .MuiDataGrid-root": { //css-hgxfug-
      border: "none !important",
      boxShadow: "none !important",
    },

    // Background color of header of data grid
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: primaryColor,
      color: currentMode === "dark" ? "white" : "white",
    },
    "& .MuiIconButton-sizeSmall": {
      color: currentMode === "dark" ? "white" : "white",
    },
    // background color of main table content
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: currentMode === "dark" ? "#000000" : "#FFFFFF",
      color: currentMode === "dark" ? "white" : "black",
    },
    // changing rows hover color
    "& .css-1uhmucx-MuiDataGrid-root .MuiDataGrid-row:hover .MuiDataGrid-row": {
      backgroundColor: currentMode === "dark" && "#000000",
      border: "none",
    },
    // changing row colors
    " .even": {
      backgroundColor: currentMode === "dark" ? "#000000" : "#ffffff",
    },
    // changing rows right border
    // "& .MuiDataGrid-cell": {
    //   borderRight: "1px solid rgb(240, 240, 240)",
    // },
    // BACKGROUND COLOR OF FOOTER
    "& .MuiDataGrid-footerContainer": {
      borderTop: `2px solid ${primaryColor}`,
      backgroundColor: currentMode === "dark" ? "black" : "white",
      color: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiTablePagination-selectLabel": {
      color: "white",
    },
    "& .MuiTablePagination-select ": { color: currentMode === "dark" ? "white" : "black" },
    "& .MuiSvgIcon-fontSizeMedium ": { color: currentMode === "dark" ? "white" : "black" },
    "& .MuiTablePagination-displayedRows": { color: currentMode === "dark" ? "white" : "black" },
    // For inner data styling
    "& .MuiDataGrid-virtualScrollerRenderZone": {
      // backgroundColor: "red",
    },
    // "& .css-v4u5dn-MuiInputBase-root-MuiInput-root": {
    //   color: "#AAAAAA",
    // }
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
              backgroundColor: `${primaryColor} !important`,
              color: "white !important",
              borderRadius: "50px !important",
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
            className={`w-full p-4 ${
              !themeBgImg & (currentMode === "dark" ? "bg-black" : "bg-white")
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center pb-3">
                <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark"
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  Newsletter Subscriber {" "}
                  <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                    {pageState?.total}
                  </span>
                </h1>
              </div>

              {!showModal && (
                <button 
                  onClick={openModal}
                  className="bg-primary text-white px-3 py-2 rounded-md flex items-center"
                >
                    <RiMailAddLine size={16} className="mx-2" /> 
                    Email/Subscriber
                </button>
              )}

              {showModal && (
                <Box sx={darkModeColors}>
                  <div className="flex items-center">
                    <TextField
                      id="email"
                      type={"email"}
                      label="Email "
                      className="w-full"
                      variant="outlined"
                      name="email"
                      size="small"
                      value={newsletterData?.email}
                      // onChange={(e) =>
                      //   setNewsletterData({ ...newsletterData, email: e.target.value })
                      // }
                      error={emailError && emailError}
                      helperText={emailError && emailError}
                      onChange={handleEmail}
                    />
                    <Tooltip title="Add Email" arrow>
                      <button
                      onClick={handleClick}
                        className="text-2xl text-white bg-green-600 p-2 rounded-full ms-2"
                      >
                        <RiMailAddLine size={16} />
                      </button>
                    </Tooltip>
                    <Tooltip title="Cancel" arrow>
                      <button
                        onClick={closeModal}
                        className="text-2xl text-white bg-red-600 p-2 rounded-full ms-2"
                      >
                        <MdClose size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </Box>
              )}
            </div>
            <Box
              sx={{
                ...darkModeColors,
                "& .MuiTabs-indicator": {
                  // height: "100%",
                  borderRadius: "5px",
                },
                "& .Mui-selected": {
                  color: "white !important",
                  zIndex: "1",
                },
              }}
              className={`w-full flex justify-end rounded-lg overflow-hidden`}
            >
              <Tabs value={value} onClick={handleChange} variant="standard">
                <Tab
                  icon={
                    <AiOutlineAppstore
                      size={22}
                      style={{
                        color:
                          currentMode === "dark" ? "#ffffff" : "#000000",
                      }}
                    />
                  }
                />
                <Tab
                  icon={
                    <AiOutlineTable
                      size={22}
                      style={{
                        color:
                          currentMode === "dark" ? "#ffffff" : "#000000",
                      }}
                    />
                  }
                />
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
                <Box
                  width={"100%"}
                  className={`${currentMode}-mode-datatable`}
                  sx={DataGridStyles}
                >
                  <DataGrid
                  disableDensitySelector
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
                        printOptions: {
                          disableToolbarButton: User?.role !== 1,
                        },
                        csvOptions: {
                          disableToolbarButton: User?.role !== 1,
                        },
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
                      "& .MuiDataGrid-cell[data-field='edit'] svg": {
                        color:
                          currentMode === "dark"
                            ? "white !important"
                            : "black !important",
                      },
                    }}
                    getRowClassName={(params) =>
                      params.indexRelativeToCurrentPage % 2 === 0
                        ? "even"
                        : "odd"
                    }
                  />
                </Box>

              </TabPanel>
            </div>
            
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
