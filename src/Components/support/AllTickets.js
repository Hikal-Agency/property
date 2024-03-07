import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { DataGrid } from "@mui/x-data-grid";

import axios from "../../axoisConfig";
import { useNavigate } from "react-router-dom";
import UpdateTicketSelect from "./UpdateTicketSelect";
import { AiOutlineEdit, AiOutlineHistory } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import TicketCycle from "./TicketCycle";
import UpdateAssigneSelect from "./UpdateAssigneSelect";
import Select from "react-select";
import { selectBgStyles, pageStyles } from "../_elements/SelectStyles";

const AllTickets = ({ value, setValue }) => {
  const {
    currentMode,
    DataGridStyles,
    BACKEND_URL,
    User,
    darkModeColors,
    t,
    blurDarkColor,
    blurLightColor,
    primaryColor,
  } = useStateContext();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [btnloading, setBtnLoading] = useState(false);
  const [ticketNote, setTicketNote] = useState("");
  const [ticketCycle, setTicketCycle] = useState(false);
  const [supportUser, setSupportUser] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");

  // ROW CLICK FUNCTION
  const handleRowClick = async (params, event) => {
    if (!event.target.closest(".action")) {
      console.log("ID: ", params?.id);
      const ticketId = params?.id;
      navigate(`/support/singleTicket/${ticketId}`);
    }
  };

  const HandleViewTimeline = (params) => {
    setTicketCycle(params.row);
  };

  const addNote = async (e, noteModal) => {
    e.preventDefault();
    console.log("notemodal::: ", noteModal);
    setBtnLoading(true);

    if (!ticketNote) {
      toast.error("Notes field cannot be empty.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setBtnLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/tickets/${noteModal?.row?.id}`,
        { description: ticketNote },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Note added::: ", response);

      setBtnLoading(false);

      toast.success("Note added successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setNoteModal(false);
      setTicketNote("");
      fetchTickets();
    } catch (error) {
      setBtnLoading(false);
      console.log("Error::: ", error);
      toast.error("Unable to add the note.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const columns = [
    {
      field: "creationDate",
      headerName: t("ticket_date"),
      headerAlign: "center",
      editable: false,
      minWidth: 60,
      flex: 1,
    },
    {
      field: "userName",
      headerName: t("label_user_name"),
      headerAlign: "center",
      editable: false,
      minWidth: 120,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full ">
            <p className="text-center capitalize">
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    {
      field: "category",
      headerName: t("label_category"),
      headerAlign: "center",
      editable: false,
      minWidth: 40,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center capitalize">
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    {
      field: "description",
      headerName: t("description"),
      headerAlign: "center",
      editable: false,
      minWidth: 150,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center capitalize">
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    {
      field: "issue",
      headerName: t("label_issue"),
      headerAlign: "center",
      editable: false,
      minWidth: 130,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full ">
            <p className="text-center capitalize">
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
      hide: !(User?.role === 1),
    },

    {
      field: "assigned_to",
      headerName: t("ticket_label_assign"),
      // width: 150,
      minWidth: 170,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => (
        <UpdateAssigneSelect
          cellValues={cellValues}
          supportUser={supportUser}
          setSupportUser={setSupportUser}
        />
      ),
    },
    {
      field: "edit",
      headerName: "Update Status",
      // width: 150,
      minWidth: 170,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => (
        <UpdateTicketSelect cellValues={cellValues} />
      ),
    },
    {
      field: "action",
      headerName: t("label_action"),
      flex: 1,
      minWidth: 100,
      maxWidth: "auto",
      sortable: false,
      filterable: false,
      headerAlign: "center",

      renderCell: (cellValues) => {
        return (
          <div
            className={`action w-full h-full px-1 flex items-center justify-center`}
          >
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-[#229eca] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="Add notes" arrow>
                <button onClick={() => setNoteModal(cellValues)}>
                  <FiEdit size={16} />
                </button>
              </Tooltip>
            </p>

            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-[#6a5acd] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="View Timeline" arrow>
                <button onClick={() => HandleViewTimeline(cellValues)}>
                  <AiOutlineHistory size={16} />
                </button>
              </Tooltip>
            </p>
          </div>
        );
      },
    },
  ];

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const [ticketsResponse, supportResponse] = await Promise.all([
        axios.get(`${BACKEND_URL}/tickets`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
        axios.get(`${BACKEND_URL}/supportusers`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
      ]);

      console.log(
        "ticket and support users:: ",
        ticketsResponse,
        supportResponse
      );

      // Process tickets data
      const ticketsRowsList = ticketsResponse.data.tickets.data.map((row) => ({
        ...row,
        creationDate: row.created_at || "-",
        userName: row.added_by_name || "-",
      }));
      setRows(ticketsRowsList);
      console.log("TicketRowslist: ", ticketsRowsList);

      setSupportUser(supportResponse?.data?.support);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Unable to fetch data.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div
      className={`${
        currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"
      } rounded-md`}
    >
      <Box
        sx={{
          // darkModeColors,
          ...darkModeColors,
          marginTop: "5px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "end",
          "& .MuiSelect-select": {
            padding: "2px",
            paddingLeft: "6px !important",
            paddingRight: "20px",
            borderRadius: "8px",
          },
          "& .MuiInputBase-root": {
            width: "max-content",
            marginRight: "5px",
          },
          "& input": {
            paddingTop: "0",
          },
          "& .applied-filter": {
            background: primaryColor,
            borderRadius: 4,
            width: "max-content",
            padding: "3px 8px",
            color: "white",
            marginRight: "0.25rem",
          },
          "& .applied-filter span": {
            marginRight: "3px",
          },
        }}
        className={"items-center mb-1"}
      >
        {/* User  */}
        <Box className="m-1" sx={{ minWidth: "100px" }}>
          <Select
            id="user_category"
            // options={leadOrigins.map((origin) => ({
            //   value: origin.id,
            //   label: t("origin_" + origin.id),
            // }))}
            // value={{
            //   value: leadOriginSelected?.id || "hotleads",
            //   label: t("origin_" + (leadOriginSelected?.id || "hotleads")),
            // }}
            // onChange={(selectedOption) => {
            //   searchRef.current.querySelector("input").value = "";
            //   setLeadOriginSelected(
            //     leadOrigins.find((origin) => origin.id === selectedOption.value)
            //   );
            // }}
            className="w-full"
            menuPortalTarget={document.body}
            styles={selectBgStyles(
              currentMode,
              primaryColor,
              blurDarkColor,
              blurLightColor
            )}
          />
        </Box>
      </Box>

      <Box
        width={"100%"}
        className={`${currentMode}-mode-datatable`}
        sx={DataGridStyles}
      >
        <DataGrid
          disableDensitySelector
          autoHeight
          onRowClick={handleRowClick}
          disableSelectionOnClick
          rowsPerPageOptions={[30, 50, 75, 100]}
          pagination
          loading={loading}
          width="auto"
          paginationMode="server"
          rows={rows}
          columns={columns}
          componentsProps={{
            toolbar: {
              showQuickFilter: false,
              printOptions: { disableToolbarButton: User?.role !== 1 },
              csvOptions: { disableToolbarButton: User?.role !== 1 },
              // value: searchText,
              // onChange: HandleQuicSearch,
            },
          }}
          // checkboxSelection
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
      {noteModal && (
        <>
          <Dialog
            sx={{
              "& .MuiPaper-root": {
                boxShadow: "none !important",
              },
              "& .MuiBackdrop-root, & .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop":
                {
                  backgroundColor: "rgba(0, 0, 0, 0.6) !important",
                },
            }}
            open={noteModal}
            onClose={(e) => setNoteModal(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <IconButton
              sx={{
                position: "absolute",
                right: 12,
                top: 10,
                color: (theme) => theme.palette.grey[500],
              }}
              onClick={() => setNoteModal(false)}
            >
              <IoMdClose size={18} />
            </IconButton>
            <div className="px-10 py-5">
              <div className="flex items-center mb-6  w-full">
                <div className="bg-primary h-10 w-1 mr-2 rounded-full"></div>
                <div>
                  <h1 className="font-semibold pt-3 text-lg text-center">
                    {t("ticket_add_note_label")}
                  </h1>
                </div>
              </div>
              <TextField
                id="issue"
                type={"text"}
                label={t("menu_notes")}
                className="w-full mb-5"
                style={{ marginBottom: "20px" }}
                variant="outlined"
                size="medium"
                required
                onChange={(e) => setTicketNote(e.target.value)}
                value={ticketNote}
                multiline
                maxRows={6}
              />
              <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                <Button
                  className={`bg-btn-primary text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
                  ripple={true}
                  size="lg"
                  onClick={(e) => addNote(e, noteModal)}
                >
                  {btnloading ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  ) : (
                    <span className="text-white">
                      {t("ticket_add_note_label")}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </Dialog>
        </>
      )}

      {ticketCycle && (
        <TicketCycle
          ticketCycle={ticketCycle}
          setTicketCycle={setTicketCycle}
        />
      )}
    </div>
  );
};

export default AllTickets;
