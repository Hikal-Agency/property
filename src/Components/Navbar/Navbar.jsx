import React, { useContext, useEffect, useState } from "react";
import { AiOutlineCalendar, AiOutlineMenu } from "react-icons/ai";
import { RiLockPasswordFill, RiNotification3Line } from "react-icons/ri";
import {
  MdDarkMode,
  MdKeyboardArrowDown,
  MdOutlineLightMode,
} from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import { Tooltip, Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { useProSidebar } from "react-pro-sidebar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { CgLogOut } from "react-icons/cg";
import { ColorModeContext } from "../../context/theme";
import NotificationsMenu from "./NotificationsMenu";
import UpcomingMeetingsMenu from "./UpcomingMeetingsMenu";
import { Link, useLocation } from "react-router-dom";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <Tooltip title={title} arrow placement="bottom">
    <button
      type="button"
      onClick={customFunc}
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
    isCollapsed,
    allRoutes,
    setIsCollapsed,
  } = useStateContext();
  const colorMode = useContext(ColorModeContext);
  const { collapseSidebar } = useProSidebar();
  const {
    activeMenu,
    setActiveMenu,
    setScreenSize,
    screenSize,
    setopenBackDrop,
  } = useStateContext();
  const [currNavBtn, setCurrNavBtn] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const handleClick = (event, navBtn) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
    setCurrNavBtn(navBtn);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  const LogoutUser = () => {
    localStorage.removeItem("auth-token");
    window.open("/", "_self");
  };

  useEffect(() => {
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

  function LinkRouter(props) {
    return <MuiLink {...props} component={Link} />;
  }

  console.log(pathnames);

  return (
    <>
    <div className="flex justify-between p-2  relative">
      <div
        onClick={() => {
          collapseSidebar();
          setIsCollapsed(!isCollapsed);
        }}
        className="flex items-center rounded-lg px-5 cursor-pointer"
      >
        <button
          type="button"
          // style={{ color: currentColor }}
          className={`relative text-xl rounded-full hover:bg-light-gray mr-2  ${
            currentMode === "dark" ? "text-white" : "text-main-red-color"
          }`}
        >
          <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
          <AiOutlineMenu />
        </button>
        <span
          className={`text-md font-bold select-none ${
            currentMode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Menu
        </span>
      </div>
      <div className="flex">
        <NavButton
          title="Meetings"
          dotColor={currentMode === "dark" ? "#ffffff" : LightIconsColor}
          customFunc={(event) => handleClick(event, "Meetings")}
          color={currentMode === "dark" ? "#ffffff" : LightIconsColor}
          icon={<AiOutlineCalendar />}
        />
        <NavButton
          title="Notification"
          dotColor={currentMode === "dark" ? "#ffffff" : LightIconsColor}
          customFunc={(event) => handleClick(event, "Notifications")}
          color={currentMode === "dark" ? "#ffffff" : LightIconsColor}
          icon={<RiNotification3Line />}
        />
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
            {currentMode === "dark" ? <MdOutlineLightMode /> : <MdDarkMode />}
          </button>
        </Tooltip>
        <Tooltip title="Profile" arrow placement="bottom">
          <div
            className="ml-2 flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={handleClick}
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
        {/* Submenu */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              height: "auto",
              overflow: "visible",
              overflowY: "scroll",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              background: currentMode === "dark" ? "#4f5159" : "#eef1ff",
              color: currentMode === "dark" ? "#ffffff" : "black",
              minWidth: 300,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 66,
                width: 10,
                height: 10,
                background: currentMode === "dark" ? "#4f5159" : "#eef1ff",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "center", vertical: "top" }}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        >
          {currNavBtn ? (
            (currNavBtn === "Notifications") ? (
                <NotificationsMenu/>
            ) : (currNavBtn === "Meetings") ? (
              <UpcomingMeetingsMenu/>
            ) : (
              <MenuItem/>
            )
          ) : (
            <div className="menu-wrapper">
              <MenuItem>
                <Link to={"/profile"} onClick={() => setopenBackDrop(true)}>
                  <div className="flex items-center space-x-2">
                    <Avatar src={User?.displayImg} className="inline-block" />
                    <span>Profile</span>
                  </div>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to={"/change-password"}
                  onClick={() => setopenBackDrop(true)}
                >
                  <div className="flex items-center space-x-2">
                    <RiLockPasswordFill className="inline-block" />
                    <span>Change Password</span>
                  </div>
                </Link>
              </MenuItem>
              <MenuItem onClick={LogoutUser}>
                <CgLogOut className="mr-3 text-lg" /> Logout
              </MenuItem>
            </div>
          )}
        </Menu>
        {/* {isClicked.cart && <Cart />} */}
        {/* {isClicked.chat && <Chat />} */}
        {/* {isClicked.notification && <Notification />} */}
        {/* {isClicked.userProfile && <UserProfile />} */}
      </div>
    </div>

        <Breadcrumbs sx={{margin: "10px 0 20px 0", color: currentMode === "dark" && "white"}} aria-label="breadcrumb">
      <LinkRouter underline="hover" color="inherit" to="/">
        Home
      </LinkRouter>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const formattedLastURL = `${pathnames[index][0].toUpperCase()}${pathnames[index].slice(1, pathnames[index].length)}`.replace('%20', " ");
        console.log("URL: ",formattedLastURL)
        return last ? (
          <Typography color="primary" key={to}>
            {formattedLastURL}
          </Typography>
        ) : (
          <LinkRouter underline="hover" color="inherit" to={`/${pathnames.slice(index, pathnames.length).join("/")}`} key={to}>
            {allRoutes.find((route) => route?.path?.includes(to))?.pageName}
          </LinkRouter>
        );
      })}
    </Breadcrumbs>
    </>
  );
};

export default Navbar;