import { Box, IconButton, ListItemIcon, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { AiFillGift } from "react-icons/ai";
import { FaLink, FaSnowflake, FaMobile, FaInbox } from "react-icons/fa";
import { socket } from "../../Pages/App";
import {
  BsStopCircleFill,
  BsCalendarWeekFill,
  BsFillCreditCard2FrontFill,
  BsCircleFill,
} from "react-icons/bs";

import { MdOutlinePayment } from "react-icons/md";
import { AiTwotoneCalendar } from "react-icons/ai";

import { HiTicket, HiDocumentReport, HiUsers, HiSearch } from "react-icons/hi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsEnvelopeFill, BsFillLayersFill } from "react-icons/bs";
import { FaFacebookSquare, FaUsers, FaHandshake } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { RiRadioButtonLine } from "react-icons/ri";
import { BiBlock } from "react-icons/bi";
import { BiCalendar, BiSupport } from "react-icons/bi";
import { MdApps } from "react-icons/md";
import { FiSettings, FiUsers } from "react-icons/fi";
import { FaRandom } from "react-icons/fa";
import { BsPersonFillLock } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { GoBrowser } from "react-icons/go";
import ringtone from "../../assets/new-message-ringtone.mp3";
import notifRingtone from "../../assets/notification-ringtone.mp3";
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
import { useProSidebar } from "react-pro-sidebar";
import { MdCampaign } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import { ImLock, ImUsers, ImLocation } from "react-icons/im";

import axios from "../../axoisConfig";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import usePermission from "../../utils/usePermission";
import { FaArchive } from "react-icons/fa";

// import { Link as NextLink } from "next/link";

const Sidebarmui = () => {
  const {
    currentMode,
    User,
    isCollapsed,
    setSelected,
    setopenBackDrop,
    BACKEND_URL,
    isUserSubscribed,
    setUser,
    setIsUserSubscribed,
    setSalesPerson,
    setManagers,
    setAppLoading,
    fetchSidebarData,
    setPermits,
    setIsCollapsed,
    sidebarData,
    setUnreadNotifsCount,
    setNotifIconAnimating,
    getNotifCounts,
  } = useStateContext();

  const [activeSidebarHeading, setActiveSidebarHeading] = useState(1);
  const [newMessageReceived, setNewMessageReceived] = useState(false);
  const [messagesCount, setMessagesCount] = useState(0);
  const [blink, setBlink] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const ringtoneElem = useRef();
  const notifRingtoneElem = useRef();
  const { hasPermission } = usePermission();
  const { collapseSidebar } = useProSidebar();

  const [openedSubMenu, setOpenSubMenu] = useState({
    menuIndex: 0,
    linkIndex: 0,
    sub: false,
  });

  const setOpenedSubMenu = ({ menuIndex, linkIndex, sub = false }) => {
    if (sub) {
      if (openedSubMenu?.sub) {
        setOpenSubMenu({
          menuIndex,
          linkIndex,
          sub: false,
        });
      } else {
        setOpenSubMenu({
          menuIndex,
          linkIndex,
          sub: true,
        });
      }
    } else if (
      openedSubMenu.menuIndex === menuIndex &&
      openedSubMenu.linkIndex === linkIndex
    ) {
      setOpenSubMenu(0);
    } else {
      setOpenSubMenu({ menuIndex, linkIndex, sub: false });
    }
  };

  const handleExpand = (e, obj, isMenuDeep = false) => {
    if (isMenuDeep === true) {
      if (!e.target.closest(".sub .ps-submenu-content")) {
        setOpenedSubMenu(obj);
      }
    } else {
      if (!e.target.closest(".ps-submenu-content")) {
        setOpenedSubMenu(obj);
      }
    }
  };

  const handleExpandHeading = (e, headingIndex) => {
    if (!e.target.closest(".ps-submenu-content")) {
      if (headingIndex === activeSidebarHeading) {
        setActiveSidebarHeading("");
      } else {
        setActiveSidebarHeading("");
        setTimeout(() => {
          setActiveSidebarHeading(headingIndex);
        }, 0);
      }

      setOpenedSubMenu(0);
    }
  };

  const FetchPermissions = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      axios
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

          const allPermissions = result.data.roles.permissions;
          setPermits(allPermissions);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const FetchProfile = async (token) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      // If user data is stored in local storage, parse and set it in state
      setUser(JSON.parse(storedUser));
      setIsUserSubscribed(checkUser(JSON.parse(storedUser)));
      getAllLeadsMembers(JSON.parse(storedUser));
      FetchPermissions();
      socket.emit("add_user", { ...JSON.parse(storedUser) });
    } else {
      axios
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
            permissions: result.data.roles.permissions,
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
            userContact: result.data.user[0].userContact,
            userName: result.data.user[0].userName,
            userType: result.data.user[0].userType,
            is_alert: result.data.user[0].is_alert,
          };

          setUser(user);
          setIsUserSubscribed(checkUser(user));
          getAllLeadsMembers(user);

          FetchPermissions();
          socket.emit("add_user", {
            ...user,
          });

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

  const getAllLeadsMembers = (user) => {
    setAppLoading(true);
    const token = localStorage.getItem("auth-token");
    axios
      .get(`${BACKEND_URL}/getTree`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        const managers = result?.data?.data?.filter(
          (manager) => manager?.agency === 1
        );
        setManagers(managers || []);
        const agents = {};
        managers?.forEach((manager) => {
          if (manager?.agents?.length > 0) {
            agents[`manager-${manager?.id}`] = manager?.agents?.filter(
              (agent) => agent?.agency === 1
            );
          }
        });
        setSalesPerson(agents || []);

        console.log("Tree:", managers, agents);

        setAppLoading(false);
      });
  };

  useEffect(() => {
    fetchSidebarData();
  }, []);

  useEffect(() => {
    const setUnreadCount = async (isNoToast = false) => {
      try {
        const token = localStorage.getItem("auth-token");
        const response = await axios.get(
          `${BACKEND_URL}/unreadCount?user_id=${User?.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const notifsCount = response.data.count || 0;
        setUnreadNotifsCount(notifsCount);

        if (isNoToast) {
          setNotifIconAnimating(true);
          setTimeout(() => {
            setNotifIconAnimating(false);
          }, 2000);
        }
        notifRingtoneElem?.current.play();
      } catch (err) {
        console.log(err);
      }
    };

    if (User?.id) {
      getNotifCounts();

      const notificationToastSettings = {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      };
      socket.on("notification_stripe", (data) => {
        console.log("Stripe: ", data);
      });

      socket.on("notification_reminder", (data) => {
        console.log("Reminder: ", data);
      });

      socket.on("notification_lead_manager_assigned", (data) => {
        // toast.success(
        //   `Lead ${data?.leadName} has been assigned to ${data?.newManager} by ${data?.by}`,
        //   notificationToastSettings
        // );
        setUnreadCount(true);
      });

      socket.on("notification_lead_agent_assigned", (data) => {
        // toast.success(
        //   `Lead ${data?.leadName} has been assigned to ${data?.newAgent} by ${data?.by}`,
        //   notificationToastSettings
        // );
        setUnreadCount(true);
      });

      socket.on("notification_ticket_updated", (data) => {
        toast.success(
          `Status of ticket ${data?.ticketNumber} has been updated to ${data?.newStatus}`,
          notificationToastSettings
        );
        setUnreadCount();
      });

      socket.on("notification_ticket_updated", (data) => {
        toast.success(
          `Status of ticket ${data?.ticketNumber} has been updated to ${data?.newStatus}`,
          notificationToastSettings
        );
        setUnreadCount();
      });

      socket.on("notification_meeting_scheduled", (data) => {
        toast.success(
          `Countdown to victory! Your meeting with ${data?.leadName} is scheduled for ${data?.meetingDate} at ${data?.meetingTime}`,
          notificationToastSettings
        );
        setUnreadCount();
      });

      socket.on("notification_deal_closed", (data) => {
        toast.success(
          `${data?.closedByName} closed a unit of ${data?.project} at AED ${
            data?.amount || 0
          }`,
          notificationToastSettings
        );
        setUnreadCount();
      });

      socket.on("notification_lead_added", (data) => {
        toast.success(
          `Lead ${data?.leadName} has been assigned by ${data?.by}`,
          notificationToastSettings
        );
        setUnreadCount();
      });

      socket.on("notification_feedback_updated", (data) => {
        // toast.success(
        //   `Feedback for ${data?.leadName} has been updated to ${data?.newFeedback} by ${data?.by}`,
        //   notificationToastSettings
        // );
        setUnreadCount(true);
      });

      socket.on("notification_priority_updated", (data) => {
        // toast.success(
        //   `Priority for ${data?.leadName} has been updated to ${data?.newPriority} by ${data?.by}`,
        //   notificationToastSettings
        // );
        setUnreadCount(true);
      });

      socket.on("notification_ticket_added", (data) => {
        toast.success(
          `The ticket ${data?.ticketNumber} for the ${data?.ticketCategory} category has been created successfully`,
          notificationToastSettings
        );
        setUnreadCount();
      });
    }
  }, [User]);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (User?.id && User?.loginId) {
      FetchProfile(token);
    } else {
      if (token) {
        FetchProfile(token);
      } else {
        if (document.location.pathname !== "/fresh-logs") {
          navigate("/", {
            state: {
              error: "Please login to proceed.",
              continueURL: location.pathname,
            },
          });
        }
      }
    }

    // eslint-disable-next-line
  }, []);

  const checkUser = (user) => {
    if (user?.id) {
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
        if (document.location.pathname !== "/fresh-logs") {
          navigate("/", {
            state: {
              error: "Something Went Wrong! Please Try Again",
              continueURL: location.pathname,
            },
          });
        }
      }
    }
    // eslint-disable-next-line
  }, []);

  let links = [
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
      title: "Leads",
      icon: <FaUsers />,
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
              name: "Fresh leads",
              link: "/unassigned/fresh",
              count: sidebarData?.UNASSIGNED?.fresh,
            },
            {
              name: "Cold leads",
              count: sidebarData?.UNASSIGNED?.cold,
              link: "/unassigned/coldleads",
            },
            {
              name: "Archived Leads",
              count: sidebarData?.UNASSIGNED?.warm,
              link: "/unassigned/archive",
            },
            {
              name: "Personal leads",
              count: sidebarData?.UNASSIGNED?.personal,
              link: "/unassigned/personalleads",
            },
            {
              name: "Third Party",
              count: sidebarData?.UNASSIGNED?.third_party,
              link: "/unassigned/thirdpartyleads",
            },
          ],
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
              name: "Follow Up",
              count: sidebarData?.HotLeadsCount?.follow_up,
              link: "/freshleads/follow up",
            },
            {
              name: "Meeting",
              count: sidebarData?.HotLeadsCount?.Meeting,
              link: "/freshleads/meeting",
            },
            {
              name: "Low Budget",
              count: sidebarData?.HotLeadsCount?.low_budget,
              link: "/freshleads/low budget",
            },
            {
              name: "No Answer",
              count: sidebarData?.HotLeadsCount?.no_nswer,
              link: "/freshleads/no answer",
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
              name: "Follow Up",
              count: sidebarData?.ThirdPartyLeadsCount?.follow_up,
              link: "/thirdpartyleads/follow up",
            },
            {
              name: "Meeting",
              count: sidebarData?.ThirdPartyLeadsCount?.Meeting,
              link: "/thirdpartyleads/meeting",
            },
            {
              name: "Low Budget",
              count: sidebarData?.ThirdPartyLeadsCount?.low_budget,
              link: "/thirdpartyleads/low budget",
            },
            {
              name: "No Answer",
              count: sidebarData?.ThirdPartyLeadsCount?.no_nswer,
              link: "/thirdpartyleads/no answer",
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
              name: "Verified",
              count: sidebarData?.ColdLeadsCount?.verified, //TODO
              link: "/coldleads/coldLeadsVerified",
              icon: <RiRadioButtonLine style={{ color: "#40B74F" }} />,
              countColor: "#008000",
            },
            {
              name: "Invalid",
              count: sidebarData?.ColdLeadsCount?.unverified, //TODO
              link: "/coldleads/coldLeadsInvalid",
              icon: <RiRadioButtonLine style={{ color: "#DA1F26" }} />,
              countColor: "#FF0000",
            },
            {
              name: "Not Checked",
              count: sidebarData?.ColdLeadsCount?.unchecked, //TODO
              link: "/coldleads/coldLeadsNotChecked",
              icon: <RiRadioButtonLine style={{ color: "#FFCF49" }} />,
              countColor: "#FFA500",
            },
            {
              name: "New",
              count: sidebarData?.ColdLeadsCount?.new,
              link: "/coldleads/new",
            },
            {
              name: "Follow Up",
              count: sidebarData?.ColdLeadsCount?.follow_up,
              link: "/coldleads/follow up",
            },
            {
              name: "Meeting",
              count: sidebarData?.ColdLeadsCount?.Meeting,
              link: "/coldleads/meeting",
            },
            {
              name: "Low Budget",
              count: sidebarData?.ColdLeadsCount?.low_budget,
              link: "/coldleads/low budget",
            },
            {
              name: "No Answer",
              count: sidebarData?.ColdLeadsCount?.no_nswer,
              link: "/coldleads/no answer",
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
          name: "Reshuffle",
          icon: <FaRandom />,
          // link: "/reshuffleleads",
          submenu: [
            {
              name: "All",
              count: sidebarData?.Reshuffle?.fresh,
              link: "/reshuffleleads/all",
            },
            {
              name: "New",
              count: sidebarData?.Reshuffle?.new,
              link: "/reshuffleleads/new",
            },
            {
              name: "Follow Up",
              count: sidebarData?.Reshuffle?.follow_up,
              link: "/reshuffleleads/follow up",
            },
            {
              name: "Meeting",
              count: sidebarData?.Reshuffle?.meeting,
              link: "/reshuffleleads/meeting",
            },
            {
              name: "Low Budget",
              count: sidebarData?.Reshuffle?.low_budget,
              link: "/reshuffleleads/low budget",
            },
            {
              name: "No Answer",
              count: sidebarData?.Reshuffle?.no_answer,
              link: "/reshuffleleads/no answer",
            },
            {
              name: "Not Interested",
              count: sidebarData?.Reshuffle?.not_interested,
              link: "/reshuffleleads/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.Reshuffle?.unreachable,
              link: "/reshuffleleads/unreachable",
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
              name: "Follow Up",
              count: sidebarData?.PersonalLeadsCount?.follow_up,
              link: "/personalleads/follow up",
            },
            {
              name: "Meeting",
              count: sidebarData?.PersonalLeadsCount?.Meeting,
              link: "/personalleads/meeting",
            },
            {
              name: "Low Budget",
              count: sidebarData?.PersonalLeadsCount?.low_budget,
              link: "/personalleads/low budget",
            },
            {
              name: "No Answer",
              count: sidebarData?.PersonalLeadsCount?.no_nswer,
              link: "/personalleads/no answer",
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
          name: "Archived Leads",
          icon: <FaArchive />,
          submenu: [
            {
              name: "All Leads",
              count: sidebarData?.WarmLeadCount?.all,
              link: "/archive/all",
            },
            {
              name: "New Leads",
              count: sidebarData?.WarmLeadCount?.new,
              link: "/archive/new",
            },
            {
              name: "Follow Up",
              count: sidebarData?.WarmLeadCount?.follow_up,
              link: "/archive/follow up",
            },
            {
              name: "Meeting",
              count: sidebarData?.WarmLeadCount?.Meeting,
              link: "/archive/meeting",
            },
            {
              name: "Low Budget",
              count: sidebarData?.WarmLeadCount?.low_budget,
              link: "/archive/low budget",
            },
            {
              name: "No Answer",
              count: sidebarData?.WarmLeadCount?.no_nswer,
              link: "/archive/no answer",
            },
            {
              name: "Not Intrested",
              count: sidebarData?.WarmLeadCount?.not_interested,
              link: "/archive/not interested",
            },
            {
              name: "Unreachable",
              count: sidebarData?.WarmLeadCount?.unreachable,
              link: "/archive/unreachable",
            },
          ],
        },

        {
          name: "Notes",
          icon: <MdSpeakerNotes />,
          link: "/leadnotes",
        },
        {
          name: "Search",
          icon: <HiSearch />,
          link: "/search",
        },
      ],
    },
    {
      title: "Deals",
      icon: <FaHandshake />,
      links: [
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
      ],
    },
    {
      title: "Apps",
      icon: <MdApps />,
      links: [
        {
          name: "Appointments",
          icon: <BsCalendarWeekFill />,
          link: "/appointments",
        },
        {
          name: "Roles",
          icon: <BsPersonFillLock />,
          link: "/roles",
        },
        {
          name: "Meetings",
          icon: <BsCalendarWeekFill />,
          link: "/meetings",
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
        // {
        //   name: "Contacts",
        //   icon: <MdContactPage />,
        //   link: "/contacts",
        // },
        {
          name: "Blocked IPs",
          icon: <BiBlock />,
          link: "/blocked",
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
      title: "LOCATION",
      icon: <MdLocationOn />,
      links: [
        {
          name: "Meetings",
          icon: <ImLocation size={20} />,
          link: "/location/meetinglocation",
        },
        {
          name: "Live",
          icon: <MdPersonPinCircle size={22} />,
          link: "/location/userlocation",
        },
      ],
    },
    {
      title: "Social Media",
      icon: <GoBrowser />,
      links: [
        {
          name: "Facebook",
          // icon: <FaChartLine />,
          icon: <FaFacebookSquare />,
          link: "/facebook",
        },
        // {
        //   name: "campaigns",
        //   icon: <FaFacebookSquare />,
        //   link: "/campaigns",
        // },
        // { name: "Leads Bitcoin", icon: <GrBitcoin /> },
      ],
    },
    {
      title: "BILLINGS",
      icon: <MdOutlinePayment />,
      links: [
        {
          name: "Payments",
          icon: <BsFillCreditCard2FrontFill />,
          link: "/marketing/payments",
        },
      ],
    },
    {
      title: "ATTENDANCE",
      icon: <AiTwotoneCalendar />,
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
        {
          name: "My Attendance",
          icon: <FiUsers />,
          link: "/attendance_self",
        },
      ],
    },
    {
      title: "SUPPORT",
      icon: <BiSupport />,

      links: [
        {
          name: "QA ",
          icon: <AiOutlineQuestionCircle />,
          submenu: [
            {
              name: "QA Form",
              link: "/trainer",
            },
            {
              name: "All QA",
              link: "/qa",
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
      title: "Messaging",
      icon: <MdApps />,

      links: [
        {
          name: "Chat",
          icon: <BsCircleFill />,
          link: "/chat",
        },
      ],
    },
    {
      title: "MISC",
      links: [
        {
          name: "Settings",
          icon: <FiSettings />,
          submenu: [
            // {
            //   name: "Integration",
            //   link: "/integrations",
            // },
            {
              name: "Notifications Settings",
              link: "/notifications",
            },
            {
              name: "Notifications List",
              link: "/notificationsList",
            },
          ],
        },
      ],
    },
  ];

  if (isUserSubscribed !== null && isUserSubscribed === true) {
    if (User?.role === 1) {
      links.splice(5, 0, {
        title: "MARKETING",
        icon: <MdCampaign />,
        links: [
          {
            name: "Instances",
            icon: <BsFillLayersFill />,
            link: "/instances",
          },
          {
            name: "WhatsApp",
            icon: <RiWhatsappFill />,
            link: "/marketing/chat",
          },
          {
            name: "Contacts/SMS",
            icon: <MdContactPage />,
            link: "/marketing/contacts",
          },
          {
            name: "Templates",
            icon: <FaMobile />,
            link: "/marketing/templates",
          },
        ],
      });
    } else {
      links.splice(5, 0, {
        title: "MARKETING",
        icon: <MdCampaign />,
        links: [
          {
            name: "WhatsApp",
            icon: <RiWhatsappFill />,
            link: "/marketing/chat",
          },
          {
            name: "Contacts",
            icon: <MdContactPage />,
            link: "/marketing/contacts",
          },
          {
            name: "Templates",
            icon: <FaMobile />,
            link: "/marketing/templates",
          },
        ],
      });
    }
  }
  useEffect(() => {
    const url = location.pathname?.replaceAll("%20", " ");
    if (activeSidebarHeading !== 1) {
      links?.forEach((link, linkIndex) => {
        link?.links?.forEach((l, menuIndex) => {
          if (l?.submenu) {
            l?.submenu?.forEach((sub) => {
              if (sub?.link === url) {
                setActiveSidebarHeading(linkIndex);
                setOpenSubMenu({
                  menuIndex: menuIndex + 1,
                  linkIndex,
                  sub: false,
                });
                return;
              }
            });
          } else {
            if (url === l?.link) {
              setActiveSidebarHeading(linkIndex);
              return;
            }
          }
        });
      });
    }
  }, [location.pathname]);

  useEffect(() => {
    const url = location.pathname?.replaceAll("%20", " ");

    if (url !== "/dashboard") {
      links?.forEach((link, linkIndex) => {
        link?.links?.forEach((l, menuIndex) => {
          if (l?.submenu) {
            l?.submenu?.forEach((sub) => {
              if (sub?.link === url) {
                setActiveSidebarHeading(linkIndex);
                setOpenSubMenu({
                  menuIndex: menuIndex + 1,
                  linkIndex,
                  sub: false,
                });
                return;
              }
            });
          } else {
            if (url === l?.link) {
              setActiveSidebarHeading(linkIndex);
              return;
            }
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    socket.on("chat_message-received", (data) => {
      if (window.location.pathname !== "/chat") {
        ringtoneElem.current.play();
        setMessagesCount((prevCount) => prevCount + 1);
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
        }, 500);
        setNewMessageReceived(data?.to);
      } else {
        setMessagesCount(0);
        setNewMessageReceived(false);
      }
    });
  }, []);

  return (
    <>
      <audio ref={ringtoneElem} className="hidden">
        <source src={ringtone} type="audio/ogg" />
        <source src={ringtone} type="audio/mpeg" />
      </audio>
      <audio ref={notifRingtoneElem} className="hidden">
        <source src={notifRingtone} type="audio/ogg" />
        <source src={notifRingtone} type="audio/mpeg" />
      </audio>
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
          className={`h-screen sticky top-0 ${currentMode}-mode-sidebar`}
        >
          <div className="">
            <div
              className="sidebar-top"
              style={{
                position: "sticky",
                top: 0,
                background: currentMode === "dark" ? "black" : "white",
                zIndex: 1000,
              }}
            >
              <div className="flex justify-between items-center h-[50px]">
                <Link
                  to={
                    User?.role !== 5
                      ? "/dashboard"
                      : "/attendance/officeSettings"
                  }
                  className="items-center gap-3 ml-3 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900 "
                  onClick={() => {
                    setSelected({
                      name: User?.role !== 5 ? "Dashboard" : "Office Settings",
                      index: 0,
                    });
                  }}
                >
                  {isCollapsed ? (
                    <div className="flex items-center space-x-2">
                      <img
                        height={40}
                        width={40}
                        className="h-[40px] w-auto p-1"
                        src="/favicon.png"
                        alt=""
                      />

                      <div className="relative">
                        <h1
                          className={`overflow-hidden ${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          HIKAL CRM
                        </h1>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <img
                        height={40}
                        width={40}
                        className="h-[40px] w-auto p-1"
                        src="/favicon.png"
                        alt=""
                      />
                    </div>
                  )}
                </Link>
              </div>
              <div className="profile-section border-b mt-1 px-2 pb-5 mb-2">
                {isCollapsed ? (
                  <>
                    <Link
                      to={"/profile"}
                      onClick={() => setopenBackDrop(true)}
                      className="flex flex-col items-center justify-center"
                    >
                      <img
                        src={
                          User?.displayImg
                            ? User?.displayImg
                            : "/assets/user.png"
                        }
                        height={60}
                        width={60}
                        className="rounded-md object-cover"
                        alt=""
                      />
                      <h1
                        className={`my-2 font-bold text-lg text-center ${
                          currentMode === "dark"
                            ? "text-white"
                            : "text-main-dark-bg"
                        }`}
                      >
                        {User?.userName ? User?.userName : "No username"}
                      </h1>
                      <span
                        className={`block rounded-md px-2 py-1 text-sm bg-main-red-color text-white`}
                      >
                        {User?.position || ""}
                      </span>
                    </Link>
                  </>
                ) : (
                  <Link
                    to={"/profile"}
                    onClick={() => setopenBackDrop(true)}
                    className="flex justify-center"
                  >
                    <img
                      src={User?.displayImg}
                      height={50}
                      width={50}
                      className="rounded-md cursor-pointer"
                      alt=""
                    />
                  </Link>
                )}
              </div>
            </div>
            <div className="sidebar-root mt-4 mb-4 text-base">
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
                <Box
                  sx={{
                    // FOR DARK MODE MENU SETTINGS
                    "& .css-1mfnem1": {
                      borderRadius: "0px",
                    },
                    "& .css-1mfnem1:hover": {
                      backgroundColor: "#DA1F26",
                    },
                    // submenu containerr color
                    "& .css-z5rm24": {
                      backgroundColor: currentMode === "dark" && "#1C1C1C",
                      borderRadius: "0px",
                    },
                    // Submenu count color
                    "& .css-1rnkhs0": {
                      color: currentMode === "dark" && "white",
                    },
                    // LIGHT MODE SETTINGS
                    "& .css-1ohfb25:hover": {
                      backgroundColor: "#DA1F26",
                      color: "white",
                      borderRadius: "0px",
                    },
                    "& .css-wx7wi4": {
                      width: "18px",
                      minWidth: "18px",
                    },
                  }}
                  className="my-1"
                >
                  {links?.map((link, linkIndex) => {
                    let permittedLinksMoreThan0 = false;
                    for (let i = 0; i < link?.links.length; i++) {
                      const subMenu = link?.links[i]?.submenu;
                      if (subMenu) {
                        for (let k = 0; k < subMenu.length; k++) {
                          const anotherSubMenu = subMenu[k]?.submenu;
                          if (anotherSubMenu) {
                            for (let l = 0; l < anotherSubMenu?.length; l++) {
                              if (
                                hasPermission(anotherSubMenu[l]?.link, true)
                                  ?.isPermitted
                              ) {
                                permittedLinksMoreThan0 = true;
                                break;
                              }
                            }
                          } else {
                            if (
                              hasPermission(subMenu[k]?.link, true).isPermitted
                            ) {
                              permittedLinksMoreThan0 = true;
                              break;
                            }
                          }
                        }
                      } else {
                        if (
                          hasPermission(link?.links[i]?.link, true)?.isPermitted
                        ) {
                          permittedLinksMoreThan0 = true;
                          break;
                        }
                      }
                    }

                    if (
                      link?.links[0]?.link === "/dashboard" &&
                      User?.role !== 5
                    ) {
                      return (
                        <Link
                          key={linkIndex}
                          to={`${link?.links[0]?.link}`}
                          onClick={() => {
                            setopenBackDrop(true);
                            setOpenSubMenu(0);
                            setActiveSidebarHeading("");
                          }}
                        >
                          <Box
                            sx={{
                              // STYLING FOR LIGHT MODE
                              "& .css-1mfnem1": {
                                borderRadius: "0px",
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
                            }}
                            className="relative my-1"
                          >
                            <MenuItem
                              active={
                                link?.links[0]?.link ===
                                window.location.pathname.replaceAll("%20", " ")
                              }
                            >
                              <div
                                className={`flex items-center ${
                                  isCollapsed ? "gap-4" : ""
                                } rounded-lg text-base ${
                                  !isCollapsed ? "justify-center" : ""
                                }`}
                              >
                                <span
                                  className={`${!isCollapsed && "text-xl"}`}
                                >
                                  {link?.links[0]?.icon}
                                </span>
                                {isCollapsed && (
                                  <span className="capitalize">
                                    {link?.links[0]?.name}
                                  </span>
                                )}
                              </div>
                            </MenuItem>
                          </Box>
                        </Link>
                      );
                    }

                    if (permittedLinksMoreThan0) {
                      return (
                        <Box
                          key={linkIndex}
                          onClick={(e) => handleExpandHeading(e, linkIndex)}
                          sx={{
                            // icons css
                            "& .css-wx7wi4": {
                              opacity: "0.7",
                            },
                            "& .css-wx7wi4:hover": {
                              transform: "rotate(20deg)",
                              transition: "all 0.6s ease",
                              opacity: "1",
                            },
                          }}
                        >
                          {!isCollapsed ? (
                            <Tooltip title={link?.title} placement="right">
                              <Link
                                key={linkIndex}
                                onClick={() => {
                                  setopenBackDrop(true);
                                  setOpenSubMenu(0);
                                  setActiveSidebarHeading(linkIndex);
                                  collapseSidebar();
                                  setIsCollapsed(true);
                                }}
                              >
                                <Box
                                  sx={{
                                    // STYLING FOR LIGHT MODE
                                    "& .css-1mfnem1": {
                                      borderRadius: "0px",
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
                                  }}
                                  className="relative my-1"
                                >
                                  <MenuItem
                                    active={
                                      link?.links[0]?.link ===
                                      window.location.pathname.replaceAll(
                                        "%20",
                                        " "
                                      )
                                    }
                                  >
                                    <div className="flex my-1 h-[38px] items-center justify-center text-xl">
                                      {link?.icon}
                                    </div>
                                  </MenuItem>
                                </Box>
                              </Link>
                            </Tooltip>
                          ) : (
                            <SubMenu
                              icon={link?.icon}
                              open={activeSidebarHeading === linkIndex}
                              label={link?.title?.toUpperCase()}
                              className="top-level-dropdown"
                            >
                              {link.links.map((menu, index) => {
                                if (
                                  hasPermission(menu?.link, true)
                                    ?.isPermitted ||
                                  (menu?.submenu &&
                                    hasPermission(menu?.submenu[0]?.link, true)
                                      ?.isPermitted) ||
                                  (menu?.link === "/dashboard" &&
                                    User?.role !== 5)
                                ) {
                                  if (menu?.submenu) {
                                    return (
                                      <Box
                                        key={index}
                                        onClick={(e) => {
                                          handleExpand(
                                            e,
                                            {
                                              menuIndex: index + 1,
                                              linkIndex,
                                            },
                                            true
                                          );
                                        }}
                                        sx={{
                                          // icons css
                                          "&  .css-wx7wi4": {
                                            opacity: "0.7",
                                          },
                                          "&  .css-wx7wi4:hover": {
                                            transform: "rotate(20deg)",
                                            transition: "all 0.6s ease",
                                            opacity: "1",
                                          },
                                          // FOR DARK MODE MENU SETTINGS
                                          "& .css-1mfnem1": {
                                            borderRadius: "0px",
                                          },
                                          "& .css-1mfnem1:hover": {
                                            backgroundColor: "#DA1F26",
                                          },
                                          // submenu containerr color
                                          "& .css-z5rm24": {
                                            backgroundColor:
                                              currentMode === "dark" &&
                                              "#1C1C1C",
                                            borderRadius: "0px",
                                          },
                                          // Submenu count color
                                          "& .css-1rnkhs0": {
                                            color:
                                              currentMode === "dark" && "white",
                                          },
                                          // LIGHT MODE SETTINGS
                                          "& .css-1ohfb25:hover": {
                                            backgroundColor: "#DA1F26",
                                            color: "white",
                                            borderRadius: "0px",
                                          },
                                          "& .css-wx7wi4": {
                                            width: "18px",
                                            minWidth: "18px",
                                          },
                                        }}
                                        className="my-1 sub"
                                      >
                                        <SubMenu
                                          label={menu.name}
                                          icon={menu.icon}
                                          open={
                                            openedSubMenu.menuIndex ===
                                              index + 1 &&
                                            openedSubMenu.linkIndex ===
                                              linkIndex
                                          }
                                        >
                                          {menu?.submenu.map((m, index) => {
                                            return (
                                              <Link
                                                key={index}
                                                to={`${m.link}`}
                                              >
                                                <Box
                                                  sx={{
                                                    // STYLING FOR LIGHT MODE
                                                    "& .css-1mfnem1": {
                                                      borderRadius: "0px",
                                                    },
                                                    "& .css-1mfnem1:hover": {
                                                      backgroundColor:
                                                        "#DA1F26",
                                                    },
                                                    "& .css-1ogoo8i": {
                                                      backgroundColor:
                                                        "#DA1F26",
                                                    },
                                                    // STYLING FOR DARK MODE
                                                    "& .css-yktbuo": {
                                                      backgroundColor:
                                                        "#DA1F26",
                                                    },
                                                    "& .css-1f8bwsm": {
                                                      minWidth:
                                                        "10px !important",
                                                    },
                                                    "& .css-yktbuo:hover": {
                                                      backgroundColor:
                                                        "#DA1F26",
                                                    },
                                                    "& .css-1v6ithu": {
                                                      color: "white",
                                                    },
                                                    "& .leads_counter": {
                                                      color: m?.countColor
                                                        ? m?.countColor
                                                        : currentMode === "dark"
                                                        ? "white"
                                                        : "black",
                                                    },
                                                    "& .css-cveggr-MuiListItemIcon-root":
                                                      {
                                                        minWidth:
                                                          "10px !important",
                                                      },
                                                  }}
                                                  className="relative my-1"
                                                >
                                                  <MenuItem
                                                    active={
                                                      m.link ===
                                                      window.location.pathname.replaceAll(
                                                        "%20",
                                                        " "
                                                      )
                                                    }
                                                    className="flex"
                                                  >
                                                    {m?.icon && (
                                                      <ListItemIcon
                                                        style={{
                                                          minWidth:
                                                            "23px !important",
                                                        }}
                                                      >
                                                        {m?.icon}
                                                      </ListItemIcon>
                                                    )}{" "}
                                                    <span className=" ">
                                                      {" "}
                                                      {m?.name || ""}
                                                    </span>
                                                  </MenuItem>
                                                  {m?.count != null && (
                                                    <span
                                                      className="leads_counter block absolute right-5"
                                                      style={{
                                                        top: "50%",
                                                        transform:
                                                          "translateY(-50%)",
                                                      }}
                                                    >
                                                      {m?.count !== null &&
                                                      m?.count !== undefined
                                                        ? m?.count
                                                        : ""}
                                                    </span>
                                                  )}
                                                </Box>
                                              </Link>
                                            );
                                          })}
                                        </SubMenu>
                                      </Box>
                                    );
                                  } else {
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
                                              borderRadius: "0px",
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
                                            active={
                                              menu.link ===
                                              window.location.pathname.replaceAll(
                                                "%20",
                                                " "
                                              )
                                            }
                                          >
                                            <div className="flex items-center gap-4 text-base">
                                              <span
                                                className={`${
                                                  !isCollapsed && "text-xl"
                                                }`}
                                                style={{
                                                  // icons css
                                                  "& .css-wx7wi4": {
                                                    display: "none !important",
                                                    opacity: "0.7",
                                                  },
                                                  "& .css-wx7wi4:hover": {
                                                    transform: "rotate(20deg)",
                                                    transition: "all 0.6s ease",
                                                    opacity: "1",
                                                  },
                                                }}
                                              >
                                                {menu.icon}
                                              </span>
                                              {isCollapsed && (
                                                <span className="capitalize">
                                                  {menu.name}
                                                </span>
                                              )}
                                            </div>
                                          </MenuItem>
                                          {menu?.count !== null &&
                                            menu?.count !== undefined && (
                                              <span
                                                className="leads_counter block absolute right-5"
                                                style={{
                                                  top: "50%",
                                                  transform: "translateY(-50%)",
                                                }}
                                              >
                                                {menu?.count !== null &&
                                                menu?.count !== undefined
                                                  ? menu?.count
                                                  : ""}
                                              </span>
                                            )}
                                        </Box>
                                      </Link>
                                    );
                                  }
                                }
                              })}
                            </SubMenu>
                          )}
                        </Box>
                      );
                    }
                  })}
                </Box>
              </Menu>
            </div>
          </div>
        </Sidebar>
      </div>

      {newMessageReceived === User?.loginId &&
        location.pathname !== "/chat" && (
          <div className={`message-received-float ${blink ? "animate" : ""}`}>
            <Link
              className="p-[12px]"
              onClick={() => {
                setNewMessageReceived(false);
                setMessagesCount(0);
              }}
              to="/chat"
            >
              <FaInbox size={22} />
            </Link>

            <div className="border border-[#1C1C1C] bg-black p-1 w-[18px] h-[18px] rounded-full absolute top-0 left-0 flex justify-center items-center text-white">
              {messagesCount}
            </div>
          </div>
        )}
    </>
  );
};
export default Sidebarmui;
