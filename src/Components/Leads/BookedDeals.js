import { Button } from "@material-tailwind/react";
import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  MenuItem,
  InputAdornment,
  TextField,
  FormControl,
  Tooltip,
} from "@mui/material";
import Select from "react-select";
import usePermission from "../../utils/usePermission";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import axios from "../../axoisConfig";
import { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { socket } from "../../Pages/App";

import Pagination from "@mui/material/Pagination";
import { langs } from "../../langCodes";
import SingleLead from "./SingleLead";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import RenderManagers from "./RenderManagers";
import UpdateBookedDeal from "./UpdateBookedDeal";
import RenderSalesperson from "./RenderSalesperson";
import RenderPriority from "./RenderPriority";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import Timeline from "../../Pages/timeline";

import {
  FaSnapchatGhost,
  FaFacebookF,
  FaTiktok,
  FaRegComments,
  FaUser,
  FaWhatsapp,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import { AiOutlineEdit, AiOutlineHistory } from "react-icons/ai";
import {
  BsPersonCircle,
  BsSnow2,
  BsShieldX,
  BsShieldCheck,
  BsShieldMinus,
} from "react-icons/bs";
import {
  BiSearch,
  BiImport,
  BiArchive,
  BiMessageRoundedDots,
} from "react-icons/bi";
import { IoIosAlert, IoMdClose } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { GiMagnifyingGlass } from "react-icons/gi";
import { MdCampaign } from "react-icons/md";
import {
  RxCheckCircled,
  RxCrossCircled,
  RxQuestionMarkCircled,
} from "react-icons/rx";
import { TbWorldWww } from "react-icons/tb";
import moment from "moment";
import DeleteLeadModel from "./DeleteLead";
import BookedDealsForm from "./BookedDealsForm";
import {
  pageStyles,
  renderStyles,
  renderStyles2,
} from "../_elements/SelectStyles";
import { renderOTPIcons } from "../_elements/OTPIconsDataGrid";
import { renderSourceIcons } from "../_elements/SourceIconsDataGrid";

const BookedDeals = ({
  BACKEND_URL,
  lead_type,
  lead_origin,
  leadCategory,
  DashboardData,
}) => {
  const { screenWidth, screenHeight } = useWindowSize();

  const token = localStorage.getItem("auth-token");
  const [singleLeadData, setsingleLeadData] = useState();
  const [filt, setFilt] = useState([]);
  const { hasPermission } = usePermission();
  const isBookedDeal = true;

  //eslint-disable-next-line
  const [deleteloading, setdeleteloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  //eslint-disable-next-line
  const [deletebtnloading, setdeletebtnloading] = useState(false);

  const dataTableRef = useRef();
  const searchRef = useRef();

  const getLangCode = (language) => {
    if (language) {
      const l = langs.find(
        (lang) =>
          lang["name"].toLowerCase() === String(language).toLowerCase() ||
          lang["nativeName"].toLowerCase() === String(language).toLowerCase()
      );
      if (l) {
        return l.code.toUpperCase();
      } else {
        return language === "null" ? "-" : language;
      }
    } else {
      return null;
    }
  };

  const {
    currentMode,
    pageState,
    setpageState,
    reloadDataGrid,
    setreloadDataGrid,
    DataGridStyles,
    setopenBackDrop,
    isArabic,
    User,
    Managers,
    primaryColor,
    t,
    feedbackTheme,
  } = useStateContext();
  const [LeadToDelete, setLeadToDelete] = useState();
  const [pageRange, setPageRange] = useState();

  const handleRangeChange = (e) => {
    const value = e.value;

    setPageRange(value);

    setpageState((old) => ({
      ...old,
      perpage: value,
    }));
  };

  //View LEAD MODAL VARIABLES
  const [LeadModelOpen, setLeadModelOpen] = useState(false);
  const handleLeadModelOpen = () => setLeadModelOpen(true);
  const handleLeadModelClose = () => setLeadModelOpen(false);
  const [timelineModelOpen, setTimelineModelOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [bookedForm, setBookedForm] = useState(false);

  //Update LEAD MODAL VARIABLES
  const [UpdateLeadModelOpen, setUpdateLeadModelOpen] = useState(false);
  const handleUpdateLeadModelOpen = () => setUpdateLeadModelOpen(true);
  const handleUpdateLeadModelClose = () => {
    setLeadModelOpen(false);
    setUpdateLeadModelOpen(false);
  };

  const HandleViewTimeline = (params) => {
    setsingleLeadData(params.row);
    setTimelineModelOpen(true);
  };

  const handleBookedFormClose = () => setBookedForm(false);
  const [newFeedback, setnewFeedback] = useState("");
  const [bookedData, setBookedData] = useState(null);

  const RenderFeedback = ({ cellValues }) => {
    const [Feedback, setFeedback] = useState(cellValues?.row?.feedback);
    // const [newFeedback, setnewFeedback] = useState("");
    const [DialogueVal, setDialogue] = useState(false);
    const [btnloading, setbtnloading] = useState(false);
    const [leadDateValue, setLeadDateValue] = useState({});
    const [leadDate, setLeadDate] = useState("");
    const [leadAmount, setLeadAmount] = useState("");
    const [unitNo, setUnitNo] = useState("");
    console.log("Feedback: ", Feedback);

    const ChangeFeedback = (e) => {
      setnewFeedback(e.value);
      if (e.value.toLowerCase() === "closed deal") {
        console.log("closed deal:::: ", e.value);
        setBookedData(cellValues?.row);
        setBookedForm(e.value);
        return;
      }
      setDialogue(true);
      return;
    };

    const UpdateFeedback = async (event) => {
      event.preventDefault();

      setbtnloading(true);
      const token = localStorage.getItem("auth-token");
      const UpdateLeadData = new FormData();
      // UpdateLeadData.append("lid", cellValues?.row?.lid);
      UpdateLeadData.append("id", cellValues?.row?.leadId);
      UpdateLeadData.append("feedback", newFeedback);
      UpdateLeadData.append("amount", leadAmount);
      UpdateLeadData.append("dealDate", leadDate);
      UpdateLeadData.append("unit", unitNo);

      await axios
        .post(
          `${BACKEND_URL}/leads/${cellValues?.row?.leadId}`,
          UpdateLeadData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((result) => {
          console.log("Feedback Updated successfull");
          console.log(result);
          toast.success("Feedback Updated Successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          // UpdateLeadFunc();
          setbtnloading(false);
          setFeedback(newFeedback);
          setreloadDataGrid(!reloadDataGrid);
          setDialogue(false);
          if (newFeedback === "Closed Deal") {
            socket.emit("notification_deal_close", {
              from: { id: User?.id },
              closedByName: User?.userName,
              project: cellValues?.row?.project,
              amount: leadAmount,
              participants: [
                cellValues?.row?.assignedToSales,
                User?.isParent,
                cellValues?.row?.assignedToManager,
              ],
            });
            setIsClosed(true);
            setTimeout(() => {
              setIsClosed(false);
            }, 10000);
          } else {
            socket.emit("notification_feedback_update", {
              from: { id: User?.id, userName: User?.userName },
              leadName: cellValues?.row?.leadName,
              newFeedback: newFeedback,
              participants: [
                cellValues?.row?.assignedToManager || 0,
                cellValues?.row?.assignedToSales || 0,
                Managers?.find(
                  (m) => m?.id === cellValues?.row?.assignedToManager
                )?.isParent,
              ],
            });
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error in Updating Feedback", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setbtnloading(false);
        });
    };

    return (
      <Box
        className={`renderDD w-full h-full flex items-center justify-center`}
      >
        {feedbackTheme === "renderStyles" ? (
          <Select
            id="feedback"
            value={Feedback ? { label: Feedback, value: Feedback } : null}
            onChange={(selectedOption) => ChangeFeedback(selectedOption)}
            // onChange={(selectedOption) => ChangeFeedback(selectedOption?.value || null)}
            options={[
              {
                label: t("feedback_booked"),
                value: "Booked",
                bgColor: "#81CA9D",
                color: "#000000",
              },
              {
                label: t("feedback_closed"),
                value: "Closed Deal",
                bgColor: "#00A650",
                color: "#FFFFFF",
              },
              {
                label: t("feedback_cancelled"),
                value: "Dead",
                bgColor: "#F16C4D",
                color: "#FFFFFF",
              },
            ]}
            placeholder={`---${t("label_select")?.toUpperCase()}---`}
            className="w-full"
            menuPortalTarget={document.body}
            styles={renderStyles(currentMode, primaryColor)}
          />
        ) : (
          <Select
            id="feedback"
            value={Feedback ? { label: Feedback, value: Feedback } : null}
            onChange={(selectedOption) => ChangeFeedback(selectedOption)}
            // onChange={(selectedOption) => ChangeFeedback(selectedOption?.value || null)}
            options={[
              {
                label: t("feedback_booked"),
                value: "Booked",
                bgColor: "#81CA9D",
                color: "#000000",
              },
              {
                label: t("feedback_closed"),
                value: "Closed Deal",
                bgColor: "#00A650",
                color: "#FFFFFF",
              },
              {
                label: t("feedback_cancelled"),
                value: "Dead",
                bgColor: "#F16C4D",
                color: "#FFFFFF",
              },
            ]}
            placeholder={`---${t("label_select")?.toUpperCase()}---`}
            className="w-full"
            menuPortalTarget={document.body}
            styles={renderStyles2(currentMode, primaryColor)}
          />
        )}
        {/* <FormControl sx={{ m: 1, minWidth: 80, border: 1, borderRadius: 1 }}>
          <Select
            id="feedback"
            value={Feedback}
            label={t("label_feedback")}
            onChange={ChangeFeedback}
            size="medium"
            className="w-[100%] h-[75%] border-none"
            displayEmpty
            sx={{
              color:
                currentMode === "dark"
                  ? "#ffffff !important"
                  : "#000000 !important",
              "& .MuiSelect-icon": {
                color:
                  currentMode === "dark"
                    ? "#ffffff !important"
                    : "#000000 !important",
              },
            }}
            required
          >
            <MenuItem value={null} disabled>
              ---{t("label_select")?.toUpperCase()}---
            </MenuItem>
            <MenuItem value={"Booked"}>{t("feedback_booked")}</MenuItem>
            <MenuItem value={"Closed Deal"}>{t("feedback_closed")}</MenuItem>
            <MenuItem value={"Dead"}>{t("feedback_cancelled")}</MenuItem>
          </Select>
        </FormControl> */}
        {DialogueVal && (
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
              open={DialogueVal}
              onClose={(e) => setDialogue(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <form action="" onSubmit={(event) => UpdateFeedback(event)}>
                <IconButton
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: 10,
                    color: (theme) => theme.palette.grey[500],
                  }}
                  onClick={() => setDialogue(false)}
                >
                  <IoMdClose size={18} />
                </IconButton>
                <div className="px-10 py-5">
                  <div className="flex flex-col justify-center items-center">
                    <IoIosAlert size={50} className="text-primary text-2xl" />
                    <h1 className="font-semibold pt-3 text-lg text-center">
                      {t("want_to_change_feedback")} {t("from")}
                      <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                        {Feedback
                          ? t(
                              "feedback_" +
                                Feedback?.toLowerCase()?.replaceAll(" ", "_")
                            )
                          : t("no_feedback")}
                      </span>{" "}
                      {t("to")}{" "}
                      <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                        {newFeedback
                          ? t(
                              "feedback_" +
                                newFeedback?.toLowerCase()?.replaceAll(" ", "_")
                            )
                          : t("no_feedback")}
                      </span>{" "}
                      ?
                    </h1>
                    {newFeedback.toLowerCase() === "closed deal" && (
                      <div className="grid sm:grid-cols-1 gap-5 mt-5">
                        <div className="flex flex-col justify-center items-center gap-4">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label={t("label_deal_date")}
                              value={leadDateValue}
                              views={["year", "month", "day"]}
                              required
                              maxDate={new Date()}
                              onChange={(newValue) => {
                                setLeadDateValue(newValue);

                                const formattedDate = moment(
                                  newValue?.$d
                                ).format("YYYY-MM-DD");
                                setLeadDate(formattedDate);
                              }}
                              format="yyyy-MM-dd"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  onKeyDown={(e) => e.preventDefault()}
                                  readOnly={true}
                                  size="small"
                                  required
                                />
                              )}
                            />
                          </LocalizationProvider>
                          <TextField
                            required
                            fullWidth
                            label={t("label_closed_amount")}
                            size="small"
                            value={leadAmount}
                            onChange={(e) => {
                              setLeadAmount(e.target.value);
                            }}
                          />
                          <TextField
                            required
                            fullWidth
                            label={t("label_unit")}
                            size="small"
                            value={unitNo}
                            onChange={(e) => {
                              setUnitNo(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                    <Button
                      className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                      ripple={true}
                      size="lg"
                      type="submit"
                    >
                      {btnloading ? (
                        <CircularProgress size={18} sx={{ color: "white" }} />
                      ) : (
                        <span>{t("confirm")}</span>
                      )}
                    </Button>
                    <Button
                      onClick={() => setDialogue(false)}
                      ripple={true}
                      variant="outlined"
                      className={`shadow-none px-3 rounded-md text-sm  ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-primary border-primary"
                      }`}
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </form>
            </Dialog>
          </>
        )}
      </Box>
    );
  };

  // const deleteLead = async (lid) => {
  //   setdeleteloading(true);
  //   setdeletebtnloading(true);
  //   axios
  //     .delete(`${BACKEND_URL}/leads/${lid}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token,
  //       },
  //     })
  //     .then((result) => {
  //       console.log(result);
  //       setdeleteloading(false);
  //       setdeletebtnloading(false);
  //       setreloadDataGrid(!reloadDataGrid);
  //       FetchLeads(token);
  //       setDeleteModelOpen(false);
  //       fetchSidebarData();
  //       toast.success("Lead Deleted Successfull", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //       handleLeadModelClose();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setdeleteloading(false);
  //       setdeletebtnloading(false);
  //       toast.error("Something Went Wrong! Please Try Again", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //     });
  // };

  const columns = [
    {
      field: "id",
      headerName: "#",
      minWidth: 40,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <small>
            <strong>{cellValues?.formattedValue}</strong>
          </small>
        );
      },
    },

    {
      field: "leadName",
      headerAlign: "center",
      headerName: t("label_lead_name"),
      minWidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full ">
            <p
              style={{
                fontFamily: isArabic(cellValues?.formattedValue)
                  ? "Noto Kufi Arabic"
                  : "inherit",
              }}
            >
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    {
      field: "leadContact",
      headerName: t("label_contact"),
      minWidth: 100,
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const contactNumber = params.getValue(params.id, "leadContact");
        // const countryCode = `(+${contactNumber.slice(0, 1)} ${contactNumber.slice(1, 3)})`;

        // Replace last 4 digits with "*"
        const stearics =
          contactNumber
            ?.replaceAll(" ", "")
            ?.slice(0, contactNumber?.replaceAll(" ", "")?.length - 4) + "****";
        let finalNumber;

        if (hasPermission("number_masking")) {
          if (User?.role === 1) {
            finalNumber = contactNumber?.replaceAll(" ", "");
          } else {
            finalNumber = `${stearics}`;
          }
        } else {
          finalNumber = contactNumber?.replaceAll(" ", "");
        }

        return <span>{finalNumber}</span>;
      },
    },
    {
      field: "project",
      headerName: t("label_project"),
      headerAlign: "center",
      minWidth: 80,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div
            style={{
              fontFamily: isArabic(cellValues?.formattedValue)
                ? "Noto Kufi Arabic"
                : "inherit",
            }}
            className="flex flex-col"
          >
            <p>
              {cellValues.row.project === "null" ? "-" : cellValues.row.project}
            </p>
            <p>
              {cellValues.row.leadFor === "null" ? "-" : cellValues.row.leadFor}
            </p>
          </div>
        );
      },
    },
    {
      headerAlign: "center",
      field: "leadType",
      headerName: t("label_property"),
      minWidth: 80,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-col">
            <p>
              {cellValues.row.enquiryType === "null"
                ? "-"
                : cellValues.row.enquiryType}
            </p>
            <p>
              {cellValues.row.leadType === "null"
                ? "-"
                : cellValues.row.leadType}
            </p>
          </div>
        );
      },
    },
    {
      headerAlign: "center",
      field: "assignedToManager",
      headerName: t("label_manager"),
      minWidth: 120,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderManagers cellValues={cellValues} />,
    },
    {
      headerAlign: "center",
      field: "assignedToSales",
      headerName: t("label_agent"),
      minWidth: 120,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderSalesperson cellValues={cellValues} />,
    },
    {
      field: "feedback",
      headerAlign: "center",
      headerName: t("label_feedback"),
      minWidth: 120,
      flex: 1,

      hideable: false,
      renderCell: (cellValues) => <RenderFeedback cellValues={cellValues} />,
    },
    {
      field: "priority",
      headerName: t("label_priority"),
      minWidth: 90,
      headerAlign: "center",
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderPriority cellValues={cellValues} />,
    },
    {
      field: "booked_date",
      headerAlign: "center",
      headerName: t("booking_date"),
      minWidth: 90,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex items-center justify-center">
            {cellValues.row.booked_amount === null ||
            cellValues.row.booked_amount === "null" ||
            cellValues.row.booked_amount === "" ? (
              <>-</>
            ) : (
              <>{cellValues.row.booked_date}</>
            )}
          </div>
        );
      },
    },
    {
      field: "booked_amount",
      headerAlign: "center",
      headerName: t("label_amount_aed"),
      minWidth: 90,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex items-center justify-center">
            {cellValues.row.booked_amount === null ||
            cellValues.row.booked_amount === "null" ||
            cellValues.row.booked_amount === "" ? (
              <>-</>
            ) : (
              <>{cellValues.row.booked_amount}</>
            )}
          </div>
        );
      },
    },
    {
      field: "otp",
      headerName:
        lead_origin === "transfferedleads"
          ? t("label_transferred_from")
          : t("label_otp"),
      minWidth: 30,
      headerAlign: "center",
      // headerClassName: headerClasses.header,
      headerClassName: "break-normal",
      flex: 1,
      renderCell: (cellValues) => renderOTPIcons(cellValues, currentMode),
    },

    {
      field: "leadSource",
      headerName: t("lead_source"),
      flex: 1,
      minWidth: 40,
      headerAlign: "center",
      renderCell: (cellValues) => renderSourceIcons(cellValues, currentMode),
    },
    {
      field: "language",
      headerName: t("label_language"),
      headerAlign: "center",
      minWidth: 30,
      flex: 1,
    },

    {
      field: "edit",
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
            // className={`deleteLeadBtn edit-lead-btns space-x-1 w-full flex items-center justify-center`}
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-[#229eca] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="Edit Booked Deal" arrow>
                <button onClick={() => HandleEditFunc(cellValues)}>
                  <AiOutlineEdit size={16} />
                </button>
              </Tooltip>
            </p>

            {cellValues.row.leadId !== null && (
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

  const FetchLeads = async (token) => {
    console.log("lead type is");
    console.log(lead_type);
    let FetchLeads_url = "";
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&perpage=${pageState.perpage}&feedback=Booked`;

    axios
      .get(FetchLeads_url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(async (result) => {
        console.log("Booked deals list: ", result);
        let rowsDataArray = "";
        if (result.data.coldLeads.current_page > 1) {
          const theme_values = Object.values(result.data.coldLeads.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = result.data.coldLeads.data;
        }

        let rowsdata = rowsDataArray.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          creationDate: row?.creationDate,
          leadName: row?.leadName || "-",
          leadContact: row?.leadContact?.replaceAll(" ", "") || "-",
          project: row?.project || "-",
          enquiryType: row?.enquiryType || "-",
          leadType: row?.leadType || "-",
          assignedToManager: row.assignedToManager,
          assignedToSales: row.assignedToSales,
          feedback: row?.feedback,
          priority: row?.priority,
          language: getLangCode(row?.language) || "-",
          leadSource: row?.leadSource || "-",
          booked_amount: row?.booked_amount || "",
          booked_date: row?.booked_date || "-",
          lid: row?.lid,
          firstAssigned: row?.firstAssigned || "",
          leadId: row?.id,
          lastEdited: row?.lastEdited,
          //eslint-disable-next-line
          project: row?.project || "-",
          leadFor: row?.leadFor,
          coldCall: row?.coldcall,
          leadStatus: row?.leadStatus || "-",
          leadCategory: leadCategory || "-",
          notes: row?.notes || "-",
          otp:
            row?.otp === "No OTP" || row?.otp === "No OTP Used"
              ? "No OTP Used"
              : row?.otp || "No OTP Used",
          edit: "edit",
        }));

        // count of leads per source
        const facebook = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "campaign facebook"
        );
        const fbCounts = facebook.length;

        const snapchat = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "campaign snapchat"
        );
        const spCount = snapchat.length;

        const tiktok = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "campaign tiktok"
        );
        const ttCount = tiktok.length;

        const googleads = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "campaign googleads"
        );
        const gCount = googleads.length;

        const youtube = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "campaign youtube"
        );
        const yCount = youtube.length;

        const campaign = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "campaign"
        );
        const cCount = campaign.length;

        const cold = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "cold"
        );
        const coCount = cold.length;

        const personal = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "personal"
        );
        const pCount = personal.length;

        const message = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "Message"
        );
        const mCount = message.length;

        const whatsapp = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "Whatsapp"
        );
        const wCount = whatsapp.length;

        const comment = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "Comment"
        );
        const comCount = comment.length;

        setpageState((old) => ({
          ...old,
          fbCounts: fbCounts,
          spCount: spCount,
          ttCount: ttCount,
          gCount: gCount,
          yCount: yCount,
          cCount: cCount,
          pCount: pCount,
          coCount: coCount,
          mCount: mCount,
          wCount: wCount,
          comment: wCount,
          isLoading: false,
          data: rowsdata,
          from: result.data.coldLeads.from,
          to: result.data.coldLeads.to,
          pageSize: result.data.coldLeads.per_page,
          total: result.data.coldLeads.total,
        }));

        console.log("Page state: ", pageState.total);
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
      });
  };

  const FetchSearchedLeads = async (token, term) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    let coldCallCode = "";
    if (lead_origin === "freshleads") {
      coldCallCode = 0;
    } else if (lead_origin === "coldleads") {
      coldCallCode = 1;
    } else if (lead_origin === "thirdpartyleads") {
      coldCallCode = 3;
    } else if (lead_origin === "personalleads") {
      coldCallCode = 2;
    } else if (lead_origin === "warmleads") {
      coldCallCode = 4;
    } else if (lead_origin === "transfferedleads") {
      coldCallCode = 0;
    }

    let url = `${BACKEND_URL}/search?title=${term}&page=${pageState.page}`;

    if (lead_type) {
      if (
        lead_type !== "all" &&
        lead_type !== "coldLeadsVerified" &&
        lead_type !== "coldLeadsInvalid" &&
        lead_type !== "coldLeadsNotChecked"
      ) {
        url += `&feedback=${lead_type}`;
      }
    }

    if (lead_type === "coldLeadsVerified") {
      url += `&is_whatsapp=1`;
    } else if (lead_type === "coldLeadsInvalid") {
      url += `&is_whatsapp=2`;
    } else if (lead_type === "coldLeadsNotChecked") {
      url += `&is_whatsapp=0`;
    }

    if (coldCallCode !== "") {
      url += `&coldCall=${coldCallCode}`;
    }

    if (lead_origin === "transfferedleads") {
      url += `&status=Transferred`;
    }

    await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("search result is");
        console.log(result.data);
        let rowsdata = result.data.result.data.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          leadId: row?.id,
          creationDate: row?.creationDate,
          leadName: row?.leadName || "-",
          leadContact: row?.leadContact?.slice(1)?.replaceAll(" ", "") || "-",
          project: row?.project || "-",
          enquiryType: row?.enquiryType || "-",
          leadType: row?.leadType || "-",
          assignedToManager: row?.assignedToManager || null,
          assignedToSales: row?.assignedToSales || null,
          feedback: row?.feedback || null,
          priority: row?.priority || null,
          language: getLangCode(row?.language) || "-",
          leadSource: row?.leadSource || "-",
          booked_amount: row?.booked_amount || "-",
          lid: row?.lid || "-",
          firstAssigned: row?.firstAssigned || "",
          lastEdited: row?.lastEdited || "-",
          leadFor: row?.leadFor || "-",
          leadStatus: row?.leadStatus || "-",
          coldCall: row?.coldcall,
          leadCategory: leadCategory || "-",
          notes: row?.notes || "-",
          otp:
            row?.otp === "No OTP" || row?.otp === "No OTP Used"
              ? "No OTP Used"
              : row?.otp || "No OTP Used",
          edit: "edit",
        }));
        setpageState((old) => ({
          ...old,
          data: rowsdata,
          pageSize: result.data.result.per_page,
          total: result.data.result.total,
        }));
        setpageState((old) => ({
          ...old,
          isLoading: false,
        }));
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setpageState((oldPageState) => ({ ...oldPageState, page: 1 }));
      FetchLeads(token);
    }
    // setSearchTerm(e.target.value);
  };

  const handleKeyUp = (e) => {
    if (searchRef.current.querySelector("input").value) {
      if (e.key === "Enter" || e.keyCode === 13) {
        setpageState((oldPageState) => ({ ...oldPageState, page: 1 }));
        FetchSearchedLeads(token, e.target.value);
      }
    }
  };

  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = async (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    setopenBackDrop(false);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (searchTerm) {
      FetchSearchedLeads(token, searchTerm);
    } else {
      FetchLeads(token);
    }
    // setCEOColumns([...CEOColumns]);
    // eslint-disable-next-line
  }, [pageState.page, pageState.perpage, lead_type, reloadDataGrid]);

  useEffect(() => {
    setpageState((oldPageState) => ({ ...oldPageState, page: 0 }));
    searchRef.current.querySelector("input").value = "";
  }, [lead_type, lead_origin]);

  // ROW CLICK FUNCTION
  const handleRowClick = (params, event) => {
    if (
      !event.target.closest(".deleteLeadBtn") &&
      !event.target.closest(".renderDD")
    ) {
      setsingleLeadData(params.row);
      handleLeadModelOpen();
    }
  };
  // EDIT BTN CLICK FUNC
  const HandleEditFunc = async (params) => {
    console.log(params.row);
    setsingleLeadData(params.row);
    handleUpdateLeadModelOpen();
    setUpdateLeadModelOpen(true);
  };
  // Delete Lead

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

          <p className="mr-3">Rows Per Page</p>

          <Select
            id="select-page-size-label"
            value={{ label: pageState.pageSize, value: pageState.pageSize }}
            onChange={handleRangeChange}
            options={[14, 30, 50, 75, 100].map((size) => ({
              label: size,
              value: size,
            }))}
            className="min-w-[60px] my-2"
            menuPortalTarget={document.body}
            styles={pageStyles(currentMode, primaryColor)}
          />

          {/* <Select
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
            {[14, 30, 50, 75, 100].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select> */}

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
            onChange={(event, value) => apiRef?.current?.setPage(value - 1)}
          />
        </div>
      </>
    );
  }

  return (
    <div className="pb-10">
      {isClosed ? (
        <Confetti width={screenWidth} height={screenHeight} />
      ) : (
        <></>
      )}
      <Box sx={{ ...DataGridStyles, position: "relative", marginBottom: 50 }}>
        <div className="absolute top-[7px] right-[20px] z-[5]">
          <TextField
            placeholder={t("search") + ".."}
            ref={searchRef}
            sx={{
              "& input": {
                borderBottom: "2px solid #ffffff6e",
              },
            }}
            variant="standard"
            onKeyUp={handleKeyUp}
            onInput={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton sx={{ padding: 0 }}>
                    <BiSearch size={17} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div
          className={`${currentMode}-mode-datatable`}
          style={{ position: "relative" }}
        >
          <DataGrid
            disableDensitySelector
            initialState={{
              columns: {
                columnVisibilityModel: {
                  creationDate: false,
                  otp: false,
                  language: false,
                },
              },
            }}
            ref={dataTableRef}
            autoHeight
            disableSelectionOnClick
            rows={pageState.data}
            onRowClick={handleRowClick}
            rowCount={pageState.total}
            loading={pageState.isLoading}
            rowsPerPageOptions={[30, 50, 75, 100]}
            pagination
            width="auto"
            paginationMode="server"
            page={pageState.page - 1}
            disableColumnFilter
            pageSize={pageState.pageSize}
            onPageChange={(newPage) => {
              setpageState((old) => ({ ...old, page: newPage + 1 }));
            }}
            onPageSizeChange={(newPageSize) =>
              setpageState((old) => ({ ...old, pageSize: newPageSize }))
            }
            columns={columns?.filter((c) =>
              hasPermission("leads_col_" + c?.field)
            )}
            filterModel={{
              items: filt,
            }}
            components={{
              Toolbar: GridToolbar,
              Pagination: CustomPagination,
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: false,
                printOptions: { disableToolbarButton: User?.role !== 1 },
                csvOptions: { disableToolbarButton: User?.role !== 1 },
              },
            }}
            sx={{
              boxShadow: 2,
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
        </div>

        {timelineModelOpen && (
          <Timeline
            timelineModelOpen={timelineModelOpen}
            handleCloseTimelineModel={() => setTimelineModelOpen(false)}
            LeadData={singleLeadData}
          />
        )}

        {!UpdateLeadModelOpen && (
          <SingleLead
            setLeadToDelete={setLeadToDelete}
            LeadModelOpen={LeadModelOpen}
            setLeadModelOpen={setLeadModelOpen}
            handleLeadModelOpen={handleLeadModelOpen}
            handleLeadModelClose={handleLeadModelClose}
            handleUpdateLeadModelOpen={handleUpdateLeadModelOpen}
            handleUpdateLeadModelClose={handleUpdateLeadModelClose}
            LeadData={singleLeadData}
            isBookedDeal={isBookedDeal}
          />
        )}

        {UpdateLeadModelOpen && (
          <UpdateBookedDeal
            LeadModelOpen={UpdateLeadModelOpen}
            setLeadModelOpen={setUpdateLeadModelOpen}
            handleLeadModelOpen={handleUpdateLeadModelOpen}
            handleLeadModelClose={handleUpdateLeadModelClose}
            LeadData={singleLeadData}
            BACKEND_URL={BACKEND_URL}
            FetchLeads={FetchLeads}
          />
        )}

        {bookedForm && (
          <BookedDealsForm
            BookedForm={bookedForm}
            handleBookedFormClose={handleBookedFormClose}
            newFeedback={newFeedback}
            Feedback={bookedData}
            FetchLeads={FetchLeads}
          />
        )}
      </Box>
    </div>
  );
};

export default BookedDeals;
