import { Button } from "@material-tailwind/react";
import { FaComment } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import { AiOutlineEdit, AiOutlineHistory } from "react-icons/ai";
import { MdCampaign } from "react-icons/md";
import { FaSnapchat } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaArchive } from "react-icons/fa";
import { GiMagnifyingGlass } from "react-icons/gi";
import { FaUser } from "react-icons/fa";

import { BsPersonCircle, BsSnow2 } from "react-icons/bs";
import moment from "moment/moment";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RiMessage2Line } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

import { MenuItem, Pagination, Select } from "@mui/material";
import { Box } from "@mui/system";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
// import axios from "axios";
import axios from "../axoisConfig";
import UpdateClosedLead from "./Leads/UpdateClosedLead";

const Closedeals = ({ pageState, setpageState }) => {
  // eslint-disable-next-line
  const [singleLeadData, setsingleLeadData] = useState();
  const navigate = useNavigate();
  const { currentMode, DataGridStyles, BACKEND_URL, User } = useStateContext();
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  const [pageRange, setPageRange] = useState();

  //Update LEAD MODAL VARIABLES
  const [UpdateLeadModelOpen, setUpdateLeadModelOpen] = useState(false);
  const handleUpdateLeadModelOpen = () => setUpdateLeadModelOpen(true);
  const handleUpdateLeadModelClose = () => {
    setUpdateLeadModelOpen(false);
  };

  const handleRangeChange = (e) => {
    const value = e.target.value;

    setPageRange(value);

    setpageState((old) => ({
      ...old,
      perpage: value,
    }));
  };

  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = (e) => {
    console.log(e.target.value);
  };

  const columns = [
    {
      field: "leadSource",
      headerName: "Src",
      flex: 1,
      minWidth: 45,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.row.leadSource?.toLowerCase() ===
              "campaign snapchat" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaSnapchat size={22} color={"#f6d80a"} />
              </div>
            )}
            {cellValues.row.leadSource?.toLowerCase() ===
              "campaign facebook" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaFacebook size={22} color={"#0e82e1"} />
              </div>
            )}
            {cellValues.row.leadSource?.toLowerCase() === "campaign tiktok" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <img
                  src={"/assets/tiktok-app.svg"}
                  alt=""
                  height={22}
                  width={22}
                  className="object-cover"
                />
              </div>
            )}
            {cellValues.row.leadSource?.toLowerCase() ===
              "campaign googleads" && (
              <div className="bg-white w-max rounded-full text-white flex items-center justify-center">
                <FcGoogle size={22} />
              </div>
            )}
            {cellValues.row.leadSource?.toLowerCase() === "campaign" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <MdCampaign size={22} color={"#000000"} />
              </div>
            )}
            {cellValues.row.leadSource?.toLowerCase() === "cold" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <BsSnow2 size={22} color={"#0ec7ff"} />
              </div>
            )}
            {cellValues.row.leadSource?.toLowerCase() === "personal" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <BsPersonCircle size={22} color={"#14539a"} />
              </div>
            )}

            {cellValues.row.leadSource?.toLowerCase() === "whatsapp" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaWhatsapp size={22} color={"#29EC62"} />
              </div>
            )}

            {cellValues.row.leadSource?.toLowerCase() === "message" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <RiMessage2Line size={22} color={"#14539a"} />
              </div>
            )}

            {cellValues.row.leadSource?.toLowerCase() === "comment" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaComment size={22} color={"#14539a"} />
              </div>
            )}

            {cellValues.row.leadSource?.toLowerCase() === "website" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaGlobe size={22} color={"#14539a"} />
              </div>
            )}

            {(cellValues.row.leadSource?.toLowerCase() === "property finder" ||
              cellValues.row.leadSource?.toLowerCase() ===
                "propety finder") && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <GiMagnifyingGlass size={22} color={"#14539a"} />
              </div>
            )}

            {cellValues.row.leadSource?.toLowerCase() === "self" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaUser size={22} color={"#14539a"} />
              </div>
            )}

            {cellValues.row.leadSource?.toLowerCase() ===
              "campaign youtube" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaYoutube size={22} color={"#FF0000"} />
              </div>
            )}

            {cellValues.row.leadSource?.toLowerCase() ===
              "campaign twitter" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaTwitter size={22} color={"#14539a"} />
              </div>
            )}

            {/* {cellValues.row.leadSource?.toLowerCase() ===
              "warm (Hubspot: shery@hikalagency.ae)" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaFire size={22} color={"#14539a"} />
              </div>
            )} */}

            {(() => {
              const leadSource = cellValues.row.leadSource?.toLowerCase();

              if (leadSource && leadSource.startsWith("warm")) {
                const firstWord = leadSource.split(" ")[0];

                return (
                  <div className="bg-white w-max rounded-full flex items-center justify-center">
                    <FaArchive size={22} color={"#14539a"} />
                  </div>
                );
              }

              return null; // Return null if the condition is not met
            })()}
          </>
        );
      },
    },
    {
      field: "dealDate",
      headerName: "Deal date",
      minWidth: 50,
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
    {
      field: "leadName",
      headerName: "Lead name",
      minWidth: 60,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "project",
      headerName: "Project",
      headerAlign: "center",

      minWidth: 60,
      flex: 1,
    },
    {
      field: "enquiryType",
      headerName: "Enquiry",
      headerAlign: "center",

      minWidth: 60,
      flex: 1,
    },
    {
      field: "leadType",
      headerAlign: "center",

      headerName: "Property",
      minWidth: 60,
      flex: 1,
    },

    {
      field: "otp",
      headerName: "OTP",
      minWidth: 72,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div style={{ fontSize: 10 }}>
            {cellValues.formattedValue === "Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white text-center font-semibold">
                <span className="bg-[#0F9D58] p-1 rounded-md w-24 text-center">
                  OTP VERIFIED
                </span>
              </div>
            )}

            {cellValues.formattedValue === "Not Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white text-center font-semibold">
                <span className="bg-[#DA1F26] p-1 rounded-md w-24 text-center">
                  NOT VERIFIED
                </span>
              </div>
            )}

            {cellValues.formattedValue !== "Not Verified" &&
              cellValues.formattedValue !== "Verified" && (
                <div className="w-full h-full flex justify-center items-center text-white text-center font-semibold">
                  <span className="bg-[#070707] p-1 rounded-md w-24 text-center">
                    {cellValues.formattedValue}
                  </span>
                </div>
              )}
          </div>
        );
      },
    },

    {
      field: "amount",
      headerAlign: "center",
      headerName: "Amount in AED",
      minWidth: 40,
      flex: 1,
    },
    // {
    //   field: "manager",
    //   headerName: "Manager",
    //   minWidth: 150,
    //   flex: 1,
    //   headerAlign: "center",
    // },
    // {
    //   field: "salesperson",
    //   headerName: "Agent",
    //   minWidth: 150,
    //   flex: 1,
    //   headerAlign: "center",
    // },
    {
      field: "",
      headerName: "Action",
      minWidth: 80,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div className="space-x-2 w-full flex items-center justify-center ">
            <Button
              // onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineHistory
                size={20}
                onClick={() => navigate(`/timeline/${cellValues.row.lid}`)}
              />
            </Button>
            <Button
              onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineEdit size={20} />
            </Button>
          </div>
        );
      },
    },
  ];

  const otherColumns = [
    {
      field: "dealDate",
      headerName: "Deal date",
      minWidth: 50,
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
    {
      field: "leadName",
      headerName: "Lead name",
      minWidth: 60,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "project",
      headerName: "Project",
      headerAlign: "center",

      minWidth: 60,
      flex: 1,
    },
    {
      field: "enquiryType",
      headerName: "Enquiry",
      headerAlign: "center",

      minWidth: 60,
      flex: 1,
    },
    {
      field: "leadType",
      headerAlign: "center",

      headerName: "Property",
      minWidth: 60,
      flex: 1,
    },

    {
      field: "amount",
      headerAlign: "center",
      headerName: "Amount in AED",
      minWidth: 40,
      flex: 1,
    },
    // {
    //   field: "manager",
    //   headerName: "Manager",
    //   minWidth: 150,
    //   flex: 1,
    //   headerAlign: "center",
    // },
    // {
    //   field: "salesperson",
    //   headerName: "Agent",
    //   minWidth: 150,
    //   flex: 1,
    //   headerAlign: "center",
    // },
    {
      field: "",
      headerName: "Action",
      minWidth: 80,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div className="space-x-2 w-full flex items-center justify-center ">
            <Button
              // onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineHistory
                size={20}
                onClick={() => navigate(`/timeline/${cellValues.row.lid}`)}
              />
            </Button>
            <Button
              onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineEdit size={20} />
            </Button>
          </div>
        );
      },
    },
  ];

  //   const HandleClick = (params) => {
  //     console.log(params);
  //   };
  const HandleEditFunc = async (params) => {
    setsingleLeadData(params.row);
    handleUpdateLeadModelOpen();
    // setUpdateLeadModelOpen(true);
  };
  const FetchLeads = async (token) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    axios
      .get(
        `${BACKEND_URL}/closedDeals?page=${pageState.page}&perpage=${pageState.perpage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        console.log("the closed deals are ");
        console.log(result.data);
        let rowsDataArray = "";
        if (result.data.leads.current_page > 1) {
          const theme_values = Object.values(result.data.leads.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = result.data.leads.data;
        }

        let rowsdata = rowsDataArray.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          dealDate: row?.dealDate,
          leadName: row?.leadName,
          project: row?.project,
          enquiryType: row?.enquiryType,
          leadType: row?.leadType,
          otp:
            row?.otp === "No OTP" || row?.otp === "No OTP Used"
              ? "No OTP Used"
              : row?.otp || "No OTP Used",
          leadSource: row?.leadSource || "No Source",
          amount: row?.amount,
          lid: row?.id,
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          from: result.data.leads.from,
          to: result.data.leads.to,
          pageSize: result.data.leads.per_page,
          total: result.data.leads.total,
        }));
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
      });
  };
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchLeads(token);

    // eslint-disable-next-line
  }, [pageState.page, , pageState.perpage]);

  // ROW CLICK FUNCTION
  // const handleRowClick = async (params) => {
  //   setsingleLeadData(params.row);
  //   handleLeadModelOpen();
  // };
  // EDIT BTN CLICK FUNC
  // const HandleEditFunc = async (params) => {
  //   setsingleLeadData(params.row);
  //   handleUpdateLeadModelOpen();
  // };
  // Custom Pagination
  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <>
        <div className="flex justify-center items-center">
          <p className="mr-3">
            {pageState.from}-{pageState.to}
          </p>

          <p className="text-white mr-3">Rows Per Page</p>

          <Select
            labelId="select-page-size-label"
            value={pageState.pageSize}
            onChange={handleRangeChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
          >
            {[pageState.pageSize, 14, 30, 50, 75, 100].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>

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
            onChange={(event, value) => apiRef?.current?.setPage(value - 1)}
          />
        </div>
      </>
    );
  }

  return (
    <div className="pb-10">
      <ToastContainer />
      <Box
        className={`${currentMode}-mode-datatable`}
        sx={{ ...DataGridStyles, position: "relative", marginBottom: "50px" }}
      >
        <DataGrid
          autoHeight
          rows={pageState.data}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[30, 50, 75, 100]}
          pagination
          paginationMode="server"
          page={pageState.page - 1}
          pageSize={pageState.pageSize}
          onPageChange={(newPage) => {
            setpageState((old) => ({ ...old, page: newPage + 1 }));
          }}
          onPageSizeChange={(newPageSize) =>
            setpageState((old) => ({ ...old, pageSize: newPageSize }))
          }
          columns={User?.role === 1 ? columns : otherColumns}
          components={{
            Toolbar: GridToolbar,
            Pagination: CustomPagination,
          }}
          componentsProps={{
            toolbar: {
              printOptions: { disableToolbarButton: User?.role !== 1 },
              csvOptions: { disableToolbarButton: User?.role !== 1 },
              showQuickFilter: true,
              value: searchText,
              onChange: HandleQuicSearch,
            },
          }}
          sx={{
            boxShadow: 2,
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
            "& .MuiDataGrid-main": {
              overflowY: "scroll",
              height: "auto",
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
      {UpdateLeadModelOpen && (
        <UpdateClosedLead
          LeadModelOpen={UpdateLeadModelOpen}
          setLeadModelOpen={setUpdateLeadModelOpen}
          handleLeadModelOpen={handleUpdateLeadModelOpen}
          handleLeadModelClose={handleUpdateLeadModelClose}
          LeadData={singleLeadData}
          BACKEND_URL={BACKEND_URL}
          FetchLeads={FetchLeads}
        />
      )}
    </div>
  );
};

export default Closedeals;
