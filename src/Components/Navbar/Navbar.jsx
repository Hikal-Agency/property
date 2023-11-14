import React, { useContext, useEffect, useState } from "react";
import { useProSidebar } from "react-pro-sidebar";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { MdStars } from "react-icons/md";

import {
  Tooltip,
  Button,
  Badge,
  MenuItem,
  Select,
  IconButton,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import { search } from "../../utils/axiosSearch";

import { useStateContext } from "../../context/ContextProvider";
import { ColorModeContext } from "../../context/theme";
import axios from "../../axoisConfig";
import BreadCrumb from "./BreadCrumb";
import UpcomingMeetingsMenu from "./UpcomingMeetingsMenu";
import Clock from "./Clock";
import NotificationsMenuUpdated from "./NotificationsMenuUpdated";

import { AiOutlineMenu } from "react-icons/ai";
import {
  BsCalendarEvent,
  BsCalendarEventFill,
  BsBell,
  BsClock,
  BsClockFill,
  BsApple,
  BsAndroid2,
  BsChatText,
} from "react-icons/bs";
import { GoCommentDiscussion } from "react-icons/go";
import {
  MdDarkMode,
  MdKeyboardArrowDown,
  MdOutlineLightMode,
} from "react-icons/md";
import {
  VscHistory,
  VscLock,
  VscShield,
  VscExclude,
  VscSignOut,
} from "react-icons/vsc";
import "../../styles/animation.css";
import ColorSchemeMenuItem from "./ColorSchemeMenuItem";

const NavButton = ({
  title,
  customFunc,
  icon,
  color,
  handleClose,
  dotColor,
}) => (
  // <Tooltip title={title} arrow placement="bottom">
  <button
    type="button"
    onMouseEnter={customFunc}
    style={{ color }}
    className="relative text-xl rounded-full p-3 hover:bg-light-gray"
  >
    <span
      style={{ background: dotColor }}
      className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
    />
    {icon}
  </button>
  // </Tooltip>
);

const changeBodyDirection = (newDirection) => {
  document.body.style.direction = newDirection;
};

const changeBodyFont = (newFont) => {
  document.body.style.fontFamily = newFont;
};

const Navbar = () => {
  const token = localStorage.getItem("auth-token");

  const {
    currentMode,
    setCurrentMode,
    User,
    BACKEND_URL,
    isCollapsed,
    allRoutes,
    primaryColor,
    setIsCollapsed,
    themeBgImg,
    t,
    langs,
    isLangRTL,
    getLangDetails,
    darkModeColors,
  } = useStateContext();
  const colorMode = useContext(ColorModeContext);
  const { collapseSidebar } = useProSidebar();
  const {
    activeMenu,
    setActiveMenu,
    setScreenSize,
    screenSize,
    setopenBackDrop,
    isUserSubscribed,
    unreadNotifsCount,
    notifIconAnimating,
    i18n,
  } = useStateContext();

  const [currNavBtn, setCurrNavBtn] = useState("");
  const [anchorElem, setAnchorElem] = useState("");

  const [langTitle, setLangTitle] = useState("");
  const [langFlag, setLangFlag] = useState("");

  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(null);
  const [searchResult, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  console.log("search result:: ", searchResult);

  const handleSearch = async (e) => {
    // e.preventDefault();
    setSearchLoading(true);
    const token = localStorage.getItem("auth-token");

    setSearchTerm(e.target.value);
    const searchWord = e.target.value;
    try {
      // const postSearch = await axios.get(`${BACKEND_URL}/searchleads`, {
      //   params: { search: searchWord },
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + token,
      //   },
      // });

      const postSearch = await search(
        `${BACKEND_URL}/searchleads?search=${searchWord}`,
        // {},
        token
      );

      if (postSearch?.data !== "No Data") {
        console.log("settted:::::: ");
        setSearchResults(postSearch);
      }

      setSearchLoading(false);
      console.log("search result: ", postSearch);
    } catch (error) {
      setSearchLoading(false);
      console.log("error: ", error);
      toast.error("Unable to search", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleNavigate = (e, search) => {
    // e.preventDefault();
    setSearchResults(null);
    setSearchTerm("");
    navigate(`/lead/${search?.leadId || search?.id}`);
    window.location.reload();
  };

  const handleClick = (event, navBtn) => {
    setCurrNavBtn(navBtn);
    setOpen(true);
    setAnchorElem(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorElem(null);
    setCurrNavBtn("");
  };

  const LogoutUser = async () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    localStorage.removeItem("leadsData");
    localStorage.removeItem("fb_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_in");

    try {
      const logout = await axios.post(`${BACKEND_URL}/logout`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("logout: ", logout);
      window.open("/", "_self");
    } catch (error) {
      console.log("error: ", error);
      toast.error("Unable to logout", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const UnsubscribeUser = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/cancel`,
        JSON.stringify({
          package_name: "unsubscribed",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success("User Unsubscribed Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        localStorage.removeItem("user");
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Sorry, something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
    // eslint-disable-next-line
  }, [screenSize]);

  // eslint-disable-next-line
  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const changeMode = () => {
    handleClose();
    colorMode.toggleColorMode();
    if (currentMode === "dark") {
      setCurrentMode("light");
      localStorage.setItem("currentMode", "light");
    } else {
      setCurrentMode("dark");
      localStorage.setItem("currentMode", "dark");
    }
  };

  const openChat = () => {
    navigate("/chat");
  };

  useEffect(() => {
    const langDetails = getLangDetails(i18n.language);
    if (langDetails) {
      const { title, flag } = langDetails;
      setLangTitle(title);
      setLangFlag(flag);
      // console.log(`Language Title: ${title}`);
      // console.log(`Language Flag URL: ${flag}`);
    }
  }, [getLangDetails]);

  const saveLangInProfile = async (code) => {
    const token = localStorage.getItem("auth-token");
    try {
      await axios.post(
        `${BACKEND_URL}/updateuser/${User.id}`,
        JSON.stringify({
          language: code,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      {/* CHAT  */}
      <div
        className="fixed"
        style={{
          bottom: "20px",
          right: !isLangRTL(i18n.language) && "20px",
          left: isLangRTL(i18n.language) && "20px",
          zIndex: 999,
        }}
      >
        <Tooltip title="Chat">
          <button
            onClick={openChat}
            className="cursor-pointer bg-primary hover:bg-[#AAAAAA] hover:border-[#AAAAAA] text-white border-2 p-3 rounded-full"
          >
            <GoCommentDiscussion size={24} color={"#FFFFFF"} />
          </button>
        </Tooltip>
      </div>

      <div
        className={` ${
          themeBgImg
            ? currentMode === "dark"
              ? "blur-bg-dark"
              : "blur-bg-light"
            : currentMode === "dark"
            ? "bg-black"
            : "bg-white"
        } flex justify-between items-center p-2 relative`}
        style={{
          position: "fixed",
          top: 0,
          left: isLangRTL(i18n.language) ? "0" : !isCollapsed ? 80 : 200,
          right: isLangRTL(i18n.language) ? (!isCollapsed ? 80 : 200) : 0,
          zIndex: "20",
          // backgroundColor: !themeBgImg && (currentMode === "dark" ? "black" : "white"),
          boxShadow:
            currentMode !== "dark"
              ? "0 2px 4px rgba(0, 0, 0, 0.1)"
              : "0 2px 4px rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* BREADCRUMB  */}
        <div className="flex items-center">
          <div
            onClick={() => {
              collapseSidebar();
              setIsCollapsed(!isCollapsed);
            }}
            className="flex items-center rounded-lg pl-1 cursor-pointer"
          >
            <button
              type="button"
              style={{
                color: currentMode === "dark" ? "white" : primaryColor,
              }}
              // style={{ color: currentColor }}
              className={`relative text-xl rounded-full hover:bg-light-gray mr-4`}
            >
              <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
              <AiOutlineMenu />
            </button>
          </div>
          <BreadCrumb allroutes={allRoutes} currentMode={currentMode} />
        </div>

        <div className="flex items-center">
          {/* UPGRADE  */}
          {isUserSubscribed !== null && [
            isUserSubscribed === false ? (
              <Button
                variant="contained"
                className="bg-btn-primary"
                sx={{
                  mx: 2,
                  "& svg": {
                    color: "white",
                  },
                }}
              >
                <Link to="/marketing/payments" className="flex items-center">
                  <MdStars className="mx-2" size={18} />
                  <span className="mt-[2px]">{t("upgrade")}</span>
                </Link>
              </Button>
            ) : (
              <></>
            ),
          ]}

          {/* search */}
          <div className="">
            <Box sx={darkModeColors}>
              <TextField
                type="text"
                placeholder="Search Leads"
                value={searchTerm}
                onChange={handleSearch}
                size="small"
              />
            </Box>
            {searchResult != null && searchResult?.data?.length > 0 && (
              <div
                className={`absolute mt-1 p-3 w-[170px] ${
                  currentMode === "dark" ? "bg-[#292828]" : "bg-[#e9e7e8]"
                }`}
                style={{
                  overflow:
                    searchResult != null
                      ? searchResult?.data?.length > 10
                        ? "auto"
                        : "visible"
                      : "",
                  maxHeight:
                    searchResult != null
                      ? searchResult?.data?.length > 10
                        ? "200px"
                        : "auto"
                      : "",
                }}
              >
                {searchLoading === false ? (
                  searchResult?.data &&
                  searchResult?.data?.map((search) => (
                    <p
                      key={search?.id}
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-dark"
                      } cursor-pointer`}
                      onClick={(e) => handleNavigate(e, search)}
                    >
                      {search?.leadName}
                    </p>
                  ))
                ) : (
                  <div className="flex justify-center">
                    <CircularProgress />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MEETINGS  */}
          <NavButton
            title="Meetings"
            handleClose={handleClose}
            dotColor={currentMode === "dark" ? "#ffffff" : primaryColor}
            customFunc={(event) => handleClick(event, "Meetings")}
            color={currentMode === "dark" ? "#ffffff" : "#333333"}
            icon={
              currNavBtn === "Meetings" ? (
                <BsCalendarEventFill size={16} />
              ) : (
                <BsCalendarEvent size={16} />
              )
            }
          />
          {/* NOTIFICATIONS  */}
          <NavButton
            handleClose={handleClose}
            title="Notification"
            // dotColor={currentMode === "dark" ? "#ffffff" : "#DA1F26"}
            customFunc={(event) => handleClick(event, "Notifications")}
            color={currentMode === "dark" ? "#ffffff" : "#333333"}
            icon={
              <Badge
                className={notifIconAnimating ? "animate-notif-icon" : ""}
                badgeContent={unreadNotifsCount}
                sx={{
                  "& .MuiBadge-badge": {
                    background: primaryColor,
                    color: "white",
                  },
                }}
              >
                <BsBell size={16} />
              </Badge>
            }
          />
          {/* CLOCK  */}
          <NavButton
            handleClose={handleClose}
            title="Clock"
            // color={currentMode === "dark" ? "#ffffff" : LightIconsColor}
            customFunc={(event) => handleClick(event, "Clock")}
            color={currentMode === "dark" ? "#ffffff" : "#333333"}
            icon={
              currNavBtn === "Clock" ? (
                <BsClockFill size={16} />
              ) : (
                <BsClock size={16} />
              )
            }
          />
          {/* THEME  */}
          {/* {!themeBgImg && */}
          <Tooltip
            title={currentMode === "dark" ? "Light mode" : "Dark mode"}
            arrow
            placement="bottom"
          >
            <button
              type="button"
              onClick={changeMode}
              className={`relative text-xl rounded-full p-3 hover:bg-light-gray ${
                currentMode === "dark" ? "text-white" : " text-primary"
              }`}
            >
              {currentMode === "dark" ? (
                <MdOutlineLightMode size={16} color="#dcb511" />
              ) : (
                <MdDarkMode size={16} color={primaryColor} />
              )}
            </button>
          </Tooltip>
          {/* } */}
          {/* PROFILE  */}
          <Tooltip title="Profile" arrow placement="bottom">
            <div
              className={`bg-primary text-white mx-1 p-2 flex items-center gap-2 cursor-pointer hover:bg-light-gray rounded-xl shadow-sm card-hover`}
              onClick={(event) => {
                if (currNavBtn === "Profile") {
                  handleClose();
                } else {
                  handleClick(event, "Profile");
                }
              }}
            >
              <img
                height={50}
                width={50}
                className="rounded-full w-10 h-10 object-cover"
                src={User?.displayImg ? User?.displayImg : "/assets/user.png"}
                alt="user-profile"
              />
              <p className="display-block sm:display-none">
                <span className={`font-bold`}>{User?.userName}</span>
              </p>
              <MdKeyboardArrowDown size={14} className={``} />
            </div>
          </Tooltip>
          {/* LANG  */}
          <Tooltip title="Language" arrow placement="bottom">
            <div
              className="mx-2 flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
              onClick={(event) => {
                if (currNavBtn === "Language") {
                  handleClose();
                } else {
                  handleClick(event, "Language");
                }
              }}
            >
              <img
                className="rounded-sm h-6 w-8 border"
                src={langFlag}
                alt=""
              />
              {/* <MdKeyboardArrowDown
                className={`${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              /> */}
            </div>
          </Tooltip>
          <Menu
            className="hide-scrollbar navbar-menu-backdrop"
            hideBackdrop={false}
            onClick={handleClose}
            onMouseLeave={handleClose}
            anchorEl={anchorElem}
            open={open}
            PaperProps={{
              elevation: 0,
              sx: {
                "& .MuiList-root .clock-div": {
                  border: "none !important",
                  background: "transparent !important",
                },
                mt: 2,
                pl: !isLangRTL(i18n.language) && 0.6,
                pr: isLangRTL(i18n.language) && 0.6,
                py: 0.4,
                overflowY: "scroll",
                filter:
                  currentMode === "dark"
                    ? "drop-shadow(1px 1px 6px rgb(238 238 238 / 0.3))"
                    : "drop-shadow(1px 1px 6px rgb(28 28 28 / 0.3))",
                // background: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
                background:
                  currentMode === "dark"
                    ? "rgb(28 28 28 / 0.9)"
                    : "rgb(238 238 238 / 0.9)",
                color: currentMode === "dark" ? "#ffffff" : "black",
                minWidth: currNavBtn === "Language" ? 100 : 300,
                maxWidth: currNavBtn === "Language" ? 180 : 350,
                borderRadius: "10px",
                // "& .MuiAvatar-root": {
                //   width: 32,
                //   height: 32,
                //   // ml: -0.5,
                //   mx: 1,
                // },
                "& .css-qwh1ly-MuiContainer-root, .css-khd9l5-MuiContainer-root":
                  {
                    padding: "0 !important",
                  },
              },
            }}
            transformOrigin={{ horizontal: "center", vertical: "top" }}
            anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          >
            {currNavBtn ? (
              currNavBtn === "Notifications" ? (
                // <NotificationsMenu />
                <NotificationsMenuUpdated
                  handleClose={handleClose}
                  setCurrNavBtn={setCurrNavBtn}
                />
              ) : currNavBtn === "Clock" ? (
                <Clock handleClose={handleClose} />
              ) : currNavBtn === "Meetings" ? (
                <UpcomingMeetingsMenu />
              ) : currNavBtn === "Profile" ? (
                <div className="px-2">
                  <div
                    className={`cursor-pointer card-hover ${
                      currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]"
                    } mb-3 p-4 rounded-xl shadow-sm w-full`}
                  >
                    <Link to={"/profile"} onClick={() => setopenBackDrop(true)}>
                      <div className="flex items-center justify-start">
                        <Avatar
                          src={User?.displayImg}
                          className="inline-block"
                        />
                        <div className="flex justify-between items-center w-full h-full">
                          <div className="mx-1 space-y-1">
                            <p className="font-semibold">{User?.userName}</p>
                            <p className="text-xs capitalize">
                              {User?.position}
                            </p>
                          </div>
                          <div
                            style={{
                              borderColor: primaryColor,
                            }}
                            className={`text-sm rounded-full border px-2 py-1`}
                          >
                            {t("profile")}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <ColorSchemeMenuItem />

                  {/* DOWNLOAD MOBILE APP  */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* iOS  */}
                    <div
                      className={`cursor-pointer card-hover ${
                        currentMode === "dark" ? "bg-primary" : "bg-primary"
                      } mb-3 p-3 rounded-xl shadow-sm w-full`}
                    >
                      {/* <Link to={"/profile"} onClick={() => setopenBackDrop(true)}> */}
                      <div className="flex items-center justify-start">
                        <div className={`p-1 rounded-full mr-2`}>
                          <BsApple size={18} color={"#FFFFFF"} />
                        </div>
                        <div className="flex justify-between items-center w-full h-full text-white">
                          <div className="flex items-center">
                            <p className="font-semibold mx-1 mr-2">
                              Hikal CRM
                              <br />
                              iOS
                            </p>
                          </div>
                          <VscLock
                            size={14}
                            color={"#FFFFFF"}
                            className="mr-2"
                          />
                        </div>
                      </div>
                      {/* </Link> */}
                    </div>

                    {/* ANDROID  */}
                    <div
                      className={`cursor-pointer card-hover ${
                        currentMode === "dark" ? "bg-primary" : "bg-primary"
                      } mb-3 p-3 rounded-xl shadow-sm w-full`}
                    >
                      {/* <Link to={"/profile"} onClick={() => setopenBackDrop(true)}> */}
                      <div className="flex items-center justify-start">
                        <div className={`p-1 rounded-full mr-2`}>
                          <BsAndroid2 size={18} color={"#FFFFFF"} />
                        </div>
                        <div className="flex justify-between items-center w-full h-full text-white">
                          <div className="flex items-center">
                            <p className="font-semibold mx-1 mr-2">
                              Hikal CRM
                              <br />
                              Android
                            </p>
                          </div>
                          <VscLock
                            size={14}
                            color={"#FFFFFF"}
                            className="mr-2"
                          />
                        </div>
                      </div>
                      {/* </Link> */}
                    </div>
                  </div>

                  {/* LOGIN HISTORY  */}
                  <div
                    className={`cursor-pointer card-hover ${
                      currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]"
                    } mb-3 p-3 rounded-xl shadow-sm w-full`}
                  >
                    {/* <Link to={"/profile"} onClick={() => setopenBackDrop(true)}> */}
                    <div className="flex items-center justify-start">
                      <div
                        className={`${
                          currentMode === "dark"
                            ? "bg-[#1C1C1C]"
                            : "bg-[#EEEEEE]"
                        } p-2 rounded-full mr-2`}
                      >
                        <VscHistory size={18} color={"#AAAAAA"} />
                      </div>
                      <div className="flex justify-between items-center w-full h-full">
                        <div className="flex items-center">
                          <p className="font-semibold mx-1 mr-2">
                            {t("login_history")}
                          </p>
                          <VscLock
                            size={14}
                            color={primaryColor}
                            className="mr-2"
                          />
                        </div>
                        <div
                          style={{
                            background: primaryColor,
                            fontSize: "0.5rem",
                          }}
                          className="rounded-full text-white px-2 py-1 font-bold"
                        >
                          {t("soon")?.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    {/* </Link> */}
                  </div>

                  {/* CHANGE PASSWORD  */}
                  <div
                    className={`cursor-pointer card-hover ${
                      currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]"
                    } mb-3 p-3 rounded-xl shadow-sm w-full`}
                  >
                    <Link
                      to={"/changepassword"}
                      onClick={() => setopenBackDrop(true)}
                    >
                      <div className="flex items-center justify-start">
                        <div
                          className={`${
                            currentMode === "dark"
                              ? "bg-[#1C1C1C]"
                              : "bg-[#EEEEEE]"
                          } p-2 rounded-full mr-2`}
                        >
                          <VscShield size={18} color={"#AAAAAA"} />
                        </div>
                        <p className="mx-1 mr-2 font-semibold">
                          {t("change_password")}
                        </p>
                      </div>
                    </Link>
                  </div>

                  {/* IF SUBSCRIBED, UNSUBCRIBE  */}
                  {User?.role !== 1 && isUserSubscribed && (
                    <div
                      className={`cursor-pointer card-hover ${
                        currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]"
                      } mb-3 p-3 rounded-xl shadow-sm w-full`}
                      onClick={UnsubscribeUser}
                    >
                      {/* <Link to={"/changepassword"} onClick={() => setopenBackDrop(true)}> */}
                      <div className="flex items-center justify-start">
                        <div
                          className={`${
                            currentMode === "dark"
                              ? "bg-[#1C1C1C]"
                              : "bg-[#EEEEEE]"
                          } p-2 rounded-full mr-2`}
                        >
                          <VscExclude size={18} color={"#AAAAAA"} />
                        </div>
                        <p className="mx-1 mr-2 font-semibold">
                          {t("unsubscribe_package")}
                        </p>
                        <VscLock
                          size={14}
                          color={primaryColor}
                          className="mr-2"
                        />
                      </div>
                      {/* </Link> */}
                    </div>
                  )}

                  {/* LOGOUT  */}
                  <div
                    className={`cursor-pointer card-hover ${
                      currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]"
                    } p-3 rounded-xl shadow-sm w-full`}
                    onClick={LogoutUser}
                  >
                    <div className="flex items-center justify-start">
                      <div
                        className={`${
                          currentMode === "dark"
                            ? "bg-[#1C1C1C]"
                            : "bg-[#EEEEEE]"
                        } p-2 rounded-full mr-2`}
                      >
                        <VscSignOut size={18} color={"#AAAAAA"} />
                      </div>
                      <p className="mx-1 mr-2 font-semibold">{t("log_out")}</p>
                    </div>
                  </div>
                </div>
              ) : currNavBtn === "Language" ? (
                <div className="px-2">
                  {langs?.map((lang) => (
                    <button
                      className={`cursor-pointer card-hover ${
                        currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]"
                      } mb-3 p-3 rounded-xl shadow-sm w-full`}
                      onClick={(e) => {
                        i18n.changeLanguage(lang.code);
                        saveLangInProfile(lang.code);
                        if (isLangRTL(lang.code)) {
                          changeBodyDirection("rtl");
                        } else {
                          changeBodyDirection("ltr");
                        }
                      }}
                    >
                      <div className="grid grid-cols-2 gap-5">
                        <div className="text-start">
                          <img
                            className="rounded-sm h-6 w-8 border"
                            src={lang.flag}
                            alt=""
                          />
                        </div>
                        <div
                          className="text-end"
                          style={{
                            fontFamily: lang?.font,
                            // fontSize: lang?.size
                          }}
                        >
                          {lang.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </Menu>
        </div>
      </div>
    </>
  );
};

export default Navbar;
