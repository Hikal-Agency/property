import React, { useContext, useEffect, useState } from "react";
import { useProSidebar } from "react-pro-sidebar";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { MdStars } from "react-icons/md";

import { Tooltip, Button, Badge, MenuItem, Select } from "@mui/material";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";

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
  BsAndroid2
} from "react-icons/bs";
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
}

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
    themeBgImg, t, langs, isLangRTL
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
    i18n
  } = useStateContext();
  const [currNavBtn, setCurrNavBtn] = useState("");
  const [anchorElem, setAnchorElem] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(true);

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

  return (
    <>
      <div
        className={` ${themeBgImg 
          ? (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
          : (currentMode === "dark" ? "bg-black" : "bg-white") 
        } flex justify-between items-center p-2 relative`}
        style={{
          position: "fixed",
          top: 0,
          left: isLangRTL(i18n.language) ? "0" : (!isCollapsed ? 65 : 200),
          right: isLangRTL(i18n.language) ? (!isCollapsed ? 65 : 200) : 0,
          zIndex: "20",
          // backgroundColor: !themeBgImg && (currentMode === "dark" ? "black" : "white"),
          boxShadow:
            currentMode !== "dark"
              ? "0 2px 4px rgba(0, 0, 0, 0.1)"
              : "0 2px 4px rgba(255, 255, 255, 0.1)",
        }}
      >
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
        <div>{/* <Clock/> */}</div>

        <div className="flex items-center">
          {isUserSubscribed !== null && [
            isUserSubscribed === false ? (
              <Button
                variant="contained"
                className="bg-btn-primary"
                sx={{
                  mr: 2,
                  "& svg": {
                    color: "white",
                  },
                }}
              >
                <Link to="/marketing/payments" className="flex items-center">
                  <MdStars className="mr-2" size={18} />
                  <span className="mt-[2px]">{t("upgrade")}</span>
                </Link>
              </Button>
            ) : (
              <></>
            ),
          ]}

          <Select
            sx={{
              marginRight: "8px", 
              "& fieldset": {
                border: 0
              }
            }}
            size="small"
            value={i18n.language}
            onChange={(e) => {
              i18n.changeLanguage(e.target.value);
              if(isLangRTL(e.target.value)){
                  changeBodyDirection("rtl");
              } else {
                  changeBodyDirection("ltr");
              }
            }}
          >
            {langs?.map((lang) => 
              <MenuItem value={lang?.code} key={lang?.code}>{lang?.title}</MenuItem>
            )}
          </Select>

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
              className="ml-2 flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
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
                className="rounded-full w-8 h-8 object-cover"
                src={User?.displayImg ? User?.displayImg : "/assets/user.png"}
                alt="user-profile"
              />
              <p className="display-block sm:display-none">
                <span
                  className={`${
                    currentMode === "dark" ? "text-white" : "text-main-dark-bg"
                  } font-bold ml-1 text-14`}
                >
                  {User?.userName}
                </span>
              </p>
              <MdKeyboardArrowDown className="text-gray-400 text-14" />
            </div>
          </Tooltip>

          <Menu
            className="navbar-menu-backdrop"
            hideBackdrop={true}
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
                minWidth: 300,
                borderRadius: "10px",
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "& .css-qwh1ly-MuiContainer-root, .css-khd9l5-MuiContainer-root":
                  {
                    padding: "5px !important",
                    paddingRight: "0px !important",
                  },
                // "&:before": {
                //   content: '""',
                //   display: "block",
                //   position: "absolute",
                //   top: 0,
                //   right: 66,
                //   width: 10,
                //   height: 10,
                //   background: currentMode === "dark" ? "#4f5159" : "#eef1ff",
                //   transform: "translateY(-50%) rotate(45deg)",
                //   zIndex: 0,
                // },
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
                <div className="pl-2">
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
                              Hikal CRM<br />iOS
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
                              Hikal CRM<br />Android
                            </p>
                          </div>
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
                        <VscLock size={14} color={"#DA1F26"} className="mr-2" />
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
