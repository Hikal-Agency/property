import { useState, useEffect, useRef } from "react";
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
import { ticket_status, ticket_source } from "../_elements/SelectOptions";
import usePermission from "../../utils/usePermission";

const AllTickets = ({ value, setValue, categories }) => {
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
  const searchRef = useRef();
  const { hasPermission } = usePermission();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [btnloading, setBtnLoading] = useState(false);
  const [ticketNote, setTicketNote] = useState("");
  const [ticketCycle, setTicketCycle] = useState(false);
  const [supportUser, setSupportUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedAssigne, setSelectedAssigne] = useState(null);
  const [user, setUser] = useState([]);

  console.log("selectedUser: ", selectedUser);
  console.log("selectedCat: ", selectedCategory);
  console.log("selectedstatus: ", selectedStatus);
  console.log("selectedSource: ", selectedSource);
  console.log("selectedAssigne: ", selectedAssigne);

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
        `${BACKEND_URL}/ticketcycles`,
        { ticket_id: noteModal?.row?.id, description: ticketNote },
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
      field: "ticket_edit",
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
            {hasPermission("ticketcycles") && (
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
            )}
          </div>
        );
      },
    },
  ];

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const [ticketsResponse, supportResponse, userResponse] =
        await Promise.all([
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
          axios.get(`${BACKEND_URL}/users`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }),
        ]);

      console.log(
        "ticket and support users and users:: ",
        ticketsResponse,
        supportResponse,
        userResponse
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
      setUser(userResponse?.data?.managers?.data);

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

  const fetchSearchTickets = async () => {
    setLoading(true);

    const query = {};
    if (selectedStatus) query.status = selectedStatus?.value;
    if (selectedCategory) query.category = selectedCategory?.category;
    if (selectedAssigne) query.assigned_to = selectedAssigne?.id;
    if (selectedUser) query.added_by = selectedUser?.id;
    if (selectedSource) query.source = selectedSource?.value;

    try {
      const token = localStorage.getItem("auth-token");
      const filterTickets = await axios.get(`${BACKEND_URL}/tickets`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: query,
      });

      console.log("filteredtickets:: ", filterTickets);

      // Process tickets data
      const ticketsRowsList = filterTickets?.data?.tickets?.data.map((row) => ({
        ...row,
        creationDate: row.created_at || "-",
        userName: row.added_by_name || "-",
      }));
      setRows(ticketsRowsList);
      console.log("TicketRowslist: ", ticketsRowsList);

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

  useEffect(() => {
    fetchSearchTickets();
  }, [
    selectedUser,
    selectedAssigne,
    selectedCategory,
    selectedSource,
    selectedStatus,
  ]);

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
        {hasPermission("ticket_filter_user") && (
          <div style={{ position: "relative" }}>
            <Box className="m-1" sx={{ minWidth: "100px" }}>
              <Select
                label={t("ticket_filter_user")}
                placeholder={t("ticket_filter_user")}
                id="user_category"
                options={
                  user?.length > 0 &&
                  user?.map((user) => ({
                    value: user?.id,
                    label: user?.userName,
                  }))
                }
                isClearable
                value={{
                  value: selectedUser?.id || null,
                  label: selectedUser?.userName || t("ticket_filter_user"),
                }}
                onChange={(selectedUser) => {
                  console.log("onchange selected use: ", selectedUser);
                  // searchRef.current.querySelector("input").value = "";

                  if (selectedUser === null) {
                    setSelectedUser(null);
                    return;
                  }
                  const findUser = user?.find(
                    (user) => user.id === selectedUser.value
                  );

                  setSelectedUser(findUser || null);
                }}
                className="w-full"
                styles={{
                  ...selectBgStyles(
                    currentMode,
                    primaryColor,
                    blurDarkColor,
                    blurLightColor
                  ),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    display: selectedUser?.id ? "none" : "block",
                  }),
                  clearIndicator: (provided) => ({
                    ...provided,
                    display: selectedUser?.id ? "block" : "none",
                  }),
                }}
                menuPortalTarget={document.body}
                // styles={selectBgStyles(
                //   currentMode,
                //   primaryColor,
                //   blurDarkColor,
                //   blurLightColor
                // )}
              />
            </Box>
          </div>
        )}

        {/* Category  */}
        {hasPermission("ticket_filter_category") && (
          <Box className="m-1" sx={{ minWidth: "100px" }}>
            <Select
              placeholder={t("ticket_filter_category")}
              id="user_category"
              options={
                categories?.length > 0 &&
                categories?.map((cat) => ({
                  value: cat?.category,
                  label: cat?.category,
                }))
              }
              value={{
                value: selectedCategory?.category || null,
                label:
                  selectedCategory?.category || t("ticket_filter_category"),
              }}
              onChange={(selectedCategory) => {
                console.log("onchange selected category: ", selectedCategory);
                // searchRef.current.querySelector("input").value = "";

                if (selectedCategory === null) {
                  setSelectedCategory(null);
                  return;
                }

                setSelectedCategory(
                  categories?.find(
                    (cat) => cat.category === selectedCategory.value
                  )
                );
              }}
              className="w-full"
              isClearable
              menuPortalTarget={document.body}
              styles={{
                ...selectBgStyles(
                  currentMode,
                  primaryColor,
                  blurDarkColor,
                  blurLightColor
                ),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  display: selectedCategory?.category ? "none" : "block",
                }),
                clearIndicator: (provided) => ({
                  ...provided,
                  display: selectedCategory?.category ? "block" : "none",
                }),
              }}
            />
          </Box>
        )}

        {/* TICKET STATUS  */}
        {hasPermission("ticket_filter_status") && (
          <Box className="m-1" sx={{ minWidth: "100px" }}>
            <Select
              placeholder={t("ticket_filter_status")}
              id="ticket_status"
              options={ticket_status(t)?.map((status) => ({
                value: status?.value,
                label: status?.label,
              }))}
              value={{
                value: selectedStatus?.value || null,
                label: selectedStatus?.label || t("ticket_filter_status"),
              }}
              onChange={(selectedStatus) => {
                console.log("onchange selected status: ", selectedStatus);

                if (selectedStatus === null) {
                  setSelectedStatus(null);
                  return;
                }

                setSelectedStatus(
                  ticket_status(t)?.find(
                    (status) => status.value === selectedStatus.value
                  )
                );
              }}
              isClearable
              className="w-full"
              menuPortalTarget={document.body}
              styles={{
                ...selectBgStyles(
                  currentMode,
                  primaryColor,
                  blurDarkColor,
                  blurLightColor
                ),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  display: selectedStatus?.value ? "none" : "block",
                }),
                clearIndicator: (provided) => ({
                  ...provided,
                  display: selectedStatus?.value ? "block" : "none",
                }),
              }}
            />
          </Box>
        )}

        {/* TICKET SOURCE  */}
        {hasPermission("ticket_filter_source") && (
          <Box className="m-1" sx={{ minWidth: "100px" }}>
            <Select
              placeholder={t("ticket_filter_source")}
              id="ticket_status"
              options={ticket_source(t)?.map((status) => ({
                value: status?.value,
                label: status?.label,
              }))}
              value={{
                value: selectedSource?.value || null,
                label: selectedSource?.label || t("ticket_filter_source"),
              }}
              onChange={(selectedSource) => {
                console.log("onchange selected source: ", selectedSource);

                if (selectedSource === null) {
                  setSelectedSource(null);
                  return;
                }

                setSelectedSource(
                  ticket_source(t)?.find(
                    (source) => source.value === selectedSource.value
                  )
                );
              }}
              className="w-full"
              menuPortalTarget={document.body}
              isClearable
              styles={{
                ...selectBgStyles(
                  currentMode,
                  primaryColor,
                  blurDarkColor,
                  blurLightColor
                ),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  display: selectedSource?.value ? "none" : "block",
                }),
                clearIndicator: (provided) => ({
                  ...provided,
                  display: selectedSource?.value ? "block" : "none",
                }),
              }}
            />
          </Box>
        )}

        {/* TICKET ASSIGNE  */}
        {hasPermission("ticket_filter_assistant") && (
          <Box className="m-1" sx={{ minWidth: "100px" }}>
            <Select
              placeholder={t("ticket_filter_assigne")}
              id="ticket_status"
              options={supportUser?.map((support) => ({
                value: support?.id,
                label: support?.userName,
              }))}
              value={{
                value: selectedAssigne?.id || null,
                label: selectedAssigne?.userName || t("ticket_filter_assigne"),
              }}
              onChange={(selectedAssigne) => {
                console.log("onchange selected assigned: ", selectedAssigne);

                if (selectedAssigne === null) {
                  setSelectedAssigne(null);
                  return;
                }

                setSelectedAssigne(
                  supportUser?.find(
                    (support) => support?.id === selectedAssigne.value
                  )
                );
              }}
              className="w-full"
              isClearable
              menuPortalTarget={document.body}
              styles={{
                ...selectBgStyles(
                  currentMode,
                  primaryColor,
                  blurDarkColor,
                  blurLightColor
                ),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  display: selectedAssigne?.id ? "none" : "block",
                }),
                clearIndicator: (provided) => ({
                  ...provided,
                  display: selectedAssigne?.id ? "block" : "none",
                }),
              }}
            />
          </Box>
        )}
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
          // columns={columns}
          // columns={columns?.filter((c) => {
          //   if (
          //     c?.field === "ticket_col_assigned_to" ||
          //     c?.field === "ticket_col_edit"
          //   ) {
          //     hasPermission("ticket_col" + c?.field);
          //     return;
          //   } else {
          //     return c;
          //   }
          // })}
          columns={columns?.filter((c) => {
            console.log("columns:: ", c);
            if (c?.field === "assigned_to" || c?.field === "ticket_edit") {
              // return hasPermission("ticket_col" + c?.field);
              return hasPermission(c?.field);
            } else {
              return true; // Keep other columns
            }
          })}
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
