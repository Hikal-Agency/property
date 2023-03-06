import { Box, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiFillGift, AiFillMessage } from "react-icons/ai";
import { FaLink, FaSnowflake, FaMobile } from "react-icons/fa";
import {
  BsStopCircleFill,
  BsCalendarWeekFill,
  BsFillCreditCard2FrontFill,
} from "react-icons/bs";
import { GrBitcoin, GrTransaction } from "react-icons/gr";
import { HiTicket, HiDocumentReport, HiUsers } from "react-icons/hi";
import {
  MdLeaderboard,
  MdPersonAdd,
  MdSpeakerNotes,
  MdContactPage,
  MdCreateNewFolder,
} from "react-icons/md";
import {
  RiWhatsappFill,
  RiDashboardFill,
  RiFileTransferFill,
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
import axios from "axios";
import { Link } from "react-router-dom";
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
  } = useStateContext();
  const [LeadsCount, setLeadsCount] = useState(false);
  const [HotLeadsCount, setHotLeadsCount] = useState();
  const [ColdLeadsCount, setColdLeadsCount] = useState();
  const [PersonalLeadsCount, setPersonalLeadsCount] = useState();
  const [ThirdPartLeadsCount, setThirdPartyLeadsCount] = useState();
  const [UnassignedLeadsCount, setUnassignedLeadsCount] = useState();

  const fetchHotLeads = (token) => {
    axios
      .get(`${BACKEND_URL}/sidebar/0`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        // console.log(result.data);
        setHotLeadsCount(result.data["HOT LEADS"]);
      });
  };
  const fetchColdLeads = (token) => {
    axios
      .get(`${BACKEND_URL}/sidebar/1`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setColdLeadsCount(result.data["COLD LEADS"]);
      });
  };
  const fetchPersonalLeads = (token) => {
    axios
      .get(`${BACKEND_URL}/sidebar/2`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setPersonalLeadsCount(result.data["PERSONAL LEADS"]);
      });
  };
  const fetchunassignedleads = (token) => {
    axios
      .get(`${BACKEND_URL}/sidebar/4`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setUnassignedLeadsCount(result.data["UNASSIGNED LEADS"]);
      });
  };

  const fetchthirdpartyleads = (token) => {
    axios
      .get(`${BACKEND_URL}/sidebar/3`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setThirdPartyLeadsCount(result.data["THIRD PARTY LEADS"]);
      });
  };
  useEffect(() => {
    if (!LeadsCount) {
      const token = localStorage.getItem("auth-token");
      fetchHotLeads(token);
      fetchColdLeads(token);
      fetchPersonalLeads(token);
      fetchthirdpartyleads(token);
      fetchunassignedleads(token);
      setLeadsCount(true);
    }
    // eslint-disable-next-line
  }, []);

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
          name: "Hot",
          icon: <SiHotjar />,
          submenu: [
            {
              name: "All",
              count:
                HotLeadsCount?.new +
                HotLeadsCount?.no_nswer +
                HotLeadsCount?.Meeting +
                HotLeadsCount?.follow_up +
                HotLeadsCount?.low_budget +
                HotLeadsCount?.not_interested +
                HotLeadsCount?.unreachable,
              link: "/hotleads/all",
            },
            {
              name: "New",
              count: HotLeadsCount?.new,
              link: "/hotleads/new",
            },
            {
              name: "No Answer",
              count: HotLeadsCount?.no_nswer,
              link: "/hotleads/no answer",
            },
            {
              name: "Meeting",
              count: HotLeadsCount?.Meeting,
              link: "/hotleads/meeting",
            },
            {
              name: "Follow Up",
              count: HotLeadsCount?.follow_up,
              link: "/hotleads/follow up",
            },
            {
              name: "Low Budget",
              count: HotLeadsCount?.low_budget,
              link: "/hotleads/low budget",
            },
            {
              name: "Not Interested",
              count: HotLeadsCount?.not_interested,
              link: "/hotleads/not interested",
            },
            {
              name: "Unreachable",
              count: HotLeadsCount?.unreachable,
              link: "/hotleads/unreachable",
            },
          ],
        },
        {
          name: "Personal",
          icon: <HiUsers />,
          submenu: [
            {
              name: "All",
              count:
                PersonalLeadsCount?.new +
                PersonalLeadsCount?.no_nswer +
                PersonalLeadsCount?.Meeting +
                PersonalLeadsCount?.follow_up +
                PersonalLeadsCount?.low_budget +
                PersonalLeadsCount?.not_interested +
                PersonalLeadsCount?.unreachable,
              link: "/personalleads/all",
            },
            {
              name: "New",
              count: PersonalLeadsCount?.new,
              link: "/personalleads/new",
            },
            {
              name: "No Answer",
              count: PersonalLeadsCount?.no_nswer,
              link: "/personalleads/no answer",
            },
            {
              name: "Meeting",
              count: PersonalLeadsCount?.Meeting,
              link: "/personalleads/meeting",
            },
            {
              name: "Follow Up",
              count: PersonalLeadsCount?.follow_up,
              link: "/personalleads/follow up",
            },
            {
              name: "Low Budget",
              count: PersonalLeadsCount?.low_budget,
              link: "/personalleads/low budget",
            },
            {
              name: "Not Interested",
              count: PersonalLeadsCount?.not_interested,
              link: "/personalleads/not interested",
            },
            {
              name: "Unreachable",
              count: PersonalLeadsCount?.unreachable,
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
              count:
                ThirdPartLeadsCount?.new +
                ThirdPartLeadsCount?.no_nswer +
                ThirdPartLeadsCount?.Meeting +
                ThirdPartLeadsCount?.follow_up +
                ThirdPartLeadsCount?.low_budget +
                ThirdPartLeadsCount?.not_interested +
                ThirdPartLeadsCount?.unreachable,
              link: "/thirdpartyleads/all",
            },
            {
              name: "New",
              count: ThirdPartLeadsCount?.new,
              link: "/thirdpartyleads/new",
            },
            {
              name: "No Answer",
              count: ThirdPartLeadsCount?.no_nswer,
              link: "/thirdpartyleads/no answer",
            },
            {
              name: "Meeting",
              count: ThirdPartLeadsCount?.Meeting,
              link: "/thirdpartyleads/meeting",
            },
            {
              name: "Follow Up",
              count: ThirdPartLeadsCount?.follow_up,
              link: "/thirdpartyleads/follow up",
            },
            {
              name: "Low Budget",
              count: ThirdPartLeadsCount?.low_budget,
              link: "/thirdpartyleads/low budget",
            },
            {
              name: "Not Interested",
              count: ThirdPartLeadsCount?.not_interested,
              link: "/thirdpartyleads/not interested",
            },
            {
              name: "Unreachable",
              count: ThirdPartLeadsCount?.unreachable,
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
              count:
                ColdLeadsCount?.new +
                ColdLeadsCount?.no_nswer +
                ColdLeadsCount?.Meeting +
                ColdLeadsCount?.follow_up +
                ColdLeadsCount?.low_budget +
                ColdLeadsCount?.not_interested +
                ColdLeadsCount?.unreachable,
              link: "/coldleads/all",
            },
            {
              name: "New",
              count: ColdLeadsCount?.new,
              link: "/coldleads/new",
            },
            {
              name: "Cold: Verified",
              count: "", //TODO
              link: "/coldLeadsVerified",
            },
            {
              name: "Cold: Invalid",
              count: "", //TODO
              link: "/coldLeadsInvalid",
            },
            {
              name: "Cold: Not Checked",
              count: "", //TODO
              link: "/coldLeadsNotChecked",
            },

            {
              name: "No Answer",
              count: ColdLeadsCount?.no_nswer,
              link: "/coldleads/no answer",
            },
            {
              name: "Meeting",
              count: ColdLeadsCount?.Meeting,
              link: "/coldleads/meeting",
            },
            {
              name: "Follow Up",
              count: ColdLeadsCount?.follow_up,
              link: "/coldleads/follow up",
            },
            {
              name: "Low Budget",
              count: ColdLeadsCount?.low_budget,
              link: "/coldleads/low budget",
            },
            {
              name: "Not Interested",
              count: ColdLeadsCount?.not_interested,
              link: "/coldleads/not interested",
            },
            {
              name: "Unreachable",
              count: ColdLeadsCount?.unreachable,
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
              name: "Hot leads",
              count: UnassignedLeadsCount?.hot,
              link: "/unassigned/fresh",
            },
            {
              name: "Cold leads",
              count: UnassignedLeadsCount?.cold,
              link: "/unassigned/cold",
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
          name: "Meetings",
          icon: <BsCalendarWeekFill />,
          link: "/meetings",
        },
        {
          name: "Reports",
          icon: <HiDocumentReport />,
        },
        {
          name: "Offers",
          icon: <AiFillGift />,
        },
        {
          name: "Users",
          icon: <ImUsers />,
        },
        {
          name: "Contacts",
          icon: <MdContactPage />,
          link: "/contacts",
        },

        {
          name: "Leaderboard",
          icon: <MdLeaderboard />,
          link: "/leaderboard",
        },
        { name: "Leads Bitcoin", icon: <GrBitcoin /> },
      ],
    },
    {
      title: "WHATSAPP MARKETING",
      links: [
        {
          name: "Dashboard",
          icon: <RiWhatsappFill />,
          link: "/whatsapp-marketing/dashboard",
        },
        {
          name: "Device",
          icon: <FaMobile />,
          link: "/whatsapp-marketing/device",
        },
        {
          name: "Messages",
          icon: <AiFillMessage />,
          link: "/whatsapp-marketing/messages",
        },
        {
          name: "Payments",
          icon: <BsFillCreditCard2FrontFill />,
          link: "/whatsapp-marketing/payments",
        },
        {
          name: "Transactions",
          icon: <GrTransaction />,
          link: "/whatsapp-marketing/transactions",
        },
      ],
    },
    {
      title: "LOCATION",
      links: [
        {
          name: "Upcoming meeting",
          icon: <ImLocation />,
          link: "/location/livelocation",
        },
      ],
    },
    {
      title: "CUSTOMER SUPPORT",
      links: [
        {
          name: "Create ticket",
          icon: <MdCreateNewFolder />,
          link: "/support/createticket",
        },
        {
          name: "All tickets",
          icon: <HiTicket />,
          link: "/support/alltickets",
        },
      ],
    },
  ];
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
              count: HotLeadsCount?.hot,
              link: "/hotleads/all",
            },
            {
              name: "New",
              count: HotLeadsCount?.new,
              link: "/hotleads/new",
            },
            {
              name: "No Answer",
              count: HotLeadsCount?.no_nswer,
              link: "/hotleads/no answer",
            },
            {
              name: "Meeting",
              count: HotLeadsCount?.Meeting,
              link: "/hotleads/meeting",
            },
            {
              name: "Follow Up",
              count: HotLeadsCount?.follow_up,
              link: "/hotleads/follow up",
            },
            {
              name: "Low Budget",
              count: HotLeadsCount?.low_budget,
              link: "/hotleads/low budget",
            },
            {
              name: "Not Interested",
              count: HotLeadsCount?.not_interested,
              link: "/hotleads/not interested",
            },
            {
              name: "Unreachable",
              count: HotLeadsCount?.unreachable,
              link: "/hotleads/unreachable",
            },
          ],
        },
        {
          name: "Personal",
          icon: <HiUsers />,
          submenu: [
            {
              name: "All",
              count:
                PersonalLeadsCount?.new +
                PersonalLeadsCount?.no_nswer +
                PersonalLeadsCount?.Meeting +
                PersonalLeadsCount?.follow_up +
                PersonalLeadsCount?.low_budget +
                PersonalLeadsCount?.not_interested +
                PersonalLeadsCount?.unreachable,
              link: "/personalleads/all",
            },
            {
              name: "New",
              count: PersonalLeadsCount?.new,
              link: "/personalleads/new",
            },
            {
              name: "No Answer",
              count: PersonalLeadsCount?.no_nswer,
              link: "/personalleads/no answer",
            },
            {
              name: "Meeting",
              count: PersonalLeadsCount?.Meeting,
              link: "/personalleads/meeting",
            },
            {
              name: "Follow Up",
              count: PersonalLeadsCount?.follow_up,
              link: "/personalleads/follow up",
            },
            {
              name: "Low Budget",
              count: PersonalLeadsCount?.low_budget,
              link: "/personalleads/low budget",
            },
            {
              name: "Not Interested",
              count: PersonalLeadsCount?.not_interested,
              link: "/personalleads/not interested",
            },
            {
              name: "Unreachable",
              count: PersonalLeadsCount?.unreachable,
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
              count:
                ThirdPartLeadsCount?.new +
                ThirdPartLeadsCount?.no_nswer +
                ThirdPartLeadsCount?.Meeting +
                ThirdPartLeadsCount?.follow_up +
                ThirdPartLeadsCount?.low_budget +
                ThirdPartLeadsCount?.not_interested +
                ThirdPartLeadsCount?.unreachable,
              link: "/thirdpartyleads/all",
            },
            {
              name: "New",
              count: ThirdPartLeadsCount?.new,
              link: "/thirdpartyleads/new",
            },
            {
              name: "No Answer",
              count: ThirdPartLeadsCount?.no_nswer,
              link: "/thirdpartyleads/no answer",
            },
            {
              name: "Meeting",
              count: ThirdPartLeadsCount?.Meeting,
              link: "/thirdpartyleads/meeting",
            },
            {
              name: "Follow Up",
              count: ThirdPartLeadsCount?.follow_up,
              link: "/thirdpartyleads/follow up",
            },
            {
              name: "Low Budget",
              count: ThirdPartLeadsCount?.low_budget,
              link: "/thirdpartyleads/low budget",
            },
            {
              name: "Not Interested",
              count: ThirdPartLeadsCount?.not_interested,
              link: "/thirdpartyleads/not interested",
            },
            {
              name: "Unreachable",
              count: ThirdPartLeadsCount?.unreachable,
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
              count:
                ColdLeadsCount?.new +
                ColdLeadsCount?.no_nswer +
                ColdLeadsCount?.Meeting +
                ColdLeadsCount?.follow_up +
                ColdLeadsCount?.low_budget +
                ColdLeadsCount?.not_interested +
                ColdLeadsCount?.unreachable,
              link: "/coldleads/all",
            },
            {
              name: "New",
              count: ColdLeadsCount?.new,
              link: "/coldleads/new",
            },

            {
              name: "No Answer",
              count: ColdLeadsCount?.no_nswer,
              link: "/coldleads/no answer",
            },
            {
              name: "Meeting",
              count: ColdLeadsCount?.Meeting,
              link: "/coldleads/meeting",
            },
            {
              name: "Follow Up",
              count: ColdLeadsCount?.follow_up,
              link: "/coldleads/follow up",
            },
            {
              name: "Low Budget",
              count: ColdLeadsCount?.low_budget,
              link: "/coldleads/low budget",
            },
            {
              name: "Not Interested",
              count: ColdLeadsCount?.not_interested,
              link: "/coldleads/not interested",
            },
            {
              name: "Unreachable",
              count: ColdLeadsCount?.unreachable,
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
          name: "Meetings",
          icon: <BsCalendarWeekFill />,
          link: "/meetings",
        },

        {
          name: "Contacts",
          icon: <MdContactPage />,
          link: "/contacts",
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
          name: "Unassigned",
          icon: <BsStopCircleFill />,
          submenu: [
            {
              // name: "Hot leads",
              // count: 10,
              // submenu: [
              //   {
              name: "Fresh Unassigned",
              count: UnassignedLeadsCount?.hot,
              // count:
              //   UnassignedLeadsCount?.new +
              //   UnassignedLeadsCount?.no_nswer +
              //   UnassignedLeadsCount?.Meeting +
              //   UnassignedLeadsCount?.follow_up +
              //   UnassignedLeadsCount?.low_budget +
              //   UnassignedLeadsCount?.not_interested +
              //   UnassignedLeadsCount?.unreachable,
              link: "/unassigned/fresh",
            },
            {
              name: "New",
              count: UnassignedLeadsCount?.new,
              link: "/unassigned/new",
            },
            {
              name: "No Answer",
              count: UnassignedLeadsCount?.no_nswer,
              link: "/unassigned/no answer",
            },
            {
              name: "Meeting",
              count: UnassignedLeadsCount?.Meeting,
              link: "/unassigned/meeting",
            },
            {
              name: "Follow Up",
              count: UnassignedLeadsCount?.follow_up,
              link: "/unassigned/follow up",
            },
            {
              name: "Low Budget",
              count: UnassignedLeadsCount?.low_budget,
              link: "/unassigned/low budget",
            },
            {
              name: "Not Interested",
              count: UnassignedLeadsCount?.not_interested,
              link: "/unassigned/not interested",
            },
            {
              name: "Unreachable",
              count: UnassignedLeadsCount?.unreachable,
              link: "/unassigned/unreachable",
            },
            // ],
            // },
            {
              name: "Cold Unassigned",
              count: UnassignedLeadsCount?.cold,
              link: "/unassigned/cold",
            },
          ],
        },
        {
          name: "Fresh",
          icon: <SiHotjar />,
          submenu: [
            {
              name: "All",
              count: HotLeadsCount?.hot,
              link: "/hotleads/all",
            },
            {
              name: "New",
              count: HotLeadsCount?.new,
              link: "/hotleads/new",
            },
            {
              name: "No Answer",
              count: HotLeadsCount?.no_nswer,
              link: "/hotleads/no answer",
            },
            {
              name: "Meeting",
              count: HotLeadsCount?.Meeting,
              link: "/hotleads/meeting",
            },
            {
              name: "Follow Up",
              count: HotLeadsCount?.follow_up,
              link: "/hotleads/follow up",
            },
            {
              name: "Low Budget",
              count: HotLeadsCount?.low_budget,
              link: "/hotleads/low budget",
            },
            {
              name: "Not Interested",
              count: HotLeadsCount?.not_interested,
              link: "/hotleads/not interested",
            },
            {
              name: "Unreachable",
              count: HotLeadsCount?.unreachable,
              link: "/hotleads/unreachable",
            },
          ],
        },
        {
          name: "Personal",
          icon: <HiUsers />,
          submenu: [
            {
              name: "All",
              count:
                PersonalLeadsCount?.new +
                PersonalLeadsCount?.no_nswer +
                PersonalLeadsCount?.Meeting +
                PersonalLeadsCount?.follow_up +
                PersonalLeadsCount?.low_budget +
                PersonalLeadsCount?.not_interested +
                PersonalLeadsCount?.unreachable,
              link: "/personalleads/all",
            },
            {
              name: "New",
              count: PersonalLeadsCount?.new,
              link: "/personalleads/new",
            },
            {
              name: "No Answer",
              count: PersonalLeadsCount?.no_nswer,
              link: "/personalleads/no answer",
            },
            {
              name: "Meeting",
              count: PersonalLeadsCount?.Meeting,
              link: "/personalleads/meeting",
            },
            {
              name: "Follow Up",
              count: PersonalLeadsCount?.follow_up,
              link: "/personalleads/follow up",
            },
            {
              name: "Low Budget",
              count: PersonalLeadsCount?.low_budget,
              link: "/personalleads/low budget",
            },
            {
              name: "Not Interested",
              count: PersonalLeadsCount?.not_interested,
              link: "/personalleads/not interested",
            },
            {
              name: "Unreachable",
              count: PersonalLeadsCount?.unreachable,
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
              count:
                ThirdPartLeadsCount?.new +
                ThirdPartLeadsCount?.no_nswer +
                ThirdPartLeadsCount?.Meeting +
                ThirdPartLeadsCount?.follow_up +
                ThirdPartLeadsCount?.low_budget +
                ThirdPartLeadsCount?.not_interested +
                ThirdPartLeadsCount?.unreachable,
              link: "/thirdpartyleads/all",
            },
            {
              name: "New",
              count: ThirdPartLeadsCount?.new,
              link: "/thirdpartyleads/new",
            },
            {
              name: "No Answer",
              count: ThirdPartLeadsCount?.no_nswer,
              link: "/thirdpartyleads/no answer",
            },
            {
              name: "Meeting",
              count: ThirdPartLeadsCount?.Meeting,
              link: "/thirdpartyleads/meeting",
            },
            {
              name: "Follow Up",
              count: ThirdPartLeadsCount?.follow_up,
              link: "/thirdpartyleads/follow up",
            },
            {
              name: "Low Budget",
              count: ThirdPartLeadsCount?.low_budget,
              link: "/thirdpartyleads/low budget",
            },
            {
              name: "Not Interested",
              count: ThirdPartLeadsCount?.not_interested,
              link: "/thirdpartyleads/not interested",
            },
            {
              name: "Unreachable",
              count: ThirdPartLeadsCount?.unreachable,
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
              count:
                ColdLeadsCount?.new +
                ColdLeadsCount?.no_nswer +
                ColdLeadsCount?.Meeting +
                ColdLeadsCount?.follow_up +
                ColdLeadsCount?.low_budget +
                ColdLeadsCount?.not_interested +
                ColdLeadsCount?.unreachable,
              link: "/coldleads/all",
            },
            {
              name: "New",
              count: ColdLeadsCount?.new,
              link: "/coldleads/new",
            },

            {
              name: "No Answer",
              count: ColdLeadsCount?.no_nswer,
              link: "/coldleads/no answer",
            },
            {
              name: "Meeting",
              count: ColdLeadsCount?.Meeting,
              link: "/coldleads/meeting",
            },
            {
              name: "Follow Up",
              count: ColdLeadsCount?.follow_up,
              link: "/coldleads/follow up",
            },
            {
              name: "Low Budget",
              count: ColdLeadsCount?.low_budget,
              link: "/coldleads/low budget",
            },
            {
              name: "Not Interested",
              count: ColdLeadsCount?.not_interested,
              link: "/coldleads/not interested",
            },
            {
              name: "Unreachable",
              count: ColdLeadsCount?.unreachable,
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
          name: "Meetings",
          icon: <BsCalendarWeekFill />,
          link: "/meetings",
        },

        {
          name: "Contacts",
          icon: <MdContactPage />,
          link: "/contacts",
        },
      ],
    },
  ];
  // const [UserLinks, setUserLinks] = useState(
  //   User.position === "Founder & CEO" ? links : Agentlinks
  // );

  return (
    <div
      style={{ display: "flex", height: "100%" }}
      className={`max-w-[250px] sticky top-0 left-0 `}
    >
      <Sidebar
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: currentMode === "dark" ? "#000000" : "#ffffff",
          },
        }}
        className="h-screen sticky top-0"
      >
        <div className="px-2 mt-3">
          <div className="flex justify-between items-center h-[50px]">
            <Link
              to="/dashboard"
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
            </Link>
          </div>
          <div className="profile-section border-t border-b mt-5 mb-5 pt-3 pb-3">
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
                    {User?.position}
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
              {User?.position === "Founder & CEO"
                ? links.map((item, index) => (
                    <div key={index}>
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
                      {item.links.map((link) => (
                        <Tooltip
                          title={link.name}
                          key={link.name}
                          placement="right"
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
                              <SubMenu label={link.name} icon={link.icon}>
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
                                                ? "white"
                                                : "black",
                                          },
                                        }}
                                        className="relative my-1"
                                      >
                                        <MenuItem
                                          active={selected === menu.name}
                                          onClick={() => setSelected(menu.name)}
                                        >
                                          {menu?.name}
                                        </MenuItem>
                                        <span className="leads_counter block absolute right-5 top-5">
                                          {menu?.count}
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
                                      className={`${!isCollapsed && "text-xl"}`}
                                    >
                                      {link.icon}
                                    </span>
                                    {isCollapsed && (
                                      <span className="capitalize">
                                        {link.name}
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
                ? Managerlinks.map((item, index) => (
                    <div key={index}>
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
                      {item.links.map((link) => (
                        <Tooltip
                          title={link.name}
                          key={link.name}
                          placement="right"
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
                              <SubMenu label={link.name} icon={link.icon}>
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
                                                ? "white"
                                                : "black",
                                          },
                                        }}
                                        className="relative my-1"
                                      >
                                        <MenuItem
                                          active={selected === menu.name}
                                          onClick={() => setSelected(menu.name)}
                                        >
                                          {menu?.name}
                                        </MenuItem>
                                        <span className="leads_counter block absolute right-5 top-5">
                                          {menu?.count}
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
                                        {link.icon}
                                      </span>
                                      {isCollapsed && (
                                        <span className="capitalize">
                                          {link.name}
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
                : Agentlinks.map((item, index) => (
                    <div key={index}>
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
                      {item.links.map((link) => (
                        <Tooltip
                          title={link.name}
                          key={link.name}
                          placement="right"
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
                              <SubMenu label={link.name} icon={link.icon}>
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
                                                ? "white"
                                                : "black",
                                          },
                                        }}
                                        className="relative my-1"
                                      >
                                        <MenuItem
                                          active={selected === menu.name}
                                          onClick={() => setSelected(menu.name)}
                                        >
                                          {menu?.name}
                                        </MenuItem>
                                        <span className="leads_counter block absolute right-5 top-5">
                                          {menu?.count}
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
                                        {link.icon}
                                      </span>
                                      {isCollapsed && (
                                        <span className="capitalize">
                                          {link.name}
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
                  ))}
            </Menu>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};
export default Sidebarmui;
