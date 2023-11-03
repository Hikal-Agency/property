import { Avatar, Box, IconButton, ListItemIcon, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { AiFillGift } from "react-icons/ai";
import { FaLink, FaSnowflake, FaMobile, FaInbox, FaSms } from "react-icons/fa";
import { socket } from "../../Pages/App";
import {
  BsStopCircle,
  BsCalendarWeek,
  BsCashStack,
  BsFileEarmarkBarGraph,
  BsColumnsGap,
  BsPeople,
  BsPersonPlus,
  BsWebcam,
  BsFire,
  BsLink45Deg,
  BsShuffle,
  BsSnow,
  BsArchive,
  BsPersonRolodex,
  BsChatRightText,
  BsSearch,
  BsPatchCheck,
  BsBookmarkStar,
  BsBuildings,
  BsLock,
  BsTags,
  BsGrid3X3Gap,
  BsGift,
  BsDashCircle,
  BsBarChart,
  BsMegaphone,
  BsShare,
  BsFacebook,
  BsGeoAlt,
  BsPerson,
  BsCalendarCheck,
  BsClockHistory,
  BsCashCoin,
  BsHeadset,
  BsQuestionOctagon,
  BsTicketPerforated,
  BsGear,
  BsBell,
  BsWhatsapp,
  BsChatText,
  BsFileEarmarkText,
} from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { BsBuildingGear } from "react-icons/bs";

import { MdOutlinePayment } from "react-icons/md";
import { AiTwotoneCalendar } from "react-icons/ai";
import { MdOutlineCampaign, MdSettings } from "react-icons/md";

import { HiTicket, HiDocumentReport, HiUsers, HiSearch } from "react-icons/hi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsEnvelopeAt, BsLayers } from "react-icons/bs";
import { FaFacebookSquare, FaUsers, FaHandshake } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { RiRadioButtonLine } from "react-icons/ri";
import { BiBlock } from "react-icons/bi";
import { BiCalendar, BiSupport } from "react-icons/bi";
import { MdApps } from "react-icons/md";
import { FiSettings, FiUsers } from "react-icons/fi";
import { FaRandom, FaUserTag, FaUserFriends, FaTags } from "react-icons/fa";
import { BsPersonGear } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { GiQueenCrown } from "react-icons/gi";
import ringtone from "../../assets/new-message-ringtone.mp3";
import notifRingtone from "../../assets/notification-ringtone.mp3";
import useWindowSize from "react-use/lib/useWindowSize";

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
import { RiLiveFill } from "react-icons/ri";
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
import ReminderToast from "./ReminderToast";
import DealClosedAlert from "./DealClosedAlert";
import ReactConfetti from "react-confetti";

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
    themeBgImg,
    setUserCredits,
    primaryColor,
    setPrimaryColor,
    t,
    i18n,
    isLangRTL,
    blurDarkColor,
    blurLightColor,
    setThemeBgImg,
    timeZone,
    setTimezone,
  } = useStateContext();
  console.log("timezone in sidebar: ", timeZone);

  const [activeSidebarHeading, setActiveSidebarHeading] = useState(1);
  const [newMessageReceived, setNewMessageReceived] = useState(false);
  const [messagesCount, setMessagesCount] = useState(0);
  const [blink, setBlink] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const ringtoneElem = useRef();
  const notifRingtoneElem = useRef();
  const { hasPermission } = usePermission();
  const [dealClosedAnimation, setDealClosedAnimation] = useState({
    isOpen: false,
    data: {},
  });
  const [confetti, setConfetti] = useState(false);
  const { collapseSidebar } = useProSidebar();
  const [fadeOutConfetti, setFadeOutConfetti] = useState(false);
  const [closeDealPopupFade, setCloseDealPopupFade] = useState(false);

  const { screenWidth, screenHeight } = useWindowSize();

  const [openedSubMenu, setOpenSubMenu] = useState({
    menuIndex: 0,
    linkIndex: 0,
    sub: false,
  });

  const [animateProfilePic, setAnimateProfilePic] = useState(false);

  const startDealCloseAnimation = (data) => {
    setConfetti(true);
    setTimeout(() => {
      setFadeOutConfetti(true);
      setTimeout(() => {
        setConfetti(false);
        setFadeOutConfetti(false);
      }, 500);
    }, 8000);

    setTimeout(() => {
      setDealClosedAnimation({
        ...dealClosedAnimation,
        isOpen: true,
        data,
      });

      setTimeout(() => {
        setCloseDealPopupFade(true);
        setTimeout(() => {
          setDealClosedAnimation({
            ...dealClosedAnimation,
            isOpen: false,
            data,
          });
          setCloseDealPopupFade(false);
        }, 500);
      }, 15000);
    }, 3000);
  };

  const handleClickProfile = (e) => {
    if (!e.target.closest(".view-image")) {
      navigate("/profile");
    }
  };

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

  const FetchProfileData = async () => {
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

          console.log("permisson: ", result.data.roles.permissions);

          const allPermissions = result.data.roles.permissions;

          const permissionsArray = allPermissions.split(", ");
          console.log("permisssions array:: ", permissionsArray);
          const wordToExtract = String("dashboard");
          const wordIndex = permissionsArray.indexOf(wordToExtract);

          // TODO BECAUSE ALL NEW TABS WERE OPENING TO ATTENDANCE FOR OTHER USERS
          if (wordIndex !== -1) {
            const specificWord = permissionsArray[wordIndex];
            console.log("specificWord: ", specificWord); // Output: "cherry"
          } else {
            console.log("Word not found in the string.");

            if (result?.data?.user[0]?.role === 6) {
              navigate("/attendance_self");
            }
            // if (result?.data?.user[0]?.role !== 1) {
            //   // navigate("/attendance_self");
            // }
          }

          const changeBodyDirection = (newDirection) => {
            document.body.style.direction = newDirection;
          };

          const language = result.data?.user[0]?.language;
          const timezone = result.data?.user[0]?.timezone;
          setTimezone(timezone);

          if (language) {
            i18n.changeLanguage(language);
            if (isLangRTL(language)) {
              changeBodyDirection("rtl");
            } else {
              changeBodyDirection("ltr");
            }
          }

          setUserCredits(result.data?.user[0]?.credits);
          setPermits(allPermissions);

          const bgColor = result.data?.user[0]?.theme;
          if (!bgColor || bgColor === "default") {
            setPrimaryColor("rgb(218,31,38)");
          } else {
            setPrimaryColor(bgColor);
          }

          const bgTheme = result.data?.user[0]?.backgroundImg;
          if (bgTheme && bgTheme !== "default") {
            setThemeBgImg(bgTheme);
          }
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
      FetchProfileData();
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
            credits: result.data.user[0].credits,
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
            timezone: result.data.user[0].timezone,
          };

          setTimezone(user?.timezone);
          setUser(user);
          setIsUserSubscribed(checkUser(user));
          getAllLeadsMembers(user);

          FetchProfileData();

          socket.emit("add_user", {
            ...user,
          });

          localStorage.setItem("user", JSON.stringify(user));
        })
        .catch((err) => {
          console.log("response:", err);
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
    console.log("User role 6===> ", User);

    if (User?.role === 6) {
      return;
    }
    fetchSidebarData();
  }, [User]);

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

      socket.on("notification_lead_assigned", (data) => {
        console.log("data::", data);
        toast(
          <ReminderToast type="lead_assigned" leadName={data?.leadName} />,
          {
            position: "bottom-right",
            autoClose: 30000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            closeButton: false,
            draggable: false,
            theme: "light",
          }
        );
      });

      socket.on("notification_reminder", (data) => {
        console.log("Reminder: ", data);

        toast(
          <ReminderToast
            type="reminder"
            reminderTime="2023-08-19 01:25:00 PM"
            leadName="Qasim"
          />,
          {
            position: "bottom-right",
            autoClose: 15000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            closeButton: false,
            draggable: false,
            theme: "light",
          }
        );
      });

      socket.on("deal_closed", (data) => {
        startDealCloseAnimation(data);
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
      title: t("menu_dashboard"),
      links: [
        {
          name: t("menu_dashboard"),
          icon: <BsColumnsGap size={16} />,
          pro: false,
          link: "/dashboard",
        },
      ],
    },
    // LEADS
    {
      title: t("leads"),
      icon: <BsPeople size={18} />,
      pro: false,
      links: [
        {
          name: t("menu_add_lead"),
          icon: <BsPersonPlus size={18} />,
          pro: false,
          link: "/addlead",
        },
        // UNASSIGNED
        {
          name: t("menu_unassigned"),
          icon: <BsStopCircle size={16} />,
          pro: false,
          submenu: [
            {
              name: t("menu_fresh"),
              pro: false,
              link: "/unassigned/fresh",
              count: sidebarData?.UNASSIGNED?.fresh,
            },
            {
              name: t("menu_thirdparty"),
              pro: false,
              count: sidebarData?.UNASSIGNED?.third_party,
              link: "/unassigned/thirdpartyleads",
            },
            {
              name: t("menu_cold"),
              pro: false,
              count: sidebarData?.UNASSIGNED?.cold,
              link: "/unassigned/coldleads",
            },
            {
              name: t("menu_archived"),
              pro: false,
              count: sidebarData?.UNASSIGNED?.warm,
              link: "/unassigned/archive",
            },
            {
              name: t("menu_personal"),
              pro: false,
              count: sidebarData?.UNASSIGNED?.personal,
              link: "/unassigned/personalleads",
            },
            {
              name: t("menu_live_call"),
              pro: false,
              link: "/unassigned/liveleads",
            },
          ],
        },
        // FRESH
        {
          name: t("menu_fresh"),
          icon: <BsFire size={16} />,
          pro: false,
          submenu: [
            {
              name: t("feedback_all"),
              pro: false,
              count: sidebarData?.HotLeadsCount?.hot,
              link: "/freshleads/all",
            },
            {
              name: t("feedback_new"),
              pro: false,
              count: sidebarData?.HotLeadsCount?.new,
              link: "/freshleads/new",
            },
            {
              name: t("feedback_follow_up"),
              pro: false,
              count: sidebarData?.HotLeadsCount?.follow_up,
              link: "/freshleads/follow up",
            },
            {
              name: t("feedback_meeting"),
              pro: false,
              count: sidebarData?.HotLeadsCount?.Meeting,
              link: "/freshleads/meeting",
            },
            {
              name: t("feedback_low_budget"),
              pro: false,
              count: sidebarData?.HotLeadsCount?.low_budget,
              link: "/freshleads/low budget",
            },
            {
              name: t("feedback_no_answer"),
              pro: false,
              count: sidebarData?.HotLeadsCount?.no_nswer,
              link: "/freshleads/no answer",
            },
            {
              name: t("feedback_not_interested"),
              pro: false,
              count: sidebarData?.HotLeadsCount?.not_interested,
              link: "/freshleads/not interested",
            },
            {
              name: t("feedback_unreachable"),
              pro: false,
              count: sidebarData?.HotLeadsCount?.unreachable,
              link: "/freshleads/unreachable",
            },
          ],
        },
        // THIRD PARTY
        {
          name: t("menu_thirdparty"),
          icon: <BsLink45Deg size={20} />,
          pro: false,
          submenu: [
            {
              name: t("feedback_all"),
              pro: false,
              count: sidebarData?.ThirdPartyLeadsCount?.all,
              link: "/thirdpartyleads/all",
            },
            {
              name: t("feedback_new"),
              pro: false,
              count: sidebarData?.ThirdPartyLeadsCount?.new,
              link: "/thirdpartyleads/new",
            },
            {
              name: t("feedback_follow_up"),
              pro: false,
              count: sidebarData?.ThirdPartyLeadsCount?.follow_up,
              link: "/thirdpartyleads/follow up",
            },
            {
              name: t("feedback_meeting"),
              pro: false,
              count: sidebarData?.ThirdPartyLeadsCount?.Meeting,
              link: "/thirdpartyleads/meeting",
            },
            {
              name: t("feedback_low_budget"),
              pro: false,
              count: sidebarData?.ThirdPartyLeadsCount?.low_budget,
              link: "/thirdpartyleads/low budget",
            },
            {
              name: t("feedback_no_answer"),
              pro: false,
              count: sidebarData?.ThirdPartyLeadsCount?.no_nswer,
              link: "/thirdpartyleads/no answer",
            },
            {
              name: t("feedback_not_interested"),
              pro: false,
              count: sidebarData?.ThirdPartyLeadsCount?.not_interested,
              link: "/thirdpartyleads/not interested",
            },
            {
              name: t("feedback_unreachable"),
              pro: false,
              count: sidebarData?.ThirdPartyLeadsCount?.unreachable,
              link: "/thirdpartyleads/unreachable",
            },
          ],
        },
        // COLD
        {
          name: t("menu_cold"),
          icon: <BsSnow size={16} />,
          pro: false,
          submenu: [
            {
              name: t("feedback_all"),
              pro: false,
              count: sidebarData?.ColdLeadsCount?.all,
              link: "/coldleads/all",
            },
            {
              name: t("menu_verified"),
              pro: false,
              count: sidebarData?.ColdLeadsCount?.verified, //TODO
              link: "/coldleads/coldLeadsVerified",
              icon: (
                <RiRadioButtonLine size={16} style={{ color: "#40B74F" }} />
              ),
              countColor: "#008000",
            },
            {
              name: t("menu_invalid"),
              pro: false,
              count: sidebarData?.ColdLeadsCount?.unverified, //TODO
              link: "/coldleads/coldLeadsInvalid",
              icon: (
                <RiRadioButtonLine size={16} style={{ color: primaryColor }} />
              ),
              countColor: "#FF0000",
            },
            {
              name: t("menu_not_checked"),
              pro: false,
              count: sidebarData?.ColdLeadsCount?.unchecked, //TODO
              link: "/coldleads/coldLeadsNotChecked",
              icon: (
                <RiRadioButtonLine size={16} style={{ color: "#FFCF49" }} />
              ),
              countColor: "#FFA500",
            },
            {
              name: t("feedback_new"),
              pro: false,
              count: sidebarData?.ColdLeadsCount?.new,
              link: "/coldleads/new",
            },
            {
              name: t("feedback_follow_up"),
              pro: false,
              count: sidebarData?.ColdLeadsCount?.follow_up,
              link: "/coldleads/follow up",
            },
            {
              name: t("feedback_meeting"),
              pro: false,
              count: sidebarData?.ColdLeadsCount?.Meeting,
              link: "/coldleads/meeting",
            },
            {
              name: t("feedback_low_budget"),
              pro: false,
              count: sidebarData?.ColdLeadsCount?.low_budget,
              link: "/coldleads/low budget",
            },
            {
              name: t("feedback_no_answer"),
              pro: false,
              count: sidebarData?.ColdLeadsCount?.no_nswer,
              link: "/coldleads/no answer",
            },
            {
              name: t("feedback_not_interested"),
              pro: false,
              count: sidebarData?.ColdLeadsCount?.not_interested,
              link: "/coldleads/not interested",
            },
            {
              name: t("feedback_unreachable"),
              pro: false,
              count: sidebarData?.ColdLeadsCount?.unreachable,
              link: "/coldleads/unreachable",
            },
          ],
        },
        // RESHUFFLED
        {
          name: t("menu_reshuffled"),
          icon: <BsShuffle size={16} />,
          pro: false,
          // link: "/reshuffleleads",
          submenu: [
            {
              name: t("feedback_all"),
              pro: false,
              count: sidebarData?.Reshuffle?.fresh,
              link: "/reshuffleleads/all",
            },
            {
              name: t("feedback_new"),
              pro: false,
              count: sidebarData?.Reshuffle?.new,
              link: "/reshuffleleads/new",
            },
            {
              name: t("feedback_follow_up"),
              pro: false,
              count: sidebarData?.Reshuffle?.follow_up,
              link: "/reshuffleleads/follow up",
            },
            {
              name: t("feedback_meeting"),
              pro: false,
              count: sidebarData?.Reshuffle?.meeting,
              link: "/reshuffleleads/meeting",
            },
            {
              name: t("feedback_low_budget"),
              pro: false,
              count: sidebarData?.Reshuffle?.low_budget,
              link: "/reshuffleleads/low budget",
            },
            {
              name: t("feedback_no_answer"),
              pro: false,
              count: sidebarData?.Reshuffle?.no_answer,
              link: "/reshuffleleads/no answer",
            },
            {
              name: t("feedback_not_interested"),
              pro: false,
              count: sidebarData?.Reshuffle?.not_interested,
              link: "/reshuffleleads/not interested",
            },
            {
              name: t("feedback_unreachable"),
              pro: false,
              count: sidebarData?.Reshuffle?.unreachable,
              link: "/reshuffleleads/unreachable",
            },
          ],
        },
        // ARCHIVED
        {
          name: t("menu_archived"),
          icon: <BsArchive size={16} />,
          pro: false,
          submenu: [
            {
              name: t("menu_all_leads"),
              pro: false,
              count: sidebarData?.WarmLeadCount?.all,
              link: "/archive/all",
            },
            {
              name: t("menu_new_leads"),
              pro: false,
              count: sidebarData?.WarmLeadCount?.new,
              link: "/archive/new",
            },
            {
              name: t("feedback_follow_up"),
              pro: false,
              count: sidebarData?.WarmLeadCount?.follow_up,
              link: "/archive/follow up",
            },
            {
              name: t("feedback_meeting"),
              pro: false,
              count: sidebarData?.WarmLeadCount?.Meeting,
              link: "/archive/meeting",
            },
            {
              name: t("feedback_low_budget"),
              pro: false,
              count: sidebarData?.WarmLeadCount?.low_budget,
              link: "/archive/low budget",
            },
            {
              name: t("feedback_no_answer"),
              pro: false,
              count: sidebarData?.WarmLeadCount?.no_nswer,
              link: "/archive/no answer",
            },
            {
              name: t("feedback_not_interested"),
              pro: false,
              count: sidebarData?.WarmLeadCount?.not_interested,
              link: "/archive/not interested",
            },
            {
              name: t("feedback_unreachable"),
              pro: false,
              count: sidebarData?.WarmLeadCount?.unreachable,
              link: "/archive/unreachable",
            },
          ],
        },
        // PERSONAL
        {
          name: t("menu_personal"),
          icon: <BsPersonRolodex size={16} />,
          pro: false,
          submenu: [
            {
              name: t("feedback_all"),
              pro: false,
              count: sidebarData?.PersonalLeadsCount?.all,
              link: "/personalleads/all",
            },
            {
              name: t("feedback_new"),
              pro: false,
              count: sidebarData?.PersonalLeadsCount?.new,
              link: "/personalleads/new",
            },
            {
              name: t("feedback_follow_up"),
              pro: false,
              count: sidebarData?.PersonalLeadsCount?.follow_up,
              link: "/personalleads/follow up",
            },
            {
              name: t("feedback_meeting"),
              pro: false,
              count: sidebarData?.PersonalLeadsCount?.Meeting,
              link: "/personalleads/meeting",
            },
            {
              name: t("feedback_low_budget"),
              pro: false,
              count: sidebarData?.PersonalLeadsCount?.low_budget,
              link: "/personalleads/low budget",
            },
            {
              name: t("feedback_no_answer"),
              pro: false,
              count: sidebarData?.PersonalLeadsCount?.no_nswer,
              link: "/personalleads/no answer",
            },
            {
              name: t("feedback_not_interested"),
              pro: false,
              count: sidebarData?.PersonalLeadsCount?.not_interested,
              link: "/personalleads/not interested",
            },
            {
              name: t("feedback_unreachable"),
              pro: false,
              count: sidebarData?.PersonalLeadsCount?.unreachable,
              link: "/personalleads/unreachable",
            },
          ],
        },
        // LIVE
        {
          name: t("menu_live_call"),
          icon: <BsWebcam size={18} />,
          pro: false,
          submenu: [
            {
              name: t("feedback_all"),
              pro: false,
              // count: sidebarData?.HotLeadsCount?.hot,
              link: "/liveleads/all",
            },
            {
              name: t("feedback_new"),
              pro: false,
              // count: sidebarData?.HotLeadsCount?.new,
              link: "/liveleads/new",
            },
            {
              name: t("feedback_follow_up"),
              pro: false,
              // count: sidebarData?.HotLeadsCount?.follow_up,
              link: "/liveleads/follow up",
            },
            {
              name: t("feedback_meeting"),
              pro: false,
              // count: sidebarData?.HotLeadsCount?.Meeting,
              link: "/liveleads/meeting",
            },
            {
              name: t("feedback_low_budget"),
              pro: false,
              // count: sidebarData?.HotLeadsCount?.low_budget,
              link: "/liveleads/low budget",
            },
            {
              name: t("feedback_no_answer"),
              pro: false,
              // count: sidebarData?.HotLeadsCount?.no_nswer,
              link: "/freshleads/no answer",
            },
            {
              name: t("feedback_not_interested"),
              pro: false,
              // count: sidebarData?.HotLeadsCount?.not_interested,
              link: "/freshleads/not interested",
            },
            {
              name: t("feedback_unreachable"),
              pro: false,
              // count: sidebarData?.HotLeadsCount?.unreachable,
              link: "/freshleads/unreachable",
            },
          ],
        },
        // NOTES
        {
          name: t("menu_notes"),
          icon: <BsChatRightText size={16} />,
          pro: false,
          link: "/leadnotes",
        },
        // SEARCH
        {
          name: t("menu_search"),
          icon: <BsSearch size={16} />,
          pro: false,
          link: "/search",
        },
      ],
    },
    // DEALS
    {
      title: t("menu_deals"),
      icon: <BsPatchCheck size={18} />,
      pro: false,
      links: [
        {
          name: t("menu_booked_deals"),
          icon: <BsBookmarkStar size={16} />,
          pro: false,
          link: "/booked",
        },
        {
          name: t("menu_closed_deals"),
          icon: <BsLock size={16} />,
          pro: false,
          link: "/closedeals",
        },
      ],
    },
    // SECONDARY LISTINGS AND BUYERS
    {
      title: t("menu_secondary"),
      icon: <BsBuildings size={18} />,
      pro: false,
      links: [
        {
          name: t("menu_listings"),
          icon: <BsTags size={16} />,
          pro: false,
          link: "/secondaryListings",
        },
        {
          name: t("menu_buyers"),
          icon: <BsPeople size={16} />,
          pro: false,
          link: "/buyers/buyers",
        },
      ],
    },
    // APPS
    {
      title: t("menu_apps"),
      icon: <BsGrid3X3Gap size={18} />,
      pro: false,
      links: [
        // MEETINGS
        {
          name: t("menu_meetings"),
          icon: <BsCalendarWeek size={16} />,
          link: "/meetings",
        },
        // {
        //   name: t("menu_appointments"),
        //   icon: <BsCalendarWeek size={16} />,
        //   link: "/appointments",
        // },
        // {
        //   name: "Add Users",
        //   icon: <FaUser />,
        //   link: "/adminAuth/signup",
        // },

        // IP
        {
          name: t("menu_blocked_ips"),
          icon: <BsDashCircle size={16} />,
          pro: true,
          link: "/blocked",
        },
        // REPORTS
        {
          name: t("menu_reports"),
          icon: <BsFileEarmarkBarGraph size={16} />,
          pro: false,
          link: "/reports",
        },
        // OFFERS
        {
          name: t("menu_offers"),
          icon: <BsGift size={16} />,
          pro: false,
          link: "/offers",
        },
        // PROPERTY PORTFOLIO
        // {
        //   name: t("menu_property_portfolio"),
        //   icon: <BsBuildings size={16} />,
        //   link: "/propertyPortfolio",
        // },
        // {
        //   name: t("menu_clients"),
        //   icon: <ImUsers size={16} />,
        //   link: "/clients",
        // },
        // {
        //   name: "Contacts",
        //   icon: <MdContactPage size={16} />,
        //   link: "/contacts",
        // },

        // NEWSLETTER
        // {
        //   name: t("menu_newsletter"),
        //   icon: <BsEnvelopeAt size={16} />,
        //   link: "/newsletter",
        // },
        // LEADERBOARD
        {
          name: t("menu_leaderboard"),
          icon: <BsBarChart size={16} />,
          pro: true,
          link: "/leaderboard",
        },
        // USERS
        {
          name: t("menu_users"),
          icon: <BsPeople size={16} />,
          pro: false,
          link: "/users",
        },
        // ROLES
        {
          name: t("menu_roles"),
          icon: <BsPersonGear size={16} />,
          pro: false,
          link: "/roles",
        },
      ],
    },
    // SOCIAL MEDIA
    {
      title: t("menu_social_media"),
      icon: <BsShare size={18} />,
      pro: true,
      links: [
        {
          name: t("menu_facebook"),
          // icon: <FaChartLine />,
          icon: <BsFacebook size={16} />,
          pro: true,
          link: "/facebook",
        },
        // {
        //   name: "campaigns",
        //   icon: <FaFacebookSquare size={16} />,
        //   link: "/campaigns",
        // },
        // { name: "Leads Bitcoin", icon: <GrBitcoin /> },
      ],
    },
    // LOCATION
    {
      title: t("menu_location"),
      icon: <BsGeoAlt size={18} />,
      pro: true,
      links: [
        {
          name: t("menu_location_meetings"),
          icon: <BsCalendarWeek size={16} />,
          pro: true,
          link: "/location/meetinglocation",
        },
        {
          name: t("menu_location_live"),
          icon: <BsPerson size={16} />,
          pro: true,
          link: "/location/userlocation",
        },
      ],
    },
    // ATTENDANCE
    {
      title: t("menu_attendance"),
      icon: <BsCalendarCheck size={18} />,
      pro: true,
      links: [
        {
          name: t("menu_office_settings"),
          icon: <BsClockHistory size={16} />,
          pro: true,
          link: "/attendance/officeSettings",
        },
        {
          name: t("menu_employee_list"),
          icon: <BsPeople size={16} />,
          pro: true,
          link: "/attendance/employeesList",
        },
        {
          name: t("menu_my_attendance"),
          icon: <BsPerson size={16} />,
          pro: true,
          link: "/attendance_self",
        },
      ],
    },
    // MESSAGING
    // {
    //   title: t("menu_messaging"),
    //   icon: <MdApps size={16} />,

    //   links: [
    //     {
    //       name: t("menu_chat"),
    //       icon: <BsCircleFill size={16} />,
    //       link: "/chat",
    //     },
    //   ],
    // },
    // BILLINGS
    {
      title: t("menu_billings"),
      icon: <BsCashCoin size={18} />,
      pro: false,
      links: [
        {
          name: t("menu_payments"),
          icon: <BsCashStack size={16} />,
          pro: false,
          link: "/marketing/payments",
        },
      ],
    },
    // SUPPORT
    {
      title: t("menu_support"),
      icon: <BsHeadset size={20} />,
      pro: false,
      links: [
        {
          name: t("menu_qa"),
          icon: <BsQuestionOctagon size={16} />,
          pro: false,
          submenu: [
            {
              name: t("menu_qa_form"),
              link: "/trainer",
            },
            {
              name: t("menu_qa_all"),
              link: "/qa",
            },
          ],
        },
        {
          name: t("menu_tickets"),
          icon: <BsTicketPerforated size={16} />,
          pro: false,
          link: "/support",
        },
      ],
    },
    // MISC
    {
      title: t("menu_misc"),
      icon: <BsGear size={18} />,
      pro: false,
      links: [
        {
          name: t("notifications"),
          icon: <BsBell size={16} />,
          pro: false,
          submenu: [
            // {
            //   name: "Integration",
            //   link: "/integrations",
            // },
            {
              name: t("menu_notification_settings"),
              pro: false,
              link: "/notifications",
            },
            {
              name: t("menu_notification_history"),
              pro: false,
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
        title: t("menu_marketing"),
        icon: <BsMegaphone size={16} />,
        pro: true,
        links: [
          {
            name: t("menu_instances"),
            icon: <BsLayers size={16} />,
            pro: true,
            link: "/instances",
          },
          {
            name: t("menu_whatsapp"),
            icon: <BsWhatsapp size={16} />,
            pro: true,
            link: "/marketing/chat",
          },
          {
            name: t("menu_sms"),
            icon: <BsChatText size={16} />,
            pro: true,
            link: "/marketing/contacts",
          },
          {
            name: t("menu_templates"),
            icon: <BsFileEarmarkText size={16} />,
            pro: true,
            link: "/marketing/templates",
          },
          {
            name: t("menu_campaigns"),
            icon: <BsMegaphone size={16} />,
            pro: true,
            link: "/marketing/messages",
          },
        ],
      });
    } else {
      links.splice(5, 0, {
        title: t("menu_marketing"),
        icon: <BsMegaphone size={16} />,
        pro: true,
        links: [
          {
            name: t("menu_whatsapp"),
            icon: <BsWhatsapp size={16} />,
            pro: true,
            link: "/marketing/chat",
          },
          {
            name: t("menu_sms"),
            icon: <BsChatText size={16} />,
            pro: true,
            link: "/marketing/contacts",
          },
          {
            name: t("menu_templates"),
            icon: <BsFileEarmarkText size={16} />,
            pro: true,
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

      {confetti && (
        <ReactConfetti
          className={fadeOutConfetti ? "fade-out-confetti" : ""}
          tweenDuration={8000}
          width={screenWidth}
          height={screenHeight}
        />
      )}

      <Box
        sx={{
          "& .ps-sidebar-container": {
            // backgroundColor: !themeBgImg
            //   ? "rgb(249, 249, 249, 0.7)"
            //   : "rgb(249, 249, 249, 0.5)",
            backgroundColor: !themeBgImg
              ? currentMode === "dark"
                ? "rgb(249, 249, 249, 0.7)"
                : "rgb(249, 249, 249, 0.7)"
              : currentMode === "dark"
              ? blurDarkColor
              : blurLightColor,
          },
        }}
        style={{ display: "flex", height: "100%" }}
        className={`max-w-[200px] sticky top-0 left-0`}
      >
        <Sidebar
          rootStyles={{
            [`.${sidebarClasses.container}`]: {
              backgroundColor:
                !themeBgImg && (currentMode === "dark" ? "#000000" : "#ffffff"),
            },
          }}
          className={`h-screen sticky top-0 ${currentMode}-mode-sidebar`}
        >
          <div className="">
            <div
              className="sidebar-top"
              style={{
                position: !themeBgImg && "sticky",
                top: !themeBgImg && 0,
                background:
                  !themeBgImg && (currentMode === "dark" ? "black" : "white"),
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
                    <div
                      // to={"/profile"}
                      onClick={handleClickProfile}
                      className="flex cursor-pointer flex-col items-center justify-center"
                    >
                      <Box
                        className="relative"
                        sx={{
                          "&:hover .absolute": {
                            display: "flex",
                            background:
                              currentMode === "dark" ? "white" : "black",
                          },
                        }}
                      >
                        <img
                          src={
                            User?.displayImg
                              ? User?.displayImg
                              : "/assets/user.png"
                          }
                          height={60}
                          width={60}
                          className={`rounded-md object-cover relative`}
                          alt=""
                        />
                        {/* 
                        <div
                          onClick={() =>
                            setAnimateProfilePic(!animateProfilePic)
                          }
                          className={`absolute rounded-md z-[11111] view-image hidden top-0 left-0 w-full font-bold h-full flex-col justify-center items-center`}
                        >
                          <p
                            className={`${
                              currentMode === "dark"
                                ? "text-black"
                                : "text-white"
                            }`}
                          >
                            View
                          </p>
                        </div> */}
                      </Box>

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
                        style={{
                          background: primaryColor,
                        }}
                        className={`block rounded-md px-2 py-1 text-sm text-white`}
                      >
                        {User?.position || ""}
                      </span>
                    </div>
                  </>
                ) : (
                  <div
                    // to={"/profile"}
                    onClick={handleClickProfile}
                    className="flex justify-center"
                  >
                    <Avatar
                      src={User?.displayImg}
                      height={50}
                      width={50}
                      className="rounded-md cursor-pointer"
                      alt=""
                    />
                  </div>
                )}
              </div>
              <div
                className={`${
                  animateProfilePic ? "animate-profile-pic" : ""
                } fixed hidden top-0 left-0 w-screen h-screen`}
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.85)",
                }}
              >
                <IconButton
                  sx={{
                    position: "absolute",
                    right: "8%",
                    top: "8%",
                    color: "white",
                  }}
                  onClick={() => setAnimateProfilePic(false)}
                >
                  <IoMdClose size={22} />
                </IconButton>
                <img
                  src={User?.displayImg ? User?.displayImg : "/assets/user.png"}
                  height={60}
                  width={60}
                  className={`rounded-md pointer-events-none object-cover relative z-[10000] `}
                  alt=""
                />
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
                      backgroundColor: primaryColor,
                      color: "white",
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
                      backgroundColor: primaryColor,
                      color: "white",
                      borderRadius: "0px",
                    },
                    "& .css-wx7wi4": {
                      width: "18px",
                      minWidth: "18px",
                    },
                    "& .ps-submenu-content .ps-menuitem-root .ps-menuitem-root .ps-menu-label":
                      {
                        paddingRight: isLangRTL(i18n?.language) ? "30px" : "0",
                        // color: !themeBgImg ? primaryColor : (currentMode === "dark" ? "#FFFFFF" : "#000000"),
                        // color: !themeBgImg
                        //   ? primaryColor
                        //   : currentMode === "dark"
                        //   ? "#FFFFFF"
                        //   : "#000000",
                      },
                    "& .ps-menu-button": {
                      fontWeight: "medium",
                      color: !themeBgImg
                        ? primaryColor
                        : currentMode === "dark"
                        ? "#FFFFFF"
                        : "#000000",
                    },
                    "& .ps-menu-button:hover": {
                      fontWeight: "medium",
                      color: !themeBgImg
                        ? primaryColor
                        : currentMode === "dark"
                        ? "#000000"
                        : "#FFFFFF",
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
                      User?.role !== 5 &&
                      hasPermission(link?.links[0]?.link, true)?.isPermitted
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
                                backgroundColor: primaryColor,
                                color: "white",
                              },
                              "& .css-1ogoo8i": {
                                backgroundColor: primaryColor,
                                color: "white",
                              },
                              // STYLING FOR DARK MODE
                              "& .css-yktbuo": {
                                backgroundColor: primaryColor,
                                color: "white",
                              },
                              "& .css-yktbuo:hover": {
                                backgroundColor: primaryColor,
                                color: "white",
                              },
                              "& .css-1v6ithu": {
                                // color: "white",
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
                                } `}
                              >
                                <span
                                  className={`${!isCollapsed && "text-xl"}`}
                                >
                                  {link?.links[0]?.icon}
                                </span>
                                {isCollapsed && (
                                  <span
                                    className={`capitalize flex items-center gap-2`}
                                  >
                                    {link?.links[0]?.name}
                                    {link?.links[0].pro && (
                                      <div
                                        className={`${
                                          themeBgImg
                                            ? currentMode === "dark"
                                              ? "bg-black"
                                              : "bg-white"
                                            : "bg-transparent"
                                        } p-1 rounded-full`}
                                      >
                                        <GiQueenCrown
                                          size={16}
                                          className="gold-grad"
                                        />
                                      </div>
                                    )}
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
                                      backgroundColor: primaryColor,
                                      color: "white",
                                    },
                                    "& .css-1ogoo8i": {
                                      backgroundColor: primaryColor,
                                      color: "white",
                                    },
                                    // STYLING FOR DARK MODE
                                    "& .css-yktbuo": {
                                      backgroundColor: primaryColor,
                                      color: "white",
                                    },
                                    "& .css-yktbuo:hover": {
                                      backgroundColor: primaryColor,
                                      color: "white",
                                    },
                                    "& .css-1v6ithu": {
                                      // color: "white",
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
                              // label={link?.title?.toUpperCase()}
                              label={
                                <span
                                  className={`
                                  uppercase capitalize flex items-center gap-2`}
                                >
                                  {link.title}
                                  {link.pro && (
                                    <div
                                      className={`${
                                        themeBgImg
                                          ? currentMode === "dark"
                                            ? "bg-black"
                                            : "bg-white"
                                          : "bg-transparent"
                                      } p-1 rounded-full`}
                                    >
                                      <GiQueenCrown
                                        size={16}
                                        className="gold-grad"
                                      />
                                    </div>
                                  )}
                                </span>
                              }
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
                                            backgroundColor: primaryColor,
                                            color: "white",
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
                                            backgroundColor: primaryColor,
                                            color: "white",
                                            borderRadius: "0px",
                                          },
                                          "& .css-wx7wi4": {
                                            width: "18px",
                                            minWidth: "18px",
                                          },
                                          "& .ps-menu-label": {
                                            color:
                                              currentMode === "dark"
                                                ? "white"
                                                : "black",
                                          },
                                          "& .ps-menu-icon": {
                                            color:
                                              currentMode === "dark"
                                                ? "white"
                                                : "black",
                                          },
                                        }}
                                        className="my-1 sub"
                                      >
                                        <SubMenu
                                          // label={menu.name}
                                          label={
                                            <span
                                              className={`capitalize flex items-center gap-2`}
                                            >
                                              {menu.name}
                                              {menu.pro && (
                                                <div
                                                  className={`${
                                                    themeBgImg
                                                      ? currentMode === "dark"
                                                        ? "bg-black"
                                                        : "bg-white"
                                                      : "bg-transparent"
                                                  } p-1 rounded-full`}
                                                >
                                                  <GiQueenCrown
                                                    size={16}
                                                    className="gold-grad"
                                                  />
                                                </div>
                                              )}
                                            </span>
                                          }
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
                                                        primaryColor,
                                                      color: "white",
                                                    },
                                                    "& .css-1ogoo8i": {
                                                      backgroundColor:
                                                        primaryColor,
                                                      color: "white",
                                                    },
                                                    // STYLING FOR DARK MODE
                                                    "& .css-yktbuo": {
                                                      backgroundColor:
                                                        primaryColor,
                                                      color: "white",
                                                    },
                                                    "& .css-1f8bwsm": {
                                                      minWidth:
                                                        "10px !important",
                                                    },
                                                    "& .css-yktbuo:hover": {
                                                      backgroundColor:
                                                        primaryColor,
                                                      color: "white",
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
                                                  className=" relative my-1"
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
                                                          color:
                                                            currentMode ===
                                                            "dark"
                                                              ? "white !important"
                                                              : "black !important",
                                                        }}
                                                      >
                                                        {m?.icon}
                                                      </ListItemIcon>
                                                    )}{" "}
                                                    <span
                                                      className={`flex items-center gap-2`}
                                                    >
                                                      {m?.name || ""}
                                                      {m.pro && (
                                                        <div
                                                          className={`${
                                                            themeBgImg
                                                              ? currentMode ===
                                                                "dark"
                                                                ? "bg-black"
                                                                : "bg-white"
                                                              : "bg-transparent"
                                                          } p-1 rounded-full`}
                                                        >
                                                          <GiQueenCrown
                                                            size={16}
                                                            className="gold-grad"
                                                          />
                                                        </div>
                                                      )}
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
                                              backgroundColor: primaryColor,
                                              color: "white",
                                            },
                                            "& .css-1ogoo8i": {
                                              backgroundColor: primaryColor,
                                              color: "white",
                                            },
                                            // STYLING FOR DARK MODE
                                            "& .css-yktbuo": {
                                              backgroundColor: primaryColor,
                                              color: "white",
                                            },
                                            "& .css-yktbuo:hover": {
                                              backgroundColor: primaryColor,
                                              color: "white",
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
                                                <span
                                                  className={` capitalize flex items-center gap-2`}
                                                >
                                                  {menu.name}
                                                  {menu.pro && (
                                                    <div
                                                      className={`${
                                                        themeBgImg
                                                          ? currentMode ===
                                                            "dark"
                                                            ? "bg-black"
                                                            : "bg-white"
                                                          : "bg-transparent"
                                                      } p-1 rounded-full`}
                                                    >
                                                      <GiQueenCrown
                                                        size={16}
                                                        className="gold-grad"
                                                      />
                                                    </div>
                                                  )}
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

          {/* {animateProfile ? (
            <div
              className={`profile-pic-popout ${
                animateProfile ? "animate-profile-pic" : ""
              }`}
            >
              <img
                src={User?.displayImg ? User?.displayImg : "/assets/user.png"}
                height={60}
                width={60}
                className={`rounded-md object-cover`}
                alt=""
              />
            </div>
          ) : (
            <></>
          )} */}
        </Sidebar>
      </Box>

      {dealClosedAnimation?.isOpen && (
        <DealClosedAlert
          className={closeDealPopupFade ? "fade-out-popup" : ""}
          data={dealClosedAnimation?.data}
        />
      )}

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
