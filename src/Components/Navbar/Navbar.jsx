import React, { useContext, useEffect, useState } from "react";
import { useProSidebar } from "react-pro-sidebar";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";

import { Tooltip, Link as MuiLink, Button, Badge, Box } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {RiCoinsLine} from "react-icons/ri";
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
  BsBellFill,
  BsClock,
  BsClockFill,
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

const NavButton = ({
  title,
  customFunc,
  icon,
  color,
  handleClose,
  dotColor,
}) => (
  <Tooltip title={title} arrow placement="bottom">
    <button
      type="button"
      onMouseEnter={customFunc}
      // onMouseLeave={() => {
      //   setTimeout(() => {
      //     handleClose();
      //   }, 300);
      // }}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </Tooltip>
);

const Navbar = () => {
  const {
    currentMode,
    setCurrentMode,
    LightIconsColor,
    User,
    BACKEND_URL,
    isCollapsed,
    allRoutes,
    setIsCollapsed
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

  const LogoutUser = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    localStorage.removeItem("leadsData");
    localStorage.removeItem("fb_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_in");
    window.open("/", "_self");
  };

  const UnsubscribeUser = async () => {
    try {
      const token = localStorage.getItem("auth-token");
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
        className="flex justify-between items-center p-2 relative "
        style={{
          position: "fixed",
          top: 0,
          left: !isCollapsed ? 65 : 200,
          right: 0,
          zIndex: "20",
          backgroundColor: currentMode === "dark" ? "black" : "white",
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
              // style={{ color: currentColor }}
              className={`relative text-xl rounded-full hover:bg-light-gray mr-4  ${
                currentMode === "dark" ? "text-white" : "text-[#DA1F26]"
              }`}
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
                style={{ background: "#DA1F26" }}
                sx={{ mr: 2 }}
              >
                <Link to="/marketing/payments">Upgrade</Link>
              </Button>
            ) : (
              <></>
            ),
          ]}

          {/* MEETINGS  */}
          <NavButton
            title="Meetings"
            handleClose={handleClose}
            dotColor={currentMode === "dark" ? "#ffffff" : "#DA1F26"}
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
              currNavBtn === "Notifications" ? (
                <BsBellFill size={16} />
              ) : (
                [
                  <Badge
                    className={notifIconAnimating ? "animate-notif-icon" : ""}
                    badgeContent={unreadNotifsCount}
                    color="error"
                  >
                    <BsBell size={16} />
                  </Badge>,
                ]
              )
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
          <Tooltip
            title={currentMode === "dark" ? "light mode" : "dark mode"}
            arrow
            placement="bottom"
          >
            <button
              type="button"
              onClick={changeMode}
              className={`relative text-xl rounded-full p-3 hover:bg-light-gray ${
                currentMode === "dark" ? "text-white" : " text-main-red-color"
              }`}
            >
              {currentMode === "dark" ? (
                <MdOutlineLightMode size={16} color="#dcb511" />
              ) : (
                <MdDarkMode size={16} color="#DA1F26" />
              )}
            </button>
          </Tooltip>

          {/* PROFILE  */}
          <Tooltip title="Profile" arrow placement="bottom">
            <div
              className="ml-2 flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
              onClick={(event) => handleClick(event, "Profile")}
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

          {currNavBtn &&
            open && [
              currNavBtn === "Clock" ? (
                <div
                  className=""
                  style={{ margin: 0, padding: 0, overflow: "hidden" }}
                >
                  <Menu
                    className="navbar-menu-backdrop"
                    hideBackdrop={true}
                    disableScrollLock
                    open={open}
                    anchorEl={anchorElem}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        //  height: "auto",
                        overflow: "visible",
                        //  overflowY: "scroll",
                        mt: 0.5,
                        filter:
                          currentMode === "dark"
                            ? "drop-shadow(1px 1px 6px rgb(238 238 238 / 0.3))"
                            : "drop-shadow(1px 1px 6px rgb(28 28 28 / 0.3))",
                        // background: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
                        background:
                          currentMode === "dark"
                            ? "rgb(28 28 28 / 0.9)"
                            : "rgb(238 238 238 / 0.9)",
                        color: currentMode === "dark" ? "#FFFFFF" : "#000000",
                        minWidth: 300,
                        padding: 0,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "& .MuiList-root": {
                          padding: "3px",
                        },
                        "& .MuiList-root .clock-div": {
                          background: "transparent !important",
                          border: "none !important",
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "center", vertical: "top" }}
                    anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                  >
                    <Clock handleClose={handleClose} />
                  </Menu>
                </div>
              ) : (
                <Menu
                  className="navbar-menu-backdrop"
                  hideBackdrop={true}
                  disableScrollLock
                  onClick={handleClose}
                  onMouseLeave={handleClose}
                  anchorEl={anchorElem}
                  open={open}
                  PaperProps={{
                    elevation: 0,
                    sx: {
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
                    },
                  }}
                  transformOrigin={{ horizontal: "center", vertical: "top" }}
                  anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                >
                  {currNavBtn === "Notifications" ? (
                    <NotificationsMenuUpdated
                      handleClose={handleClose}
                      setCurrNavBtn={setCurrNavBtn}
                    />
                  ) : currNavBtn === "Meetings" ? (
                    <>
                      <UpcomingMeetingsMenu handleClose={handleClose} />
                    </>
                  ) : currNavBtn === "Profile" ? (
                    <div className="pl-2">
                      <div
                        className={`cursor-pointer card-hover ${
                          currentMode === "dark"
                            ? "bg-[#000000]"
                            : "bg-[#FFFFFF]"
                        } mb-3 p-4 rounded-xl shadow-sm w-full`}
                      >
                        <Link
                          to={"/profile"}
                          onClick={() => setopenBackDrop(true)}
                        >
                          <div className="flex items-center justify-start">
                            <Avatar
                              src={User?.displayImg}
                              className="inline-block"
                            />
                            <div className="flex justify-between items-center w-full h-full">
                              <div className="mx-1 space-y-1">
                                <p className="font-semibold">
                                  {User?.userName}
                                </p>
                                <p className="text-xs capitalize">
                                  {User?.position}
                                </p>
                              </div>
                              <div className="text-sm rounded-full border border-[#DA1F26] px-2 py-1">
                                Profile
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>

                      {/* LOGIN HISTORY  */}
                      <div
                        className={`cursor-pointer card-hover ${
                          currentMode === "dark"
                            ? "bg-[#000000]"
                            : "bg-[#FFFFFF]"
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
                                Login history
                              </p>
                              <VscLock
                                size={14}
                                color={"#DA1F26"}
                                className="mr-2"
                              />
                            </div>
                            <div
                              className="rounded-full bg-[#DA1F26] text-white px-2 py-1 font-bold"
                              style={{ fontSize: "0.5rem" }}
                            >
                              SOON
                            </div>
                          </div>
                        </div>
                        {/* </Link> */}
                      </div>

                      {/* CHANGE PASSWORD  */}
                      <div
                        className={`cursor-pointer card-hover ${
                          currentMode === "dark"
                            ? "bg-[#000000]"
                            : "bg-[#FFFFFF]"
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
                              Change password
                            </p>
                          </div>
                        </Link>
                      </div>

                      {/* IF SUBSCRIBED, UNSUBCRIBE  */}
                      {User?.role !== 1 && isUserSubscribed && (
                        <div
                          className={`cursor-pointer card-hover ${
                            currentMode === "dark"
                              ? "bg-[#000000]"
                              : "bg-[#FFFFFF]"
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
                              Unsubscribe package
                            </p>
                            <VscLock
                              size={14}
                              color={"#DA1F26"}
                              className="mr-2"
                            />
                          </div>
                          {/* </Link> */}
                        </div>
                      )}

                      {/* LOGOUT  */}
                      <div
                        className={`cursor-pointer card-hover ${
                          currentMode === "dark"
                            ? "bg-[#000000]"
                            : "bg-[#FFFFFF]"
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
                          <p className="mx-1 mr-2 font-semibold">Log out</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </Menu>
              ),
            ]}
          {/* {isClicked.cart && <Cart />} */}
          {/* {isClicked.chat && <Chat />} */}
          {/* {isClicked.notification && <Notification />} */}
          {/* {isClicked.userProfile && <UserProfile />} */}
        </div>
      </div>

      {/* <Breadcrumbs sx={{margin: "10px 0 20px 0", color: currentMode === "dark" && "white"}} aria-label="breadcrumb">
      <LinkRouter underline="hover" color="inherit" to="/">
        Home
      </LinkRouter>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const formattedLastURL = `${pathnames[index][0].toUpperCase()}${pathnames[index].slice(1, pathnames[index].length)}`.replace('%20', " ");
        const isClientsURL = pathnames[0] === "clientLeads" || pathnames[0] === "agencyUsers";
        return last ? (
          <Typography color="primary" key={to}>
            {formattedLastURL}
          </Typography>
        ) : (
          <LinkRouter underline="hover" color="inherit" to={isClientsURL ? "/clients" : `/${pathnames.slice(index, pathnames.length).join("/")}`} key={to}>
            {allRoutes.find((route) => route?.path?.includes(to))?.pageName}
          </LinkRouter>
        );
      })}
    </Breadcrumbs> */}
    </>
  );
};

export default Navbar;
