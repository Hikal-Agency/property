import { useRef } from "react";
import {
  Button,
  Box,
  Select,
  MenuItem,
  Alert,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import "./messages.css";

import axios from "../../axoisConfig";
import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { langs } from "../../langCodes";
import SendMessageModal from "../../Components/whatsapp-marketing/SendMessageModal";
import MessageLogs from "../../Components/whatsapp-marketing/MessageLogs";
import usePermission from "../../utils/usePermission";
import FiltersDropdown from "../../Components/whatsapp-marketing/FiltersDropdown";
import AddLeadModal from "../../Components/whatsapp-marketing/AddLeadModal";
import ConfirmBulkDelete from "../../Components/whatsapp-marketing/ConfirmBulkDelete";
import Coin from "../../Components/_elements/Coin";

import {
  BiImport,
  BiMessageRoundedDots,
  BiArchive,
  BiMailSend,
  BiPhoneCall,
  BiLogoWhatsapp,
} from "react-icons/bi";
import {
  BsWhatsapp,
  BsTrash,
  BsPersonCircle,
  BsSnow2,
  BsShieldX,
  BsShieldCheck,
  BsShieldMinus,
  BsCoin,
  BsPersonAdd,
} from "react-icons/bs";
import {
  FaSnapchatGhost,
  FaFacebookF,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
  FaTwitter,
  FaUser,
  FaRegComments,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { GiMagnifyingGlass } from "react-icons/gi";
import { GrFormAdd } from "react-icons/gr";
import { HiMail, HiPhoneOutgoing } from "react-icons/hi";
import { IoMdChatboxes } from "react-icons/io";
import { MdSms, MdCampaign } from "react-icons/md";
import { RiMailSendFill } from "react-icons/ri";
import { TbWorldWww } from "react-icons/tb";
import PurchaseCreditsModal from "../../Components/whatsapp-marketing/purchaseCredits";

// import "../../styles/animation.css";

const AllLeads = () => {
  const {
    currentMode,
    pageState,
    setpageState,
    reloadDataGrid,
    DataGridStyles,
    setopenBackDrop,
    BACKEND_URL,
    darkModeColors,
    Managers,
    SalesPerson,
    formatNum,
    User,
    userCredits,
    isArabic,
  } = useStateContext();
  console.log("Managers: ", Managers);
  const token = localStorage.getItem("auth-token");
  const [selectedRows, setSelectedRows] = useState([]);
  const [otpSelected, setOtpSelected] = useState({ id: 0 });
  const [phoneNumberFilter, setPhoneNumberFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [toRange, setToRange] = useState("");
  const [fromRange, setFromRange] = useState("");
  const [startDate, setStartDate] = useState("");
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState();
  const [endDate, setEndDate] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [leadOriginSelected, setLeadOriginSelected] = useState({
    id: "hotleads",
    formattedValue: "Fresh Leads",
  });
  const [leadTypeSelected, setLeadTypeSelected] = useState({
    id: "all",
    formattedValue: "All",
  });
  const selectionModelRef = useRef([]);
  const [enquiryTypeSelected, setEnquiryTypeSelected] = useState({ id: 0 });
  const [managerSelected, setManagerSelected] = useState("");
  const [agentSelected, setAgentSelected] = useState("");
  const [projectNameTyped, setProjectNameTyped] = useState("");
  const [managers, setManagers] = useState(Managers || []);
  const [agents, setAgents] = useState(SalesPerson || {});
  const [pageRange, setPageRange] = useState();
  const [error, setError] = useState(false);
  const [purchaseCreditsModal, setPurchaseCreditsModal] = useState(false);
  const { hasPermission } = usePermission();

  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);

  const [openMessageModal, setOpenMessageModal] = useState({
    open: false,
    isWhatsapp: false,
  });
  const [messageLogsModal, setMessageLogsModal] = useState({
    isOpen: false,
    data: {},
  });
  const [whatsappSenderNo, setWhatsappSenderNo] = useState("");

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
        return "Invalid";
      }
    } else {
      return null;
    }
  };

  // const [openMessageModal, setOpenMessageModal] = useState(false);
  const handleRangeChange = (e) => {
    setError(false);
    const value = e.target.value;

    if (value === "" || (value >= 10 && value <= 1000)) {
      setPageRange(value);

      setError(false);

      setpageState((old) => ({
        ...old,
        perpage: value,
      }));
    } else {
      setError("Value out of range (10-150)");
    }
  };

  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      field: "id",
      headerName: "#",
      minWidth: 40,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return <strong>{cellValues?.formattedValue}</strong>;
      },
    },

    {
      field: "leadName",
      headerAlign: "center",
      headerName: "Name",
      minWidth: 130,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full text-start px-2">
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
      headerName: "Phone",
      minWidth: 130,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "language",
      headerName: "Language",
      headerAlign: "center",
      minWidth: 30,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.formattedValue === "null"
              ? "-"
              : cellValues.formattedValue}
          </>
        );
      },
    },
    {
      field: "otp",
      headerName:
        leadOriginSelected?.id === "transfferedleads" ? "Ex-Agent" : "OTP",
      minWidth: 50,
      headerAlign: "center",
      // headerClassName: headerClasses.header,
      headerClassName: "break-normal",
      flex: 1,
      renderCell: (cellValues) => {
        if (leadOriginSelected?.id === "transfferedleads") {
          return (
            <div style={{ fontSize: 11 }}>
              <p>{cellValues.row.transferredFromName || "-"}</p>
            </div>
          );
        } else {
          return (
            <div className="p-1 rounded-md">
              {cellValues.formattedValue === "Verified" && (
                <Tooltip title="Verified" arrow>
                  <div
                    className={`mx-1 w-full h-full flex justify-center items-center text-center`}
                  >
                    <span className="text-[#238e41] p-1 text-center">
                      <BsShieldCheck size={16} />
                    </span>
                  </div>
                </Tooltip>
              )}

              {cellValues.formattedValue === "Not Verified" && (
                <Tooltip title="Not Verified" arrow>
                  <div
                    className={`mx-1 w-full h-full flex justify-center items-center text-center`}
                  >
                    <span className="text-[#DA1F26] p-1 text-center">
                      <BsShieldX size={16} />
                    </span>
                  </div>
                </Tooltip>
              )}

              {cellValues.formattedValue !== "Not Verified" &&
                cellValues.formattedValue !== "Verified" && (
                  <Tooltip title="No OTP used" arrow>
                    <div
                      className={`mx-1 w-full h-full flex justify-center items-center text-center`}
                    >
                      <span className="text-[#AAAAAA] p-1 text-center">
                        <BsShieldMinus size={16} />
                      </span>
                    </div>
                  </Tooltip>
                )}
            </div>
          );
        }
      },
    },

    {
      field: "leadSource",
      headerName: "Src",
      flex: 1,
      minWidth: 70,
      headerAlign: "center",
      renderCell: (cellValues) => {
        console.log("Start::", cellValues.row.leadSource);
        const sourceIcons = {
          "campaign snapchat": () => (
            <FaSnapchatGhost size={16} color={"#f6d80a"} className="p-1" />
          ),

          "campaign facebook": () => (
            <FaFacebookF size={16} color={"#0e82e1"} className="p-1" />
          ),

          "campaign tiktok": () => (
            <FaTiktok
              size={16}
              color={`${currentMode === "dark" ? "#ffffff" : "#000000"}`}
              className="p-1"
            />
          ),

          "campaign googleads": () => <FcGoogle size={16} className="p-1" />,

          "campaign youtube": () => (
            <FaYoutube size={16} color={"#FF0000"} className="p-1" />
          ),

          "campaign twitter": () => (
            <FaTwitter size={16} color={"#00acee"} className="p-1" />
          ),

          "bulk import": () => (
            <BiImport size={16} color={"#da1f26"} className="p-1" />
          ),

          "property finder": () => (
            <GiMagnifyingGlass size={16} color={"#ef5e4e"} className="p-1" />
          ),

          campaign: () => (
            <MdCampaign size={16} color={"#696969"} className="p-0.5" />
          ),

          cold: () => <BsSnow2 size={16} color={"#0ec7ff"} className="p-1" />,

          personal: () => (
            <BsPersonCircle size={16} color={"#6C7A89"} className="p-1" />
          ),

          whatsapp: () => (
            <FaWhatsapp size={16} color={"#53cc60"} className="p-1" />
          ),

          message: () => (
            <BiMessageRoundedDots
              size={16}
              color={"#6A5ACD"}
              className="p-0.5"
            />
          ),

          comment: () => (
            <FaRegComments size={16} color={"#a9b3c6"} className="p-0.5" />
          ),

          website: () => (
            <TbWorldWww size={16} color={"#AED6F1"} className="p-0.5" />
          ),

          self: () => <FaUser size={16} color={"#6C7A89"} className="p-0.5" />,
        };
        return (
          <>
            <div className="flex items-center justify-center w-full">
              {cellValues.row.leadSource?.toLowerCase().startsWith("warm") ? (
                <BiArchive
                  style={{
                    width: "50%",
                    height: "50%",
                    margin: "0 auto",
                  }}
                  size={16}
                  color={"#AEC6CF"}
                  className="p-0.5"
                />
              ) : (
                <Box
                  sx={{
                    "& svg": {
                      width: "50%",
                      height: "50%",
                      margin: "0 auto",
                    },
                  }}
                >
                  {sourceIcons[cellValues.row.leadSource?.toLowerCase()]
                    ? sourceIcons[cellValues.row.leadSource?.toLowerCase()]()
                    : "-"}
                </Box>
              )}
            </div>
          </>
        );
      },
    },

    {
      field: "whatsapp-web",
      headerName: "Action",
      headerAlign: "center",
      minWidth: 150,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex items-center justify-center w-full mx-7">
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-green-500 hover:text-white rounded-full shadow-none p-2 mx-1 flex items-center`}
            >
              <Tooltip title="WhatsApp" arrow>
                <Link
                  to={`/marketing/chat?phoneNumber=${cellValues.row.leadContact
                    ?.slice(1)
                    ?.replaceAll(" ", "")}`}
                  target="_blank"
                >
                  {/* <div
                    className="whatsapp-web-link p-1.5 rounded-sm hover:bg-green-500 hover:text-white hover:rounded-md bg-transparent text-green-500"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  > */}
                  <BsWhatsapp size={16} />
                  {/* </div> */}
                </Link>
              </Tooltip>
            </p>

            {/* CALL  */}
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-green-600 hover:text-white rounded-full shadow-none p-2 mx-1 flex items-center`}
            >
              <Tooltip title="Call" arrow>
                <CallButton phone={cellValues.row.leadContact} />
              </Tooltip>
            </p>

            {/* EMAIL  */}
            {/* {cellValues.row.email === "" ||
            cellValues.row.email === "null" ||
            cellValues.row.email === "undefined" ||
            cellValues.row.email === "-" ||
            cellValues.row.email === null ||
            cellValues.row.email === undefined ? (
              <></>
            ) : ( */}
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-[#0078d7] hover:text-white rounded-full shadow-none p-2 mx-1 flex items-center `}
            >
              <Tooltip title="Send Mail" arrow>
                <EmailButton email={cellValues.row.leadEmail} />
              </Tooltip>
            </p>
            {/* )} */}
          </div>
        );
      },
    },
  ];

  const EmailButton = ({ email }) => {
    // console.log("email:::::::::::::::::::: ", email);
    const handleEmailClick = (event) => {
      event.stopPropagation();
      window.location.href = `mailto:${email}`;
    };

    return (
      <button className="email-button" onClick={handleEmailClick}>
        <BiMailSend size={16} />
      </button>
    );
  };

  const CallButton = ({ phone }) => {
    const handlePhoneClick = (event) => {
      event.stopPropagation();
      window.location.href = `tel:${phone}`;
    };

    return (
      <button className="call-button" onClick={handlePhoneClick}>
        <BiPhoneCall size={16} />
      </button>
    );
  };

  const [columnsArr, setColumnsArr] = useState(columns);

  const FetchLeads = async (
    token,
    lead_origin,
    lead_type,
    projectName,
    enquiryType,
    assignedManager,
    assignedAgent,
    otp,
    phoneNumber,
    email,
    language,
    dateRange
  ) => {
    console.log("lead type is");
    console.log(lead_type);
    console.log("lead origin is");
    console.log(lead_origin);
    let FetchLeads_url = "";
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));
    // LEADS URL GENERATON FOR HOT LEADS SECTION

    // LEADS URL GENERATON FOR HOT LEADS SECTION
    if (lead_origin === "hotleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Meeting`;
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Unreachable`;
      }
    }
    // LEADS URL GENERATON FOR COLD LEADS PAGE
    else if (lead_origin === "coldleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=New`;
      } else if (lead_type === "coldLeadsVerified") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&is_whatsapp=1`;
      } else if (lead_type === "coldLeadsInvalid") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&is_whatsapp=2`;
      } else if (lead_type === "coldLeadsNotChecked") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&is_whatsapp=0`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Meeting`;
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=1&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Unreachable`;
      }
    }
    // LEADS URL GENERATON FOR THIRDPARTY PAGE
    else if (lead_origin === "thirdpartyleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Meeting`;
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=3&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Unreachable`;
      }
    }
    // LEADS URL GENERATON FOR PERSONAL PAGE
    else if (lead_origin === "personalleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Meeting`;
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=2&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Unreachable`;
      }
    }
    // LEADS URL GENERATON FOR WARM LEADS PAGE
    else if (lead_origin === "archive") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Meeting`;
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=4&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Unreachable`;
      }
    } else if (lead_origin === "transfferedleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&perpage=${pageState.perpage}&coldCall=0&leadStatus=Transferred`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=New&leadStatus=Transferred`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=No Answer&leadStatus=Transferred`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Meeting&leadStatus=Transferred`;
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Follow Up&leadStatus=Transferred`;
      } else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Low Budget&leadStatus=Transferred`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Not Interested&leadStatus=Transferred`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Unreachable&leadStatus=Transferred`;
      }
    } else if (lead_origin === "unassigned") {
      if (lead_type === "fresh") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=0`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Meeting`;
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Unreachable`;
      } else if (lead_type === "cold") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=1`;
      } else if (lead_type === "archive") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=4`;
      } else if (lead_type === "personal") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=2`;
      } else if (lead_type === "thirdpartyleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=3`;
      }
    }
    console.log("fetch lead url is");
    console.log(FetchLeads_url);

    if (projectName) {
      FetchLeads_url += `&project=${projectName}`;
    }

    if (enquiryType) {
      FetchLeads_url += `&enquiryType=${enquiryType}`;
    }

    if (assignedManager) {
      FetchLeads_url += `&managerAssigned=${assignedManager}`;
    }

    if (assignedAgent) {
      FetchLeads_url += `&agentAssigned=${assignedAgent}`;
    }

    if (otp) {
      FetchLeads_url += `&otp=${otp}`;
    }

    if (phoneNumber) {
      FetchLeads_url += `&hasphone=${phoneNumber === "with" ? 1 : 0}`;
    }

    if (email) {
      FetchLeads_url += `&hasmail=${email === "with" ? 1 : 0}`;
    }
    if (language) {
      FetchLeads_url += `&language=${language}`;
    }
    if (dateRange) {
      FetchLeads_url += `&date_range=${dateRange}`;
    }
    axios
      .get(FetchLeads_url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(async (result) => {
        console.log("the user leads are ");
        console.log(result.data);

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
          leadContact: row?.leadContact || "-",
          project: row?.project || "-",
          leadId: row?.id,
          email: row?.leadEmail || "-",
          otp: row?.otp || "-",
          leadType: row?.leadType || "-",
          language: getLangCode(row?.language) || "-",
          enquiryType: row?.enquiryType || "-",
          leadSource: row?.leadSource || "-",
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          pageSize: result.data.coldLeads.per_page,
          total: result.data.coldLeads.total,
          from: result.data.coldLeads.from,
          to: result.data.coldLeads.to,
        }));
        setColumnsArr([...columnsArr]);
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
      });
  };

  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = async (e) => {
    console.log(e.target.value);
    if (e.target.value === "") {
      FetchLeads(token);
    } else {
      setpageState((old) => ({
        ...old,
        isLoading: true,
      }));
      console.log("the search lead  url is ");
      console.log(
        `${BACKEND_URL}/search?title=${e.target.value}&page=${pageState.page}`
      );
      await axios
        .get(`${BACKEND_URL}/search?title=${e.target.value}`, {
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
            creationDate: row?.creationDate || "-",
            leadName: row?.leadName || "-",
            leadContact: row?.leadContact || "-",
            project: row?.project || "-",
            language: getLangCode(row?.language) || "-",
            leadType: row?.leadType || "-",
            leadSource: row?.leadSource || "-",
            leadId: row?.id,
          }));
          setpageState((old) => ({
            ...old,
            isLoading: false,
            data: rowsdata,
            pageSize: result.data.result.per_page,
            total: result.data.result.total,
          }));
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, [leadTypeSelected, leadOriginSelected]);

  useEffect(() => {
    setManagers(Managers);
    setAgents(SalesPerson);
  }, [Managers, SalesPerson]);

  const formatDate = (dateObj) => {
    return (
      formatNum(dateObj?.$d?.getUTCFullYear()) +
      "-" +
      formatNum(dateObj?.$d?.getUTCMonth() + 1) +
      "-" +
      formatNum(dateObj?.$d?.getUTCDate() + 1)
    );
  };

  useEffect(() => {
    FetchLeads(
      token,
      leadOriginSelected?.id || "hotleads",
      leadTypeSelected?.id || "all",
      projectNameTyped,
      enquiryTypeSelected?.id,
      managerSelected,
      agentSelected,
      otpSelected?.id,
      phoneNumberFilter,
      emailFilter,
      languageFilter,
      startDate && endDate ? `${startDate},${endDate}` : ""
      //   ? `${formatDate(startDate)},${formatDate(endDate)}`
      //   : ""
    );
    setColumnsArr([...columnsArr]);
    // eslint-disable-next-line
  }, [
    pageState.page,
    leadTypeSelected,
    managerSelected,
    agentSelected,
    leadOriginSelected,
    projectNameTyped,
    enquiryTypeSelected,
    reloadDataGrid,
    pageState.perpage,
    phoneNumberFilter,
    otpSelected,
    emailFilter,
    languageFilter,
    startDate,
    endDate,
  ]);

  const handleRowClick = async (params, event) => {
    if (!event.target.closest(".whatsapp-web-link")) {
      setMessageLogsModal({
        isOpen: true,
        data: params,
      });
    }
  };

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

  useEffect(() => {
    if (managerSelected) {
      setAgentSelected("");
    }
  }, [managerSelected]);

  return (
    <div className="pb-10 filters-dropdown">
      <div className="flex items-center justify-between">
        <div className="w-full flex items-center py-4">
          <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div>
          <h1
            className={`text-lg font-semibold ${
              currentMode === "dark" ? "text-white" : "text-black"
            }`}
          >
            Search for {leadOriginSelected.formattedValue}
            {" | "}
            <span>{leadTypeSelected.formattedValue}</span>{" "}
            <span className="bg-main-red-color text-white px-3 py-1 rounded-sm my-auto">
              {pageState?.total}
            </span>
          </h1>
        </div>
        <FiltersDropdown
          agentSelected={agentSelected}
          agents={agents}
          enquiryTypeSelected={enquiryTypeSelected}
          leadOriginSelected={leadOriginSelected}
          projectNameTyped={projectNameTyped}
          leadTypeSelected={leadTypeSelected}
          emailFilter={emailFilter}
          setEmailFilter={setEmailFilter}
          toRange={toRange}
          setToRange={setToRange}
          fromRange={fromRange}
          setFromRange={setFromRange}
          managerSelected={managerSelected}
          languageFilter={languageFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setLanguageFilter={setLanguageFilter}
          managers={managers}
          otpSelected={otpSelected}
          setOtpSelected={setOtpSelected}
          setAgentSelected={setAgentSelected}
          phoneNumberFilter={phoneNumberFilter}
          setPhoneNumberFilter={setPhoneNumberFilter}
          setAgents={setAgents}
          setEnquiryTypeSelected={setEnquiryTypeSelected}
          setLeadOriginSelected={setLeadOriginSelected}
          setLeadTypeSelected={setLeadTypeSelected}
          setManagerSelected={setManagerSelected}
          setProjectNameTyped={setProjectNameTyped}
        />
      </div>

      <Box className="flex items-center justify-between mb-2">
        <Box className="flex items-center">
          {selectedRows.length === 0 ? (
            <></>
          ) : (
            <Alert color="success" sx={{ mr: 2, mt: "3px" }}>
              {selectedRows.length} rows selected
            </Alert>
          )}

          <div className="px-2 flex items-center h-full">
            <Coin />
            <span className="mx-3 gold-grad" style={{ fontSize: "24px" }}>
              {userCredits}
            </span>

            <Typography
              onClick={() => setPurchaseCreditsModal(true)}
              sx={{
                color: "#0051c7a3",
                cursor: "pointer",
                ml: "2px",
                fontWeight: "600",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              <small>PURCHASE</small>
            </Typography>
          </div>
        </Box>

        <Box className="flex items-center justify-end">
          <Tooltip title="Add New Contact" arrow>
            <Button
              onClick={() => {
                setAddLeadModalOpen(true);
              }}
              type="button"
              variant="contained"
              sx={{
                color: "#DA1F26",
                padding: "10px",
                mb: 2,
                mr: 1,
                "& svg path": {
                  stroke: "white !important",
                },
              }}
              color="error"
            >
              <BsPersonAdd
                color={`${currentMode === "dark" ? "#FFFFFF" : "#FFFFFF"}`}
                size={20}
              />
            </Button>
          </Tooltip>

          <Tooltip title="Delete Lead" arrow>
            <Button
              onClick={() => setBulkDeleteModalOpen(true)}
              type="button"
              variant="contained"
              sx={{ padding: "10px", mb: 2, mr: 1 }}
              color="error"
              disabled={selectedRows?.length === 0}
            >
              <BsTrash
                color={`${currentMode === "dark" ? "#FFFFFF" : "#FFFFFF"}`}
                size={20}
              />
            </Button>
          </Tooltip>
          <Tooltip title="Send WhatsApp" arrow>
            <Button
              onClick={() =>
                setOpenMessageModal({ open: true, isWhatsapp: true })
              }
              type="button"
              variant="contained"
              sx={{ padding: "10px", mb: 2, mr: 1 }}
              color="error"
              disabled={selectedRows?.length === 0}
            >
              <BsWhatsapp
                color={`${currentMode === "dark" ? "#FFFFFF" : "#FFFFFF"}`}
                size={20}
              />
            </Button>
          </Tooltip>

          <Tooltip title="Send SMS" arrow>
            <div className="relative">
              <Button
                onClick={() =>
                  setOpenMessageModal({ open: true, isWhatsapp: false })
                }
                type="button"
                variant="contained"
                sx={{ padding: "10px", mb: 2, mr: 1 }}
                color="error"
                disabled={selectedRows?.length === 0}
              >
                <MdSms
                  color={`${currentMode === "dark" ? "#FFFFFF" : "#FFFFFF"}`}
                  size={20}
                />
              </Button>
            </div>
          </Tooltip>

          <Tooltip title="Send Email" arrow>
            <div className="relative">
              <Button
                onClick={() => {}}
                type="button"
                variant="contained"
                sx={{ padding: "10px", mb: 2, mr: 1 }}
                color="error"
                disabled={true}
              >
                <HiMail
                  color={`${currentMode === "dark" ? "#FFFFFF" : "#FFFFFF"}`}
                  size={20}
                />
              </Button>
              <div className="text-white bg-[#1c1c1c] absolute w-[89%] rounded-sm text-xs top-7 left-0 right-0 p-1">
                Coming soon
              </div>
            </div>
          </Tooltip>

          {selectedRows.length === 1 && (
            <Tooltip title="Open Chat" arrow>
              <Link
                to={`/marketing/chat?phoneNumber=${selectedRows[0]?.contact
                  ?.slice(1)
                  ?.replaceAll(" ", "")}`}
              >
                <Button
                  type="button"
                  variant="contained"
                  sx={{ padding: "10px", mb: 2, mr: 1 }}
                  color="error"
                >
                  <IoMdChatboxes
                    color={`${currentMode === "dark" ? "#FFFFFF" : "#AAAAAA"}`}
                    size={20}
                  />
                </Button>
              </Link>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Box
        width={"100%"}
        className={`${currentMode}-mode-datatable`}
        sx={{ ...DataGridStyles, position: "relative" }}
      >
        <DataGrid
          disableDensitySelector
          autoHeight
          disableSelectionOnClick
          rows={pageState.data}
          onRowClick={handleRowClick}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[30, 50, 75, 100]}
          virtualization
          pagination
          width="auto"
          paginationMode="server"
          page={pageState.page - 1}
          checkboxSelection
          selectionModel={selectionModelRef.current}
          onSelectionModelChange={(ids) => {
            selectionModelRef.current = ids;
            setSelectedRows(
              ids.map((id) => {
                const contact =
                  pageState?.data[id - pageState?.from]?.leadContact;
                const lid = pageState?.data[id - pageState?.from]?.leadId;
                if (contact[0] === "+") {
                  return {
                    lid,
                    contact: contact?.slice(1)?.replaceAll(" ", ""),
                  };
                } else {
                  return { lid, contact: contact?.replaceAll(" ", "") };
                }
              })
            );
          }}
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
          components={{
            // Toolbar: GridToolbar,
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
            // "& .css-yrdy0g-MuiDataGrid-columnHeaderRow": {
            //   display: "flex",
            //   justifyContent: "space-around",
            // },
            // "& .MuiDataGrid-row": {
            //   display: "flex",
            //   justifyContent: "space-between",
            // },
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
            "& .MuiCheckbox-root": {
              color: currentMode === "dark" ? "#FFF" : "#000",
            },
            "& .Mui-checked": {
              color: currentMode === "dark" ? "#FFF" : "#000",
            },
            "& .MuiSvgIcon-root": {
              color: currentMode === "dark" ? "#ffffff" : "#000000",
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

      {addLeadModalOpen && (
        <AddLeadModal
          FetchLeads={() => {
            const token = localStorage.getItem("auth-token");
            FetchLeads(
              token,
              leadOriginSelected?.id || "hotleads",
              leadTypeSelected?.id || "all",
              projectNameTyped,
              enquiryTypeSelected?.id,
              managerSelected,
              agentSelected,
              otpSelected?.id,
              phoneNumberFilter,
              emailFilter,
              languageFilter,
              startDate && endDate
                ? `${formatDate(startDate)},${formatDate(endDate)}`
                : ""
            );
            setColumnsArr([...columnsArr]);
          }}
          addLeadModalOpen={addLeadModalOpen}
          handleCloseAddLeadModal={() => setAddLeadModalOpen(false)}
        />
      )}
      {openMessageModal.open && (
        <SendMessageModal
          sendMessageModal={openMessageModal}
          setSendMessageModal={setOpenMessageModal}
          selectedContacts={selectedRows?.map((row) => row?.contact)}
          whatsappSenderNo={whatsappSenderNo}
        />
      )}
      {messageLogsModal.isOpen && (
        <MessageLogs
          messageLogsModal={messageLogsModal}
          setMessageLogsModal={setMessageLogsModal}
          whatsappSenderNo={whatsappSenderNo}
        />
      )}

      {console.log("selectd::", selectedRows)}

      {bulkDeleteModalOpen && (
        <ConfirmBulkDelete
          lids={selectedRows?.map((row) => row?.lid)}
          FetchLeads={() => {
            const token = localStorage.getItem("auth-token");
            FetchLeads(
              token,
              leadOriginSelected?.id || "hotleads",
              leadTypeSelected?.id || "all",
              projectNameTyped,
              enquiryTypeSelected?.id,
              managerSelected,
              agentSelected,
              otpSelected?.id,
              phoneNumberFilter,
              emailFilter,
              languageFilter,
              startDate && endDate
                ? `${formatDate(startDate)},${formatDate(endDate)}`
                : ""
            );
            setColumnsArr([...columnsArr]);
          }}
          selectionModelRef={selectionModelRef}
          bulkDeleteModalOpen={bulkDeleteModalOpen}
          handleCloseDeleteModal={() => setBulkDeleteModalOpen(false)}
        />
      )}

      {purchaseCreditsModal && (
        <PurchaseCreditsModal
          purchaseCreditsModal={purchaseCreditsModal}
          handleClose={() => setPurchaseCreditsModal(false)}
        />
      )}
    </div>
  );
};

export default AllLeads;
