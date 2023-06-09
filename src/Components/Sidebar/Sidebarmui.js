import { Box, ListItemIcon, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiFillGift, AiFillMessage } from "react-icons/ai";
import { FaLink, FaSnowflake, FaMobile } from "react-icons/fa";
import {
  BsStopCircleFill,
  BsCalendarWeekFill,
  BsFillCreditCard2FrontFill,
} from "react-icons/bs";
import { HiTicket, HiDocumentReport, HiUsers } from "react-icons/hi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsEnvelopeFill } from "react-icons/bs";
import { FaFacebookSquare, FaChartLine, FaUser } from "react-icons/fa";
import { RiRadioButtonLine } from "react-icons/ri";
import { BiCalendar } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import {
  MdLeaderboard,
  MdPersonAdd,
  MdSpeakerNotes,
  MdContactPage,
  MdPersonPinCircle,
} from "react-icons/md";
import {
  RiWhatsappFill,
  RiDashboardFill,
  RiFileTransferFill,
  RiBuilding2Fill,
} from "react-icons/ri";
import { SiHotjar } from "react-icons/si";
import { ImBookmark } from "react-icons/im";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
} from "react-pro-sidebar";
import { useStateContext } from "../../context/ContextProvider";
import { ImLock, ImUsers, ImLocation } from "react-icons/im";
// import axios from "axios";
import axios from "../../axoisConfig";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { Link as NextLink } from "next/link";

const Sidebarmui = () => {
  const {
    currentMode,
    User,
    isCollapsed,
    selected,
    setSelected,
    setopenBackDrop,
    BACKEND_URL,
    isUserSubscribed,
    setUser,
    openBackDrop,
    setIsUserSubscribed,
    setSalesPerson,
    setManagers,
    setAppLoading,
    fetchSidebarData,
    sidebarData,
  } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [openedSubMenu, setOpenSubMenu] = useState(0);

  const setOpenedSubMenu = (index) => {
    if(openedSubMenu === index) {
      setOpenSubMenu(0);
    } else {
      setOpenSubMenu(index);
    }
  }

  const handleMenuItemClick = (menuName) => {
    console.log("menuitem: ", menuName);
    setSelected(menuName);
    setopenBackDrop(true);
  };

  const handleDropdownClick = (menuKey) => {
    console.log("menukey: ", menuKey);
    setopenBackDrop(false);
  };

  console.log("SidebarData: ", sidebarData);

  useEffect(() => {
    fetchSidebarData();
  }, []);

  //  DATA
  // const links = [
  //   {
  //     title: "Dashboard",
  //     links: [
  //       {
  //         name: "Dashboard",
  //         icon: <RiDashboardFill />,
  //         link: "/dashboard",
  //       },
  //     ],
  //   },

  //   {
  //     title: "LEADS",
  //     links: [
  //       {
  //         name: "Add lead",
  //         icon: <MdPersonAdd />,
  //         link: "/addlead",
  //       },
  //       {
  //         name: "Hot",
  //         icon: <SiHotjar />,
  //         submenu: [
  //           {
  //             name: "All",
  //             count: sidebarData?.HotLeadsCount?.hot,
  //             link: "/hotleads/all",
  //           },
  //           {
  //             name: "New",
  //             count: sidebarData?.HotLeadsCount?.new,
  //             link: "/hotleads/new",
  //           },
  //           {
  //             name: "No Answer",
  //             count: sidebarData?.HotLeadsCount?.no_nswer,
  //             link: "/hotleads/no answer",
  //           },
  //           {
  //             name: "Meeting",
  //             count: sidebarData?.HotLeadsCount?.Meeting,
  //             link: "/hotleads/meeting",
  //           },
  //           {
  //             name: "Follow Up",
  //             count: sidebarData?.HotLeadsCount?.follow_up,
  //             link: "/hotleads/follow up",
  //           },
  //           {
  //             name: "Low Budget",
  //             count: sidebarData?.HotLeadsCount?.low_budget,
  //             link: "/hotleads/low budget",
  //           },
  //           {
  //             name: "Not Interested",
  //             count: sidebarData?.HotLeadsCount?.not_interested,
  //             link: "/hotleads/not interested",
  //           },
  //           {
  //             name: "Unreachable",
  //             count: sidebarData?.HotLeadsCount?.unreachable,
  //             link: "/hotleads/unreachable",
  //           },
  //         ],
  //       },
  //       {
  //         name: "Personal",
  //         icon: <HiUsers />,
  //         submenu: [
  //           {
  //             name: "All",
  //             count: sidebarData?.PersonalLeadsCount?.all,
  //             link: "/personalleads/all",
  //           },
  //           {
  //             name: "New",
  //             count: sidebarData?.PersonalLeadsCount?.new,
  //             link: "/personalleads/new",
  //           },
  //           {
  //             name: "No Answer",
  //             count: sidebarData?.PersonalLeadsCount?.no_nswer,
  //             link: "/personalleads/no answer",
  //           },
  //           {
  //             name: "Meeting",
  //             count: sidebarData?.PersonalLeadsCount?.Meeting,
  //             link: "/personalleads/meeting",
  //           },
  //           {
  //             name: "Follow Up",
  //             count: sidebarData?.PersonalLeadsCount?.follow_up,
  //             link: "/personalleads/follow up",
  //           },
  //           {
  //             name: "Low Budget",
  //             count: sidebarData?.PersonalLeadsCount?.low_budget,
  //             link: "/personalleads/low budget",
  //           },
  //           {
  //             name: "Not Interested",
  //             count: sidebarData?.PersonalLeadsCount?.not_interested,
  //             link: "/personalleads/not interested",
  //           },
  //           {
  //             name: "Unreachable",
  //             count: sidebarData?.PersonalLeadsCount?.unreachable,
  //             link: "/personalleads/unreachable",
  //           },
  //         ],
  //       },
  //       {
  //         name: "Third party",
  //         icon: <FaLink />,
  //         submenu: [
  //           {
  //             name: "All",
  //             count: sidebarData?.ThirdPartyLeadsCount?.all,
  //             link: "/thirdpartyleads/all",
  //           },
  //           {
  //             name: "New",
  //             count: sidebarData?.ThirdPartyLeadsCount?.new,
  //             link: "/thirdpartyleads/new",
  //           },
  //           {
  //             name: "No Answer",
  //             count: sidebarData?.ThirdPartyLeadsCount?.no_nswer,
  //             link: "/thirdpartyleads/no answer",
  //           },
  //           {
  //             name: "Meeting",
  //             count: sidebarData?.ThirdPartyLeadsCount?.Meeting,
  //             link: "/thirdpartyleads/meeting",
  //           },
  //           {
  //             name: "Follow Up",
  //             count: sidebarData?.ThirdPartyLeadsCount?.follow_up,
  //             link: "/thirdpartyleads/follow up",
  //           },
  //           {
  //             name: "Low Budget",
  //             count: sidebarData?.ThirdPartyLeadsCount?.low_budget,
  //             link: "/thirdpartyleads/low budget",
  //           },
  //           {
  //             name: "Not Interested ",
  //             count: sidebarData?.ThirdPartyLeadsCount?.not_interested,
  //             link: "/thirdpartyleads/not interested",
  //           },
  //           {
  //             name: "Unreachable",
  //             count: sidebarData?.ThirdPartyLeadsCount?.unreachable,
  //             link: "/thirdpartyleads/unreachable",
  //           },
  //         ],
  //       },
  //       {
  //         name: "Cold",
  //         icon: <FaSnowflake />,
  //         submenu: [
  //           {
  //             name: "All",
  //             count: sidebarData?.ColdLeadsCount?.all,
  //             link: "/coldleads/all",
  //           },
  //           {
  //             name: "New",
  //             count: sidebarData?.ColdLeadsCount?.new,
  //             link: "/coldleads/new",
  //           },
  //           {
  //             name: "Cold: Verified",
  //             count: sidebarData?.ColdLeadsCount?.verified, //TODO
  //             link: "/coldleads/coldLeadsVerified",
  //           },
  //           {
  //             name: "Cold: Invalid",
  //             count: sidebarData?.ColdLeadsCount?.unverified, //TODO
  //             link: "/coldleads/coldLeadsInvalid",
  //           },
  //           {
  //             name: "Cold: Not Checked",
  //             count: sidebarData?.ColdLeadsCount?.unchecked, //TODO
  //             link: "/coldleads/coldLeadsNotChecked",
  //           },

  //           {
  //             name: "No Answer",
  //             count: sidebarData?.ColdLeadsCount?.no_nswer,
  //             link: "/coldleads/no answer",
  //           },
  //           {
  //             name: "Meeting",
  //             count: sidebarData?.ColdLeadsCount?.Meeting,
  //             link: "/coldleads/meeting",
  //           },
  //           {
  //             name: "Follow Up",
  //             count: sidebarData?.ColdLeadsCount?.follow_up,
  //             link: "/coldleads/follow up",
  //           },
  //           {
  //             name: "Low Budget",
  //             count: sidebarData?.ColdLeadsCount?.low_budget,
  //             link: "/coldleads/low budget",
  //           },
  //           {
  //             name: "Not Interested  ",
  //             count: sidebarData?.ColdLeadsCount?.not_interested
  //               ? sidebarData?.ColdLeadsCount?.not_interested
  //               : "0",
  //             link: "/coldleads/not interested",
  //           },
  //           {
  //             name: "Unreachable",
  //             count: sidebarData?.ColdLeadsCount?.unreachable,
  //             link: "/coldleads/unreachable",
  //           },
  //         ],
  //       },
  //       {
  //         name: "Transffered",
  //         icon: <RiFileTransferFill />,
  //         link: "/transfferedleads",
  //       },
  //       {
  //         name: "Unassigned",
  //         icon: <BsStopCircleFill />,
  //         submenu: [
  //           {
  //             name: "Hot leads",
  //             count: sidebarData?.UnassignedLeadsCount?.hot,
  //             link: "/unassigned/fresh",
  //           },
  //           {
  //             name: "Cold leads",
  //             count: sidebarData?.UnassignedLeadsCount?.cold,
  //             link: "/unassigned/cold",
  //           },
  //         ],
  //       },
  //       {
  //         name: "Booked deals",
  //         icon: <ImBookmark />,
  //         link: "/booked",
  //       },
  //       {
  //         name: "Closed deals",
  //         icon: <ImLock />,
  //         link: "/closedeals",
  //       },
  //       {
  //         name: "Notes",
  //         icon: <MdSpeakerNotes />,
  //         link: "/leadnotes",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Apps",
  //     links: [
  //       {
  //         name: "Meetings",
  //         icon: <BsCalendarWeekFill />,
  //         link: "/meetings",
  //       },
  //       {
  //         name: "Reports",
  //         icon: <HiDocumentReport />,
  //         link: "/reports",
  //       },
  //       {
  //         name: "Offers",
  //         icon: <AiFillGift />,
  //         link: "/offers",
  //       },
  //       {
  //         name: "Users",
  //         icon: <ImUsers />,
  //         link: "/users",
  //       },
  //       {
  //         name: "Clients",
  //         icon: <ImUsers />,
  //         link: "/clients",
  //       },
  //       {
  //         name: "Contacts",
  //         icon: <MdContactPage />,
  //         link: "/contacts",
  //       },
  //       {
  //         name: "Property Portfolio",
  //         icon: <RiBuilding2Fill />,
  //         link: "/propertyPortfolio",
  //       },
  //       {
  //         name: "Leaderboard",
  //         icon: <MdLeaderboard />,
  //         link: "/leaderboard",
  //       },
  //       // { name: "Leads Bitcoin", icon: <GrBitcoin /> },
  //     ],
  //   },
  //   {
  //     title: "WHATSAPP",
  //     links: [
  //       {
  //         name: "Dashboard",
  //         icon: <RiWhatsappFill />,
  //         link: "/whatsapp-marketing/dashboard",
  //       },
  //       {
  //         name: "Messages",
  //         icon: <AiFillMessage />,
  //         link: "/whatsapp-marketing/messages",
  //       },
  //       {
  //         name: "Device",
  //         icon: <FaMobile />,
  //         link: "/whatsapp-marketing/device",
  //       },
  //       {
  //         name: "Payments",
  //         icon: <BsFillCreditCard2FrontFill />,
  //         link: "/whatsapp-marketing/payments",
  //       },
  //     ],
  //   },
  //   {
  //     title: "LOCATION",
  //     links: [
  //       {
  //         name: "Meetings",
  //         icon: <ImLocation size={20} />,
  //         link: "/location/livelocation",
  //       },
  //       {
  //         name: "Live",
  //         icon: <MdPersonPinCircle size={22} />,
  //         link: "/location/userlocation",
  //       },
  //     ],
  //   },
  //   {
  //     title: "SUPPORT",
  //     links: [
  //       {
  //         name: "Tickets",
  //         icon: <HiTicket />,
  //         link: "/support",
  //       },
  //     ],
  //   },
  // ];

  const Agentlinks = [
    {
      title: "Dashboard",
      links: [
        {
          name: "Dashboard",
          icon: <RiDashboardFill />,
          link: "/dashboard",
        },
      ],
    },

    {
      title: "LEADS",
      links: [
        {
          name: "Add lead",
          icon: <MdPersonAdd />,
          link: "/addlead",
        },
        {
          name: "Fresh",
          icon: <SiHotjar />,
          submenu: [
            {
              name: "All",
              count: sidebarData?.HotLeadsCount?.all,
              link: "/freshleads/all",
            },
            {
              name: "New",
              count: sidebarData?.HotLeadsCount?.new,
              link: "/freshleads/new",
            },
            {
              name: "No Answer",
              count: sidebarData?.HotLeadsCount?.no_nswer,
              link: "/freshleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.HotLeadsCount?.Meeting,
              link: "/freshleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.HotLeadsCount?.follow_up,
              link: "/freshleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.HotLeadsCount?.low_budget,
              link: "/freshleads/low budget",
            },
            {
              name: "Not Interested",
              count: sidebarData?.HotLeadsCount?.not_interested,
              link: "/freshleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.HotLeadsCount?.unreachable,
              link: "/freshleads/unreachable",
            },
          ],
        },
        {
          name: "Personal",
          icon: <HiUsers />,
          submenu: [
            {
              name: "All",
              count: sidebarData?.PersonalLeadsCount?.all,
              link: "/personalleads/all",
            },
            {
              name: "New",
              count: sidebarData?.PersonalLeadsCount?.new,
              link: "/personalleads/new",
            },
            {
              name: "No Answer",
              count: sidebarData?.PersonalLeadsCount?.no_nswer,
              link: "/personalleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.PersonalLeadsCount?.Meeting,
              link: "/personalleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.PersonalLeadsCount?.follow_up,
              link: "/personalleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.PersonalLeadsCount?.low_budget,
              link: "/personalleads/low budget",
            },
            {
              name: "Not Interested",
              count: sidebarData?.PersonalLeadsCount?.not_interested,
              link: "/personalleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.PersonalLeadsCount?.unreachable,
              link: "/personalleads/unreachable",
            },
          ],
        },
        {
          name: "Third party",
          icon: <FaLink />,
          submenu: [
            {
              name: "All",
              count: sidebarData?.ThirdPartyLeadsCount?.all,
              link: "/thirdpartyleads/all",
            },
            {
              name: "New",
              count: sidebarData?.ThirdPartyLeadsCount?.new,
              link: "/thirdpartyleads/new",
            },
            {
              name: "No Answer",
              count: sidebarData?.ThirdPartyLeadsCount?.no_nswer,
              link: "/thirdpartyleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.ThirdPartyLeadsCount?.Meeting,
              link: "/thirdpartyleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.ThirdPartyLeadsCount?.follow_up,
              link: "/thirdpartyleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.ThirdPartyLeadsCount?.low_budget,
              link: "/thirdpartyleads/low budget",
            },
            {
              name: "Not Interested",
              count: sidebarData?.ThirdPartyLeadsCount?.not_interested,
              link: "/thirdpartyleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.ThirdPartyLeadsCount?.unreachable,
              link: "/thirdpartyleads/unreachable",
            },
          ],
        },
        {
          name: "Cold",
          icon: <FaSnowflake />,
          submenu: [
            {
              name: "All",
              count: sidebarData?.ColdLeadsCount?.all,
              link: "/coldleads/all",
            },
            {
              name: "New",
              count: sidebarData?.ColdLeadsCount?.new,
              link: "/coldleads/new",
            },

            {
              name: "No Answer",
              count: sidebarData?.ColdLeadsCount?.no_nswer,
              link: "/coldleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.ColdLeadsCount?.Meeting,
              link: "/coldleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.ColdLeadsCount?.follow_up,
              link: "/coldleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.ColdLeadsCount?.low_budget,
              link: "/coldleads/low budget",
            },
            {
              name: "Not Interested",
              count: sidebarData?.ColdLeadsCount?.not_interested,
              link: "/coldleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.ColdLeadsCount?.unreachable,
              link: "/coldleads/unreachable",
            },
          ],
        },
        {
          name: "Transferred",
          icon: <RiFileTransferFill />,
          link: "/transfferedleads",
        },
        {
          name: "Booked deals",
          icon: <ImBookmark />,
          link: "/booked",
        },
        {
          name: "Closed deals",
          icon: <ImLock />,
          link: "/closedeals",
        },
        {
          name: "Notes",
          icon: <MdSpeakerNotes />,
          link: "/leadnotes",
        },
      ],
    },
    {
      title: "Apps",
      links: [
        {
          name: "Appointments",
          icon: <BsCalendarWeekFill />,
          submenu: [
            {
              name: "Meetings",
              link: "/appointments/meetings",
            },
            {
              name: "Create Appointment",
              link: "/appointments/create",
            },
          ],
        },

        {
          name: "Contacts",
          icon: <MdContactPage />,
          link: "/contacts",
        },
      ],
    },
    {
      title: "Support",
      links: [
        {
          name: "QA Form",
          icon: <AiOutlineQuestionCircle />,
          link: "/qaform",
        },
      ],
    },

    // {
    //   title: "WHATSAPP MARKETING",
    //   links: [
    //     {
    //       name: "Dashboard",
    //       icon: <RiWhatsappFill />,
    //       link: "/whatsapp-marketing/dashboard",
    //     },
    //     {
    //       name: "Device",
    //       icon: <FaMobile />,
    //       link: "/whatsapp-marketing/device",
    //     },
    //     {
    //       name: "Messages",
    //       icon: <AiFillMessage />,
    //       link: "/whatsapp-marketing/messages",
    //     },
    //     {
    //       name: "Payments",
    //       icon: <BsFillCreditCard2FrontFill />,
    //       link: "/whatsapp-marketing/payments",
    //     },
    //     {
    //       name: "Transactions",
    //       icon: <GrTransaction />,
    //       link: "/whatsapp-marketing/transactions",
    //     },
    //   ],
    // },
  ];
  const Managerlinks = [
    {
      title: "Dashboard",
      links: [
        {
          name: "Dashboard",
          icon: <RiDashboardFill />,
          link: "/dashboard",
        },
      ],
    },

    {
      title: "LEADS",
      links: [
        {
          name: "Add lead",
          icon: <MdPersonAdd />,
          link: "/addlead",
        },

        {
          name: "Fresh",
          icon: <SiHotjar />,
          submenu: [
            {
              name: "All",
              count: sidebarData?.HotLeadsCount?.hot,
              link: "/freshleads/all",
            },
            {
              name: "New",
              count: sidebarData?.HotLeadsCount?.new,
              link: "/freshleads/new",
            },
            {
              name: "No Answer",
              count: sidebarData?.HotLeadsCount?.no_nswer,
              link: "/freshleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.HotLeadsCount?.Meeting,
              link: "/freshleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.HotLeadsCount?.follow_up,
              link: "/freshleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.HotLeadsCount?.low_budget,
              link: "/freshleads/low budget",
            },
            {
              name: "Not Interested",
              count: sidebarData?.HotLeadsCount?.not_interested,
              link: "/freshleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.HotLeadsCount?.unreachable,
              link: "/freshleads/unreachable",
            },
          ],
        },

        {
          name: "Personal",
          icon: <HiUsers />,
          submenu: [
            {
              name: "All",
              count: sidebarData?.PersonalLeadsCount?.all,
              link: "/personalleads/all",
            },
            {
              name: "New",
              count: sidebarData?.PersonalLeadsCount?.new,
              link: "/personalleads/new",
            },
            {
              name: "No Answer",
              count: sidebarData?.PersonalLeadsCount?.no_nswer,
              link: "/personalleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.PersonalLeadsCount?.Meeting,
              link: "/personalleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.PersonalLeadsCount?.follow_up,
              link: "/personalleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.PersonalLeadsCount?.low_budget,
              link: "/personalleads/low budget",
            },
            {
              name: "Not Interested",
              count: sidebarData?.PersonalLeadsCount?.not_interested,
              link: "/personalleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.PersonalLeadsCount?.unreachable,
              link: "/personalleads/unreachable",
            },
          ],
        },
        {
          name: "Third party",
          icon: <FaLink />,
          submenu: [
            {
              name: "All",
              count: sidebarData?.ThirdPartyLeadsCount?.all,
              link: "/thirdpartyleads/all",
            },
            {
              name: "New",
              count: sidebarData?.ThirdPartyLeadsCount?.new,
              link: "/thirdpartyleads/new",
            },
            {
              name: "No Answer",
              count: sidebarData?.ThirdPartyLeadsCount?.no_nswer,
              link: "/thirdpartyleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.ThirdPartyLeadsCount?.Meeting,
              link: "/thirdpartyleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.ThirdPartyLeadsCount?.follow_up,
              link: "/thirdpartyleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.ThirdPartyLeadsCount?.low_budget,
              link: "/thirdpartyleads/low budget",
            },
            {
              name: "Not Interested",
              count: sidebarData?.ThirdPartyLeadsCount?.not_interested,
              link: "/thirdpartyleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.ThirdPartyLeadsCount?.unreachable,
              link: "/thirdpartyleads/unreachable",
            },
          ],
        },
        {
          name: "Cold",
          icon: <FaSnowflake />,
          submenu: [
            {
              name: "All",
              count: sidebarData?.ColdLeadsCount?.hot,
              link: "/coldleads/all",
            },
            {
              name: "New",
              count: sidebarData?.ColdLeadsCount?.new,
              link: "/coldleads/new",
            },

            {
              name: "No Answer",
              count: sidebarData?.ColdLeadsCount?.no_nswer,
              link: "/coldleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.ColdLeadsCount?.Meeting,
              link: "/coldleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.ColdLeadsCount?.follow_up,
              link: "/coldleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.ColdLeadsCount?.low_budget,
              link: "/coldleads/low budget",
            },
            {
              name: "Not Interested",
              count: sidebarData?.ColdLeadsCount?.not_interested,
              link: "/coldleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.ColdLeadsCount?.unreachable,
              link: "/coldleads/unreachable",
            },
          ],
        },
        {
          name: "Unassigned",
          icon: <BsStopCircleFill />,
          submenu: [
            {
              name: "Fresh leads",
              count: sidebarData?.UNASSIGNED?.fresh,
              link: "/unassigned/fresh",
            },
            {
              name: "Cold leads",
              count: sidebarData?.UNASSIGNED?.cold,
              link: "/unassigned/cold",
            },
            {
              name: "Reshuffle Leads",
              count: sidebarData?.UNASSIGNED?.warm,
              link: "/unassigned/warm",
            },
            {
              name: "Personal leads",
              count: sidebarData?.UNASSIGNED?.personal,
              link: "/unassigned/personal",
            },
            {
              name: "Third Party",
              count: sidebarData?.UNASSIGNED?.third_party,
              link: "/unassigned/thirdpartyleads",
            },
          ],
        },
        {
          name: "Reshuffle",
          icon: <FaFire />,
          submenu: [
            {
              name: "All Leads",
              count: sidebarData?.WarmLeadCount?.all,
              link: "/warmleads/all",
            },
            {
              name: "New Leads",
              count: sidebarData?.WarmLeadCount?.new,
              link: "/warmleads/new",
            },
            {
              name: "No Answer",
              count: sidebarData?.WarmLeadCount?.no_nswer,
              link: "/warmleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.WarmLeadCount?.Meeting,
              link: "/warmleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.WarmLeadCount?.follow_up,
              link: "/warmleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.WarmLeadCount?.low_budget,
              link: "/warmleads/low budget",
            },
            {
              name: "Not Intrested",
              count: sidebarData?.WarmLeadCount?.not_interested,
              link: "/warmleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.WarmLeadCount?.unreachable,
              link: "/warmleads/unreachable",
            },
          ],
        },
        {
          name: "Transferred",
          icon: <RiFileTransferFill />,
          link: "/transfferedleads",
        },
        {
          name: "Booked deals",
          icon: <ImBookmark />,
          link: "/booked",
        },
        {
          name: "Closed deals",
          icon: <ImLock />,
          link: "/closedeals",
        },
        {
          name: "Notes",
          icon: <MdSpeakerNotes />,
          link: "/leadnotes",
        },
      ],
    },
    {
      title: "Apps",
      links: [
        {
          name: "Appointments",
          icon: <BsCalendarWeekFill />,
          submenu: [
            {
              name: "Meetings",
              link: "/appointments/meetings",
            },
            {
              name: "Create Appointment",
              link: "/appointments/create",
            },
          ],
        },

        {
          name: "Contacts",
          icon: <MdContactPage />,
          link: "/contacts",
        },
      ],
    },
    {
      title: "Support",
      links: [
        {
          name: "QA Form",
          icon: <AiOutlineQuestionCircle />,
          link: "/qaform",
        },
      ],
    },
  ];
  //  DATA
  const links = [
    {
      title: "Dashboard",
      links: [
        {
          name: "Dashboard",
          icon: <RiDashboardFill />,
          link: "/dashboard",
        },
      ],
    },

    {
      title: "LEADS",
      links: [
        {
          name: "Add lead",
          icon: <MdPersonAdd />,
          link: "/addlead",
        },
        {
          name: "Fresh",
          icon: <SiHotjar />,
          submenu: [
            {
              name: "All",
              count: sidebarData?.HotLeadsCount?.hot,
              link: "/freshleads/all",
            },
            {
              name: "New",
              count: sidebarData?.HotLeadsCount?.new,
              link: "/freshleads/new",
            },
            {
              name: "No Answer",
              count: sidebarData?.HotLeadsCount?.no_nswer,
              link: "/freshleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.HotLeadsCount?.Meeting,
              link: "/freshleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.HotLeadsCount?.follow_up,
              link: "/freshleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.HotLeadsCount?.low_budget,
              link: "/freshleads/low budget",
            },
            {
              name: "Not Interested",
              count: sidebarData?.HotLeadsCount?.not_interested,
              link: "/freshleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.HotLeadsCount?.unreachable,
              link: "/freshleads/unreachable",
            },
          ],
        },
        {
          name: "Personal",
          icon: <HiUsers />,
          submenu: [
            {
              name: "All",
              count: sidebarData?.PersonalLeadsCount?.all,
              link: "/personalleads/all",
            },
            {
              name: "New",
              count: sidebarData?.PersonalLeadsCount?.new,
              link: "/personalleads/new",
            },
            {
              name: "No Answer",
              count: sidebarData?.PersonalLeadsCount?.no_nswer,
              link: "/personalleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.PersonalLeadsCount?.Meeting,
              link: "/personalleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.PersonalLeadsCount?.follow_up,
              link: "/personalleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.PersonalLeadsCount?.low_budget,
              link: "/personalleads/low budget",
            },
            {
              name: "Not Interested",
              count: sidebarData?.PersonalLeadsCount?.not_interested,
              link: "/personalleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.PersonalLeadsCount?.unreachable,
              link: "/personalleads/unreachable",
            },
          ],
        },
        {
          name: "Third party",
          icon: <FaLink />,
          submenu: [
            {
              name: "All",
              count: sidebarData?.ThirdPartyLeadsCount?.all,
              link: "/thirdpartyleads/all",
            },
            {
              name: "New",
              count: sidebarData?.ThirdPartyLeadsCount?.new,
              link: "/thirdpartyleads/new",
            },
            {
              name: "No Answer",
              count: sidebarData?.ThirdPartyLeadsCount?.no_nswer,
              link: "/thirdpartyleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.ThirdPartyLeadsCount?.Meeting,
              link: "/thirdpartyleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.ThirdPartyLeadsCount?.follow_up,
              link: "/thirdpartyleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.ThirdPartyLeadsCount?.low_budget,
              link: "/thirdpartyleads/low budget",
            },
            {
              name: "Not Interested",
              count: sidebarData?.ThirdPartyLeadsCount?.not_interested,
              link: "/thirdpartyleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.ThirdPartyLeadsCount?.unreachable,
              link: "/thirdpartyleads/unreachable",
            },
          ],
        },
        {
          name: "Cold",
          icon: <FaSnowflake />,
          submenu: [
            {
              name: "All",
              count: sidebarData?.ColdLeadsCount?.all,
              link: "/coldleads/all",
            },
            {
              name: "New",
              count: sidebarData?.ColdLeadsCount?.new,
              link: "/coldleads/new",
            },
            {
              name: "Verified",
              count: sidebarData?.ColdLeadsCount?.verified, //TODO
              link: "/coldleads/coldLeadsVerified",
              icon: <RiRadioButtonLine style={{ color: "green" }} />,
              countColor: "#008000",
            },
            {
              name: "Invalid",
              count: sidebarData?.ColdLeadsCount?.unverified, //TODO
              link: "/coldleads/coldLeadsInvalid",
              icon: <RiRadioButtonLine style={{ color: "red" }} />,
              countColor: "#FF0000",
            },
            {
              name: "Not Checked",
              count: sidebarData?.ColdLeadsCount?.unchecked, //TODO
              link: "/coldleads/coldLeadsNotChecked",
              icon: <RiRadioButtonLine style={{ color: "orange" }} />,
              countColor: "#FFA500",
            },
            {
              name: "No Answer",
              count: sidebarData?.ColdLeadsCount?.no_nswer,
              link: "/coldleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.ColdLeadsCount?.Meeting,
              link: "/coldleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.ColdLeadsCount?.follow_up,
              link: "/coldleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.ColdLeadsCount?.low_budget,
              link: "/coldleads/low budget",
            },
            {
              name: "Not Interested",
              count: sidebarData?.ColdLeadsCount?.not_interested,
              link: "/coldleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.ColdLeadsCount?.unreachable,
              link: "/coldleads/unreachable",
            },
          ],
        },
        {
          name: "Transffered",
          icon: <RiFileTransferFill />,
          link: "/transfferedleads",
        },
        {
          name: "Unassigned",
          icon: <BsStopCircleFill />,
          submenu: [
            {
              name: "Fresh leads",
              count: sidebarData?.UNASSIGNED?.fresh,
              link: "/unassigned/fresh",
            },
            {
              name: "Cold leads",
              count: sidebarData?.UNASSIGNED?.cold,
              link: "/unassigned/cold",
            },
            {
              name: "Reshuffle Leads",
              count: sidebarData?.UNASSIGNED?.warm,
              link: "/unassigned/warm",
            },
            {
              name: "Personal leads",
              count: sidebarData?.UNASSIGNED?.personal,
              link: "/unassigned/personal",
            },
            {
              name: "Third Party",
              count: sidebarData?.UNASSIGNED?.third_party,
              link: "/unassigned/thirdpartyleads",
            },
          ],
        },
        {
          name: "Reshuffle",
          icon: <FaFire />,
          submenu: [
            {
              name: "All Leads",
              count: sidebarData?.WarmLeadCount?.all,
              link: "/warmleads/all",
            },
            {
              name: "New Leads",
              count: sidebarData?.WarmLeadCount?.new,
              link: "/warmleads/new",
            },
            {
              name: "No Answer",
              count: sidebarData?.WarmLeadCount?.no_nswer,
              link: "/warmleads/no answer",
            },
            {
              name: "Meeting",
              count: sidebarData?.WarmLeadCount?.Meeting,
              link: "/warmleads/meeting",
            },
            {
              name: "Follow Up",
              count: sidebarData?.WarmLeadCount?.follow_up,
              link: "/warmleads/follow up",
            },
            {
              name: "Low Budget",
              count: sidebarData?.WarmLeadCount?.low_budget,
              link: "/warmleads/low budget",
            },
            {
              name: "Not Intrested",
              count: sidebarData?.WarmLeadCount?.not_interested,
              link: "/warmleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.WarmLeadCount?.unreachable,
              link: "/warmleads/unreachable",
            },
          ],
        },
        {
          name: "Booked deals",
          icon: <ImBookmark />,
          link: "/booked",
        },
        {
          name: "Closed deals",
          icon: <ImLock />,
          link: "/closedeals",
        },
        {
          name: "Notes",
          icon: <MdSpeakerNotes />,
          link: "/leadnotes",
        },
      ],
    },
    {
      title: "Apps",
      links: [
        {
          name: "Appointments",
          icon: <BsCalendarWeekFill />,
          submenu: [
            {
              name: "Meetings",
              link: "/appointments/meetings",
            },
            {
              name: "Create Appointment",
              link: "/appointments/create",
            },
          ],
        },
        // {
        //   name: "Add Users",
        //   icon: <FaUser />,
        //   link: "/adminAuth/signup",
        // },
        {
          name: "Reports",
          icon: <HiDocumentReport />,
          link: "/reports",
        },
        {
          name: "Offers",
          icon: <AiFillGift />,
          link: "/offers",
        },
        {
          name: "Newsletter",
          icon: <BsEnvelopeFill />,
          link: "/newsletter",
        },
        {
          name: "Users",
          icon: <ImUsers />,
          link: "/users",
        },
        {
          name: "Clients",
          icon: <ImUsers />,
          link: "/clients",
        },
        {
          name: "Contacts",
          icon: <MdContactPage />,
          link: "/contacts",
        },
        {
          name: "Property Portfolio",
          icon: <RiBuilding2Fill />,
          link: "/propertyPortfolio",
        },
        {
          name: "Leaderboard",
          icon: <MdLeaderboard />,
          link: "/leaderboard",
        },
        // { name: "Leads Bitcoin", icon: <GrBitcoin /> },
      ],
    },
    {
      title: "Social Media",
      links: [
        {
          name: "statistics",
          icon: <FaChartLine />,
          link: "/statistics",
        },
        {
          name: "campaigns",
          icon: <FaFacebookSquare />,
          link: "/campaigns",
        },
        // { name: "Leads Bitcoin", icon: <GrBitcoin /> },
      ],
    },
    {
      title: "WHATSAPP",
      links: [
        {
          name: "Instances",
          icon: <RiWhatsappFill />,
          link: "/whatsapp-marketing/instances",
        },
        {
          name: "Messages",
          icon: <AiFillMessage />,
          link: "/whatsapp-marketing/messages",
        },
        {
          name: "Templates",
          icon: <FaMobile />,
          link: "/whatsapp-marketing/templates",
        },
        {
          name: "Payments",
          icon: <BsFillCreditCard2FrontFill />,
          link: "/whatsapp-marketing/payments",
        },
      ],
    },
    {
      title: "LOCATION",
      links: [
        {
          name: "Meetings",
          icon: <ImLocation size={20} />,
          link: "/location/livelocation",
        },
        {
          name: "Live",
          icon: <MdPersonPinCircle size={22} />,
          link: "/location/userlocation",
        },
      ],
    },
    {
      title: "SUPPORT",
      links: [
        {
          name: "QA ",
          icon: <AiOutlineQuestionCircle />,
          submenu: [
            {
              name: "QA Form",
              link: "/qaform",
            },
            {
              name: "All QA",
              link: "/allQA",
            },
          ],
        },
        {
          name: "Tickets",
          icon: <HiTicket />,
          link: "/support",
        },
      ],
    },
    {
      title: "ATTENDANCE",
      links: [
        {
          name: "Office Settings ",
          icon: <BiCalendar />,
          link: "/attendance/officeSettings",
        },
        {
          name: "Employees List",
          icon: <FiUsers />,
          link: "/attendance/employeesList",
        },
      ],
    },
  ];

  const [agentData, setAgentData] = useState(Agentlinks);
  const [linksData, setLinksData] = useState(links);
  const [managerData, setManagerData] = useState(Managerlinks);

  const FetchProfile = async (token) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      // If user data is stored in local storage, parse and set it in state
      setUser(JSON.parse(storedUser));
      setIsUserSubscribed(checkUser(JSON.parse(storedUser)));
      getAllLeadsMembers(JSON.parse(storedUser));
      console.log("User from navbar", User);
    } else {
      await axios
        .get(`${BACKEND_URL}/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((result) => {
          console.log("User data is");
          console.log(result.data);

          // Create a new object with only the specific fields you want to store
          const user = {
            addedBy: result.data.user[0].addedBy,
            addedFor: result.data.user[0].addedFor,
            agency: result.data.user[0].agency,
            created_at: result.data.user[0].created_at,
            creationDate: result.data.user[0].creationDate,
            displayImg: result.data.user[0].profile_picture,
            expiry_date: result.data.user[0].expiry_date,
            gender: result.data.user[0].gender,
            id: result.data.user[0].id,
            idExpiryDate: result.data.user[0].idExpiryDate,
            isParent: result.data.user[0].isParent,
            is_online: result.data.user[0].is_online,
            joiningDate: result.data.user[0].joiningDate,
            loginId: result.data.user[0].loginId,
            loginStatus: result.data.user[0].loginStatus,
            master: result.data.user[0].master,
            nationality: result.data.user[0].nationality,
            notes: result.data.user[0].notes,
            old_password: result.data.user[0].old_password,
            package_name: result.data.user[0].package_name,
            plusSales: result.data.user[0].plusSales,
            position: result.data.user[0].position,
            profile_picture: result.data.user[0].profile_picture,
            role: result.data.user[0].role,
            status: result.data.user[0].status,
            target: result.data.user[0].target,
            uid: result.data.user[0].uid,
            updated_at: result.data.user[0].updated_at,
            userEmail: result.data.user[0].userEmail,
            userName: result.data.user[0].userName,
            userType: result.data.user[0].userType,
          };

          setUser(user);
          setIsUserSubscribed(checkUser(user));
          getAllLeadsMembers(user);

          console.log("Localstorage: ", user);

          // Save user data to local storage
          localStorage.setItem("user", JSON.stringify(user));
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.status === 401) {
            setopenBackDrop(false);
            // setloading(false);

            localStorage.removeItem("auth-token");
            localStorage.removeItem("user");
            localStorage.removeItem("leadsData");
            navigate("/", {
              state: {
                error: "Please login to proceed.",
                continueURL: location.pathname,
              },
            });
            return;
          }
          toast.error("Sorry something went wrong. Kindly refresh the page.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    }
  };

  async function setSalesPersons(urls) {
    const token = localStorage.getItem("auth-token");
    const requests = urls.map((url) =>
      axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
    );
    const responses = await Promise.all(requests);
    const data = {};
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      if (response.data?.team[0]?.isParent) {
        const name = `manager-${response.data.team[0].isParent}`;
        data[name] = response.data.team;
      }
    }
    setSalesPerson(data);
    setAppLoading(false);
  }

  const getAllLeadsMembers = (user) => {
    setAppLoading(true);
    const token = localStorage.getItem("auth-token");
    axios
      .get(`${BACKEND_URL}/teamMembers/${user?.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        const agents = result.data?.team;
        setSalesPerson({ [`manager-${user?.id}`]: agents });
      });
    axios.get(`${BACKEND_URL}/managers`).then((result) => {
      console.log("manager response is");
      console.log(result);
      const managers = result?.data?.managers.data;
      setManagers(managers || []);
      const urls = managers?.map((manager) => {
        return `${BACKEND_URL}/teamMembers/${manager?.id}`;
      });

      setSalesPersons(urls || []);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (User?.id && User?.loginId) {
      FetchProfile(token);
    } else {
      if (token) {
        FetchProfile(token);
      } else {
        navigate("/", {
          state: {
            error: "Please login to proceed.",
            continueURL: location.pathname,
          },
        });
      }
    }

    // eslint-disable-next-line
  }, []);

  const checkUser = (user) => {
    const expiry = new Date(user?.expiry_date).getTime();
    const now = new Date().getTime();

    const isExpired = now > expiry;

    if (user?.role === 1) {
      return true;
    } else {
      return (
        isExpired === false &&
        user?.package_name?.length > 0 &&
        user?.package_name !== "unsubscribed"
      );
    }
  };

  useEffect(() => {
    if (!(User?.uid && User?.loginId)) {
      const token = localStorage.getItem("auth-token");
      if (token) {
        const user = localStorage.getItem("user");
        setUser(JSON.parse(user));
        setIsUserSubscribed(checkUser(JSON.parse(user)));
      } else {
        navigate("/", {
          state: {
            error: "Something Went Wrong! Please Try Again",
            continueURL: location.pathname,
          },
        });
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isUserSubscribed !== null && isUserSubscribed === true) {
      setAgentData([
        ...Agentlinks,
        {
          title: "WHATSAPP",
          links: [
            {
              name: "Instances",
              icon: <RiWhatsappFill />,
              link: "/whatsapp-marketing/instances",
            },
            {
              name: "Messages",
              icon: <AiFillMessage />,
              link: "/whatsapp-marketing/messages",
            },
            {
              name: "Templates",
              icon: <FaMobile />,
              link: "/whatsapp-marketing/templates",
            },
            {
              name: "Payments",
              icon: <BsFillCreditCard2FrontFill />,
              link: "/whatsapp-marketing/payments",
            },
          ],
        },
      ]);
      setManagerData([
        ...Managerlinks,
        {
          title: "WHATSAPP",
          links: [
            {
              name: "Instances",
              icon: <RiWhatsappFill />,
              link: "/whatsapp-marketing/instances",
            },
            {
              name: "Messages",
              icon: <AiFillMessage />,
              link: "/whatsapp-marketing/messages",
            },
            {
              name: "Templates",
              icon: <FaMobile />,
              link: "/whatsapp-marketing/templates",
            },
            {
              name: "Payments",
              icon: <BsFillCreditCard2FrontFill />,
              link: "/whatsapp-marketing/payments",
            },
          ],
        },
      ]);
    }
  }, [isUserSubscribed]);

  useEffect(() => {
    setAgentData([...Agentlinks]);
    setManagerData([...Managerlinks]);
    setLinksData([...links]);
  }, [sidebarData]);

  return (
    <div
      style={{ display: "flex", height: "100%" }}
      className={`max-w-[200px] z-[1000] sticky top-0 left-0 `}
    >
      <Sidebar
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: currentMode === "dark" ? "#000000" : "#ffffff",
          },
        }}
        className="h-screen sticky top-0"
      >
        <div className="mt-3">
        <div className="sidebar-top" style={{position: "sticky", top: 0, background: currentMode === "dark" ? "black" : "white", zIndex: 1000, }}>
          <div className="flex justify-between items-center h-[50px]">
            <a
              href="/dashboard"
              className="items-center gap-3 ml-3 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900 "
              onClick={() => {
                setSelected("Dashboard");
                setopenBackDrop(true);
              }}
            >
              {isCollapsed ? (
                <div className="flex items-center space-x-2">
                  <img
                    height={100}
                    width={100}
                    className="h-[40px] w-auto"
                    src="/favicon.png"
                    alt=""
                  />

                  <div className="relative">
                    <h1
                      className={`overflow-hidden ${
                        currentMode === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      HIKAL CRM
                    </h1>
                  </div>
                </div>
              ) : (
                <img
                  height={100}
                  width={100}
                  className="h-[40px] w-auto"
                  src="/favicon.png"
                  alt=""
                />
              )}
            </a>
          </div>
          <div className="profile-section border-t border-b mt-5 px-1 mb-5 pt-3 pb-3">
            {isCollapsed ? (
              <>
                <Link
                  to={"/profile"}
                  onClick={() => setopenBackDrop(true)}
                  className="flex flex-col items-center justify-center"
                >
                  <img
                    src={
                      User?.displayImg ? User?.displayImg : "/assets/user.png"
                    }
                    height={60}
                    width={60}
                    className="rounded-full object-cover"
                    alt=""
                  />
                  <h1
                    className={`my-2 font-bold text-lg ${
                      currentMode === "dark"
                        ? "text-white"
                        : "text-main-dark-bg"
                    }`}
                  >
                    {User?.userName ? User?.userName : "No username"}
                  </h1>
                  <span
                    className={`block rounded-md px-2 py-1 text-sm  bg-main-red-color text-white`}
                  >
                    {User?.position || ""}
                  </span>
                </Link>
              </>
            ) : (
              <Link to={"/profile"} onClick={() => setopenBackDrop(true)}>
                <img
                  src={User?.displayImg}
                  height={60}
                  width={60}
                  className="rounded-full cursor-pointer"
                  alt=""
                />
              </Link>
            )}
          </div>
          </div>
          <div className="mt-5 mb-5">
            <Menu
              menuItemStyles={{
                button: ({ level, active, disabled }) => {
                  // only apply styles on first level elements of the tree
                  if (level === 0) {
                    return {
                      color: currentMode === "dark" ? "#ffffff" : "#000000",
                    };
                  }
                },
              }}
            >
              {[
                ...(User?.position === "Founder & CEO"
                  ? linksData.map((item, index) => (
                      <div key={index}>
                        {!isCollapsed ? (
                          <Tooltip placement="right" title={item.title}>
                            <p
                              className={`font-bold m-3 mt-4 uppercase ${
                                index === 0 && "hidden"
                              } ${
                                currentMode === "dark"
                                  ? "text-red-600"
                                  : "text-red-600"
                              } ${
                                !isCollapsed
                                  ? "w-[16px] h-[16px] ml-[22px] rounded-sm bg-red-600"
                                  : ""
                              }`}
                            ></p>
                          </Tooltip>
                        ) : (
                          <p
                            className={`font-bold m-3 mt-4 uppercase ${
                              index === 0 && "hidden"
                            } ${
                              currentMode === "dark"
                                ? "text-red-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.title}
                          </p>
                        )}
                        {item.links.map((link, index) => (
                          <Tooltip
                            title={link.name}
                            key={link.name}
                            placement="right"
                          >
                            {link.submenu ? (
                              <Box
                              onClick={() => setOpenedSubMenu(index + 1)}
                                sx={{
                                  // FOR DARK MODE MENU SETTINGS
                                  "& .css-1mfnem1": { borderRadius: "5px" },
                                  "& .css-1mfnem1:hover": {
                                    backgroundColor: "#DA1F26",
                                  },
                                  // submenu containerr color
                                  "& .css-z5rm24": {
                                    backgroundColor:
                                      currentMode === "dark" && "#3b3d44",
                                    borderRadius: "5px",
                                  },
                                  // Submenu count color
                                  "& .css-1rnkhs0": {
                                    color: currentMode === "dark" && "white",
                                  },
                                  // LIGHT MODE SETTINGS
                                  "& .css-1ohfb25:hover": {
                                    backgroundColor: "#DA1F26",
                                    color: "white",
                                    borderRadius: "5px",
                                  },
                                  "& .css-wx7wi4": {
                                    width: "18px",
                                    minWidth: "18px",
                                  },
                                }}
                                className="my-1"
                              >
                                <SubMenu
                                  label={link.name}
                                  icon={link.icon}
                                  open={openedSubMenu === index + 1}
                                  // open={openBackDrop === index}
                                  onClick={() =>
                                    handleDropdownClick(`${index}`)
                                  }
                                >
                                  {link.submenu.map((menu, index) => {
                                    return (
                                      <Link
                                        key={index}
                                        to={`${menu.link}`}
                                        // onClick={() => setopenBackDrop(true)}
                                      >
                                        <Box
                                          sx={{
                                            // STYLING FOR LIGHT MODE
                                            "& .css-1mfnem1": {
                                              borderRadius: "5px",
                                            },
                                            "& .css-1mfnem1:hover": {
                                              backgroundColor: "#DA1F26",
                                            },
                                            "& .css-1ogoo8i": {
                                              backgroundColor: "#DA1F26",
                                            },

                                            // STYLING FOR DARK MODE
                                            "& .css-yktbuo": {
                                              backgroundColor: "#DA1F26",
                                            },
                                            "& .css-1f8bwsm": {
                                              minWidth: "10px !important",
                                            },
                                            "& .css-yktbuo:hover": {
                                              backgroundColor: "#DA1F26",
                                            },
                                            "& .css-1v6ithu": {
                                              color: "white",
                                            },
                                            "& .leads_counter": {
                                              color: menu?.countColor
                                                ? menu?.countColor
                                                : currentMode === "dark"
                                                ? "white"
                                                : "black",
                                            },
                                            "& .css-cveggr-MuiListItemIcon-root":
                                              {
                                                minWidth: "10px !important",
                                              },
                                          }}
                                          className="relative my-1"
                                        >
                                          <MenuItem
                                            active={selected === menu.name}
                                            onClick={() =>
                                              setSelected(menu.name)
                                            }
                                            className="flex"
                                          >
                                            {menu?.icon && (
                                              <ListItemIcon
                                                style={{
                                                  minWidth: "23px !important",
                                                }}
                                              >
                                                {menu?.icon}
                                              </ListItemIcon>
                                            )}{" "}
                                            <span className=" ">
                                              {" "}
                                              {menu?.name || ""}
                                            </span>
                                          </MenuItem>
                                          <span
                                            className="leads_counter block absolute right-5 top-5"
                                            // sx={{
                                            //   color: menu?.countColor,
                                            // }}
                                            style={{ marginTop: "-4px" }}
                                          >
                                            {menu?.count !== null
                                              ? menu?.count
                                              : ""}
                                          </span>
                                        </Box>
                                      </Link>
                                    );
                                  })}
                                </SubMenu>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  "& .css-1mfnem1": { borderRadius: "5px" },
                                  // hover bg color for dark mode
                                  "& .css-1mfnem1:hover": {
                                    backgroundColor: "#DA1F26",
                                  },
                                  // hover bg-color for light mode
                                  "& .css-1ohfb25:hover": {
                                    backgroundColor: "#DA1F26",
                                    color: "white",
                                    borderRadius: "5px",
                                  },
                                  // ACTIVE MENU ITEM STYLING FOR LIGHT MODE
                                  "& .css-xsmbnq": {
                                    backgroundColor: "#DA1F26",
                                    color: "white",
                                    borderRadius: "5px",
                                  },
                                  "& .css-xsmbnq:hover": {
                                    backgroundColor: "#DA1F26",
                                    color: "white",
                                    borderRadius: "5px",
                                  },
                                  // ACTIVE MENU STYLING FOR DARK MODE
                                  "& .css-yktbuo": {
                                    backgroundColor: "#DA1F26",
                                    borderRadius: "5px",
                                  },
                                  "& .css-yktbuo:hover": {
                                    backgroundColor: "#DA1F26",
                                  },
                                }}
                                className="my-1"
                              >
                                <MenuItem
                                  active={selected === link.name}
                                  onClick={() => setSelected(link.name)}
                                >
                                  <Link
                                    to={`${link.link}`}
                                    onClick={() => setopenBackDrop(true)}
                                  >
                                    <div className="flex items-center gap-4 pt-2 pb-2 rounded-lg text-md  ">
                                      <span
                                        className={`${
                                          !isCollapsed && "text-xl"
                                        }`}
                                      >
                                        {link?.icon || ""}
                                      </span>
                                      {isCollapsed && (
                                        <span className="capitalize">
                                          {link?.name || ""}
                                        </span>
                                      )}
                                    </div>
                                  </Link>
                                </MenuItem>
                              </Box>
                            )}
                          </Tooltip>
                        ))}
                      </div>
                    ))
                  : User?.position === "Sales Manager"
                  ? managerData.map((item, index) => (
                      <div key={index}>
                        {!isCollapsed ? (
                          <Tooltip placement="right" title={item.title}>
                            <p
                              className={`font-bold m-3 mt-4 uppercase ${
                                index === 0 && "hidden"
                              } ${
                                currentMode === "dark"
                                  ? "text-red-600"
                                  : "text-red-600"
                              } ${
                                !isCollapsed
                                  ? "w-[16px] h-[16px] ml-[22px] rounded-sm bg-red-600"
                                  : ""
                              }`}
                            ></p>
                          </Tooltip>
                        ) : (
                          <p
                            className={`font-bold m-3 mt-4 uppercase ${
                              index === 0 && "hidden"
                            } ${
                              currentMode === "dark"
                                ? "text-red-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.title}
                          </p>
                        )}
                        {item.links.map((link, index) => (
                          <Tooltip
                            title={link.name}
                            key={link.name}
                            placement="right"
                            onClick={() => setOpenedSubMenu(index + 1)}
                          >
                            {link.submenu ? (
                              <Box
                                sx={{
                                  // FOR DARK MODE MENU SETTINGS
                                  "& .css-1mfnem1": { borderRadius: "5px" },
                                  "& .css-1mfnem1:hover": {
                                    backgroundColor: "#DA1F26",
                                  },
                                  // submenu containerr color
                                  "& .css-z5rm24": {
                                    backgroundColor:
                                      currentMode === "dark" && "#3b3d44",
                                    borderRadius: "5px",
                                  },
                                  // Submenu count color
                                  "& .css-1rnkhs0": {
                                    color: currentMode === "dark" && "white",
                                  },
                                  // LIGHT MODE SETTINGS
                                  "& .css-1ohfb25:hover": {
                                    backgroundColor: "#DA1F26",
                                    color: "white",
                                    borderRadius: "5px",
                                  },
                                  "& .css-wx7wi4": {
                                    width: "18px",
                                    minWidth: "18px",
                                  },
                                }}
                                className="my-1"
                              >
                                <SubMenu open={openedSubMenu === index+ 1} label={link.name} icon={link.icon}>
                                  {link.submenu.map((menu, index) => {
                                    return (
                                      <Link
                                        key={index}
                                        to={`${menu.link}`}
                                        onClick={() => setopenBackDrop(true)}
                                      >
                                        <Box
                                          sx={{
                                            // STYLING FOR LIGHT MODE
                                            "& .css-1mfnem1": {
                                              borderRadius: "5px",
                                            },
                                            "& .css-1mfnem1:hover": {
                                              backgroundColor: "#DA1F26",
                                            },
                                            "& .css-1ogoo8i": {
                                              backgroundColor: "#DA1F26",
                                            },

                                            // STYLING FOR DARK MODE
                                            "& .css-yktbuo": {
                                              backgroundColor: "#DA1F26",
                                            },
                                            "& .css-yktbuo:hover": {
                                              backgroundColor: "#DA1F26",
                                            },
                                            "& .css-1v6ithu": {
                                              color: "white",
                                            },
                                            "& .leads_counter": {
                                              color:
                                                currentMode === "dark"
                                                  ? menu?.countColor
                                                  : "black",
                                            },
                                          }}
                                          className="relative my-1"
                                        >
                                          <MenuItem
                                            active={selected === menu.name}
                                            onClick={() =>
                                              setSelected(menu.name)
                                            }
                                          >
                                            {menu?.name}
                                          </MenuItem>
                                          <span className="leads_counter block absolute right-5 top-5">
                                            {menu?.count !== null
                                              ? menu?.count
                                              : ""}
                                          </span>
                                        </Box>
                                      </Link>
                                    );
                                  })}
                                </SubMenu>
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  "& .css-1mfnem1": { borderRadius: "5px" },
                                  // hover bg color for dark mode
                                  "& .css-1mfnem1:hover": {
                                    backgroundColor: "#DA1F26",
                                  },
                                  // hover bg-color for light mode
                                  "& .css-1ohfb25:hover": {
                                    backgroundColor: "#DA1F26",
                                    color: "white",
                                    borderRadius: "5px",
                                  },
                                  // ACTIVE MENU ITEM STYLING FOR LIGHT MODE
                                  "& .css-xsmbnq": {
                                    backgroundColor: "#DA1F26",
                                    color: "white",
                                    borderRadius: "5px",
                                  },
                                  "& .css-xsmbnq:hover": {
                                    backgroundColor: "#DA1F26",
                                    color: "white",
                                    borderRadius: "5px",
                                  },
                                  // ACTIVE MENU STYLING FOR DARK MODE
                                  "& .css-yktbuo": {
                                    backgroundColor: "#DA1F26",
                                    borderRadius: "5px",
                                  },
                                  "& .css-yktbuo:hover": {
                                    backgroundColor: "#DA1F26",
                                  },
                                }}
                                className="my-1"
                              >
                                <MenuItem
                                  active={selected === link.name}
                                  onClick={() => setSelected(link.name)}
                                >
                                  {link.link === "/contacts" ||
                                  link.link === "/dashboard" ? (
                                    <a
                                      href={link.link}
                                      onClick={() => setopenBackDrop(true)}
                                    >
                                      <div className="flex items-center gap-4 pt-2 pb-2 rounded-lg text-md  ">
                                        <span
                                          className={`${
                                            !isCollapsed && "text-xl"
                                          }`}
                                        >
                                          {link.icon}
                                        </span>
                                        {isCollapsed && (
                                          <span className="capitalize">
                                            {link.name}
                                          </span>
                                        )}
                                      </div>
                                    </a>
                                  ) : (
                                    <Link
                                      to={link.link}
                                      onClick={() => setopenBackDrop(true)}
                                    >
                                      <div className="flex items-center gap-4 pt-2 pb-2 rounded-lg text-md  ">
                                        <span
                                          className={`${
                                            !isCollapsed && "text-xl"
                                          }`}
                                        >
                                          {link?.icon || ""}
                                        </span>
                                        {isCollapsed && (
                                          <span className="capitalize">
                                            {link?.name || ""}
                                          </span>
                                        )}
                                      </div>
                                    </Link>
                                  )}
                                </MenuItem>
                              </Box>
                            )}
                          </Tooltip>
                        ))}
                      </div>
                    ))
                  : agentData.map((item, index) => {
                      console.log(item);
                      return (
                        <div key={index}>
                          {!isCollapsed ? (
                            <Tooltip placement="right" title={item.title}>
                              <p
                                className={`font-bold m-3 mt-4 uppercase ${
                                  index === 0 && "hidden"
                                } ${
                                  currentMode === "dark"
                                    ? "text-red-600"
                                    : "text-red-600"
                                } ${
                                  !isCollapsed
                                    ? "w-[16px] h-[16px] ml-[22px] rounded-sm bg-red-600"
                                    : ""
                                }`}
                              ></p>
                            </Tooltip>
                          ) : (
                            <p
                              className={`font-bold m-3 mt-4 uppercase ${
                                index === 0 && "hidden"
                              } ${
                                currentMode === "dark"
                                  ? "text-red-600"
                                  : "text-red-600"
                              }`}
                            >
                              {item.title}
                            </p>
                          )}
                          {item.links.map((link, index) => (
                            <Tooltip
                              title={link.name}
                              key={link.name}
                              placement="right"
                              onClick={() => setOpenedSubMenu(index + 1)}
                            >
                              {link.submenu ? (
                                <Box
                                  sx={{
                                    // FOR DARK MODE MENU SETTINGS
                                    "& .css-1mfnem1": { borderRadius: "5px" },
                                    "& .css-1mfnem1:hover": {
                                      backgroundColor: "#DA1F26",
                                    },
                                    // submenu containerr color
                                    "& .css-z5rm24": {
                                      backgroundColor:
                                        currentMode === "dark" && "#3b3d44",
                                      borderRadius: "5px",
                                    },
                                    // Submenu count color
                                    "& .css-1rnkhs0": {
                                      color: currentMode === "dark" && "white",
                                    },
                                    // LIGHT MODE SETTINGS
                                    "& .css-1ohfb25:hover": {
                                      backgroundColor: "#DA1F26",
                                      color: "white",
                                      borderRadius: "5px",
                                    },
                                    "& .css-wx7wi4": {
                                      width: "18px",
                                      minWidth: "18px",
                                    },
                                  }}
                                  className="my-1"
                                >
                                  <SubMenu open={openedSubMenu === index + 1} label={link.name} icon={link.icon}>
                                    {link.submenu.map((menu, index) => {
                                      return (
                                        <Link
                                          key={index}
                                          to={`${menu.link}`}
                                          onClick={() => {
                                            setopenBackDrop(true);
                                            console.log("Clicked");
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              // STYLING FOR LIGHT MODE
                                              "& .css-1mfnem1": {
                                                borderRadius: "5px",
                                              },
                                              "& .css-1mfnem1:hover": {
                                                backgroundColor: "#DA1F26",
                                              },
                                              "& .css-1ogoo8i": {
                                                backgroundColor: "#DA1F26",
                                              },

                                              // STYLING FOR DARK MODE
                                              "& .css-yktbuo": {
                                                backgroundColor: "#DA1F26",
                                              },
                                              "& .css-yktbuo:hover": {
                                                backgroundColor: "#DA1F26",
                                              },
                                              "& .css-1v6ithu": {
                                                color: "white",
                                              },
                                              "& .leads_counter": {
                                                color:
                                                  currentMode === "dark"
                                                    ? "white"
                                                    : "black",
                                              },
                                            }}
                                            className="relative my-1"
                                          >
                                            <MenuItem
                                              active={selected === menu.name}
                                              onClick={() =>
                                                setSelected(menu.name)
                                              }
                                            >
                                              {console.log(
                                                "Menudetail: ",
                                                menu?.count
                                              )}
                                              {menu?.name || ""}
                                            </MenuItem>
                                            <span className="leads_counter block absolute right-5 top-5">
                                              {menu?.count !== null
                                                ? menu?.count
                                                : ""}
                                            </span>
                                          </Box>
                                        </Link>
                                      );
                                    })}
                                  </SubMenu>
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    "& .css-1mfnem1": { borderRadius: "5px" },
                                    // hover bg color for dark mode
                                    "& .css-1mfnem1:hover": {
                                      backgroundColor: "#DA1F26",
                                    },
                                    // hover bg-color for light mode
                                    "& .css-1ohfb25:hover": {
                                      backgroundColor: "#DA1F26",
                                      color: "white",
                                      borderRadius: "5px",
                                    },
                                    // ACTIVE MENU ITEM STYLING FOR LIGHT MODE
                                    "& .css-xsmbnq": {
                                      backgroundColor: "#DA1F26",
                                      color: "white",
                                      borderRadius: "5px",
                                    },
                                    "& .css-xsmbnq:hover": {
                                      backgroundColor: "#DA1F26",
                                      color: "white",
                                      borderRadius: "5px",
                                    },
                                    // ACTIVE MENU STYLING FOR DARK MODE
                                    "& .css-yktbuo": {
                                      backgroundColor: "#DA1F26",
                                      borderRadius: "5px",
                                    },
                                    "& .css-yktbuo:hover": {
                                      backgroundColor: "#DA1F26",
                                    },
                                  }}
                                  className="my-1"
                                >
                                  <MenuItem
                                    active={selected === link.name}
                                    onClick={() => setSelected(link.name)}
                                  >
                                    {link.link === "/contacts" ||
                                    link.link === "/dashboard" ? (
                                      <a
                                        href={link.link}
                                        onClick={() => setopenBackDrop(true)}
                                      >
                                        <div className="flex items-center gap-4 pt-2 pb-2 rounded-lg text-md  ">
                                          <span
                                            className={`${
                                              !isCollapsed && "text-xl"
                                            }`}
                                          >
                                            {link.icon}
                                          </span>
                                          {isCollapsed && (
                                            <span className="capitalize">
                                              {link.name}
                                            </span>
                                          )}
                                        </div>
                                      </a>
                                    ) : (
                                      <Link
                                        to={link.link}
                                        onClick={() => setopenBackDrop(true)}
                                      >
                                        <div className="flex items-center gap-4 pt-2 pb-2 rounded-lg text-md  ">
                                          <span
                                            className={`${
                                              !isCollapsed && "text-xl"
                                            }`}
                                          >
                                            {link?.icon || ""}
                                          </span>
                                          {isCollapsed && (
                                            <span className="capitalize">
                                              {link?.name || ""}
                                            </span>
                                          )}
                                        </div>
                                      </Link>
                                    )}
                                  </MenuItem>
                                </Box>
                              )}
                            </Tooltip>
                          ))}
                        </div>
                      );
                    })),
              ]}
            </Menu>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};
export default Sidebarmui;
