import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Modal,
  Pagination,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
// import axios from "axios";
import axios from "../../axoisConfig";
import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, IconButton, Select } from "@material-tailwind/react";
import { MenuItem } from "react-pro-sidebar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast, ToastContainer } from "react-toastify";

const InstancesTable = ({ pageState, setpageState }) => {
  const [loading, setloading] = useState(false);

  const { currentMode, BACKEND_URL, User } = useStateContext();
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  // eslint-disable-next-line
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [instance_name, setInstanceName] = useState();

  const HandleInstance = async (e) => {
    e.preventDefault();
    setloading(true);

    const token = localStorage.getItem("auth-token");
    const InstanceData = new FormData();
    InstanceData.append("instance_name", instance_name);
    InstanceData.append("user_id");
    InstanceData.append("status");
    InstanceData.append("expired_at");

    await axios
      .post(`${BACKEND_URL}/instances`, InstanceData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Instance : ", result);
        setloading(false);
        toast.success("Lead Added Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // setLeadName("");
        // setLeadContact("");
        // setLeadEmail("");
        // setEnquiryType("");
        // setPropertyType("");
        // setLeadProject("");
        // setForType("");
        // setLanguagePrefered("");
        // setLeadSource("");
        // setFeedback("");
        // setLeadNotes("");
        // setManager("");
        // setSalesPerson2("");
      })
      .catch((err) => {
        console.log(err);
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
      });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // Model Variables
  // const [LeadModelOpen, setLeadModelOpen] = useState(false);
  // const handleLeadModelOpen = () => setLeadModelOpen(true);
  // const handleLeadModelClose = () => setLeadModelOpen(false);

  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = (e) => {
    console.log(e.target.value);
  };

  const columns = [
    {
      field: "instance_name",
      headerName: "Instance name",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 400,
      flex: 1,
      headerAlign: "center",
    },
  ];

  const FetchInstances = async (token) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    axios
      .get(`${BACKEND_URL}/instances?page=${pageState.page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("the instances are ");
        console.log(result.data);
        let rowsDataArray = "";
        if (result.data.current_page > 1) {
          const theme_values = Object.values(result.data.instances.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = result.data.instances.data;
        }
        console.log("rows array is ");
        console.log(rowsDataArray);

        let rowsdata = rowsDataArray.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          instance_name: row?.instance_name,
          status: row?.status,

          noteId: row?.id,
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          total: result.data.instances.total,
          pageSize: result.data.instances.per_page,
        }));
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
      });
  };
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchInstances(token);
    // eslint-disable-next-line
  }, [pageState.page]);

  // ROW CLICK FUNCTION
  const handleRowClick = async (params) => {
    window.open(`//${params.row.noteId}`);
  };

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
  // Custom Pagination
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
    <div className="pb-10">
      <Button
        onClick={handleOpen}
        className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color mb-4`}
      >
        Add Instance
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="mb-4"
          >
            Add Instance
          </Typography>
          <form onSubmit={HandleInstance}>
            <TextField
              id="LeadName"
              type={"text"}
              label="Instance Name"
              className="w-full mb-5"
              style={{ marginBottom: "20px" }}
              variant="outlined"
              size="medium"
              required
              value={instance_name}
              onChange={(e) => setInstanceName(e.target.value)}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                // value={Datevalue}
                // onChange={(newValue) => {
                //   console.log(newValue);
                //   setDatevalue(newValue);
                //   setPersonalInfo({
                //     ...PersonalInfo,
                //     dob:
                //       format(newValue?.$d.getUTCFullYear()) +
                //       "-" +
                //       format(newValue?.$d.getUTCMonth() + 1) +
                //       "-" +
                //       format(newValue?.$d.getUTCDate() + 1),
                //   });
                //   console.log(Datevalue);
                // }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onKeyDown={(e) => e.preventDefault()}
                    readOnly={true}
                  />
                )}
                className="w-full"
                required
                // maxDate={currentDate}
                // minDate={minDate}
                // inputFormat="MM/dd/yyyy"
                // disableFuture
                invalidDateMessage="Invalid date"
                mask="__/__/____"
              />
            </LocalizationProvider>
          </form>
        </Box>
      </Modal>
      {/* <Modal
        keepMounted
        // open={sendMessageModal.open}
        // onClose={() => setSendMessageModal({ open: false })}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
      >
        <div
          //   style={style}
          className={`w-[calc(100%-20px)] md:w-[50%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              //   color: (theme) => theme.palette.grey[500],
            }}
            // onClick={() => setSendMessageModal({ open: false })}
          >
            <IoMdClose size={18} />
          </IconButton>

          <form action="">
            <TextareaAutosize
              id="message"
              placeholder="Type here"
              type={"text"}
              required
              minRows={8}
              label="Message"
              className="w-full"
              style={{
                border: "1px solid",
                padding: 10,
                borderRadius: "4px",
                marginTop: "10px",
              }}
              variant="outlined"
              size="medium"
              //   value={messageValue}
              //   onInput={(e) => setMessageValue(e.target.value)}
            />

            <Button
              ripple="true"
              variant="contained"
              color="success"
              sx={{ p: "12px", mt: 2 }}
              type="submit"
            >
              {loading ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                <>
                  <span>Add Intance</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </Modal> */}

      <Box width={"100%"} className={`${currentMode}-mode-datatable`} sx={DataGridStyles}>
        <DataGrid
          autoHeight
          rows={pageState.data}
          onRowClick={handleRowClick}
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
          columns={columns}
          components={{
            Toolbar: GridToolbar,
            Pagination: CustomPagination,
          }}
          componentsProps={{
            toolbar: {
                                printOptions: { disableToolbarButton: User?.role !== 1 },
            csvOptions: { disableToolbarButton: User?.role !==  1},
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
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
        />
      </Box>
    </div>
  );
};

export default InstancesTable;
