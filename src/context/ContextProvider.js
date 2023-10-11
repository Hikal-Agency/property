import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../axoisConfig";
import {toast} from "react-toastify";
const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const BACKEND_URL = process.env.REACT_APP_API_URL;
  const graph_api_token = process.env.REACT_APP_FB_TOKEN;
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentMode, setCurrentMode] = useState(
    localStorage.getItem("currentMode") || "light"
  );
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [User, setUser] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const [reloadDataGrid, setreloadDataGrid] = useState(false);
  const [openBackDrop, setopenBackDrop] = useState(false);
  const [DashboardData, setDashboardData] = useState();
  const [LocationData, setLocationData] = useState();
  const [userCredits, setUserCredits] = useState("");
  const [UserLocationData, setUserLocationData] = useState();
  const [LastLocationData, setLastLocationData] = useState();
  const [DevProData, setDevProData] = useState();
  const [ProjectData, setProjectData] = useState();
  const [fetchManagers, setfetchManagers] = useState(false);
  const [Sales_chart_data, setSales_chart_data] = useState([]);
  const [SalesPerson, setSalesPerson] = useState([]);
  const [notifIconAnimating, setNotifIconAnimating] = useState(false);
  const [Managers, setManagers] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [isUserSubscribed, setIsUserSubscribed] = useState(null);
  const [appLoading, setAppLoading] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [sidebarData, setSidebarData] = useState({});
  const [fbToken, setFBToken] = useState();
  const [permits, setPermits] = useState("");
  const [primaryColor, setPrimaryColor] = useState("default");
  const [themeBgImg, setThemeBgImg] = useState("");
  const [session, setSession] = useState({
    expiresIn: localStorage.getItem("expires_in"),
    accessToken: localStorage.getItem("access_token"),
    userName: "",
  });

  // DATA GRID
  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    to: 0,
    from: 0,
    perpage: 14,
    pageSize: 15,
  });
  const DataGridStyles = {
    "& .MuiButtonBase-root": {
      color: currentMode === "dark" ? "white" : "black",
    },
    // TOOLBAR COLORS
    "& .MuiDataGrid-toolbarContainer": {
      // backgroundColor: currentMode === "dark" ? "#212121" : "#000000",
      backgroundColor: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
      padding: "10px 5px",
      gap: "15px",
      color: currentMode === "dark" ? "white" : "black",
    },
    // TOOLBAR BUTTON
    "& .MuiInputBase-root": {
      color: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiInputBase-root::before": {
      color: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiInputBase-root:hover::before": {
      color: currentMode === "dark" ? "white" : "black",
    },

    // Background color of header of data grid
    "& .MuiDataGrid-columnHeaders": { // css-s3ulew-
      border: "none",
      backgroundColor: primaryColor,
      color: currentMode === "dark" ? "white" : "white",
      borderRadius: "0",
      width: "100%",
    },
    "& .MuiDataGrid-root .MuiDataGrid-main": {
      height: "auto",
      overflowY: "inherit !important",
    },
    // DATATABLE BORDER - DARK
    "& .MuiDataGrid-root": { //css-h0wcjk-
      border: "none !important",
      boxShadow: "none !important",
    },
    // DATATABLE BORDER - LIGHT
    "& .MuiDataGrid-root": { //css-hgxfug-
      border: "none !important",
      boxShadow: "none !important",
    },
    "& .MuiIconButton-sizeSmall": {
      color: currentMode === "dark" ? "white" : "black",
    },
    // background color of main table content
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: currentMode === "dark" ? "black" : "white",
      color: currentMode === "dark" ? "white" : "black",
    },
    // changing rows hover color
    "& .MuiDataGrid-row:hover": { //css-1uhmucx-
      backgroundColor: currentMode === "dark" && "#1C1C1C",
      border: "none !important",
      boxShadow: "none !important",
    },
    "& .MuiDataGrid-root": { //css-s3ulew-
      border: "none !important",
      boxShadow: "none !important",
    },
    "& .MuiDataGrid-root": { //css-otzuo3-
      border: "none !important",
      boxShadow: "none !important",
    },
    // changing row colors
    "& .even": {
      backgroundColor: currentMode === "dark" ? "black" : "white",
    },
    // changing rows right border
    // "& .MuiDataGrid-cell": {
      // borderRight: "1px solid rgb(240, 240, 240)",
    // },

    // BACKGROUND COLOR OF FOOTER
    "& .MuiDataGrid-footerContainer": {
      // border: "none",
      borderTop: `2px solid ${primaryColor}`,
      backgroundColor: currentMode === "dark" ? "black" : "white",
      color: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiTablePagination-selectLabel": {
      color: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiTablePagination-select ": { 
      color: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiSvgIcon-fontSizeMedium ": { 
      color: currentMode === "dark" ? "white" : "black",
      // TODO: For Pagination SVG, white
    },
    "& .MuiTablePagination-displayedRows": { 
      color: currentMode === "dark" ? "white" : "black",
    },
  };

  const darkModeColors = {
    // For DARK MODE
    // SELECT STATEMENT LABLE COLOR
    "& .MuiInputBase-root": {
      color: currentMode === "dark" && "white !important",
    },

    // TEXT FIELDS LABEL COLOR
    "& .MuiFormLabel-root, & .MuiInputLabel-root, & .MuiInputLabel-formControl":
      {
        color: currentMode === "dark" && "white !important",
      },

    // border color of text fields and select fields
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: currentMode === "dark" && "white !important",
    },

    // color of dropdown button
    "& .MuiSvgIcon-root, & .MuiSvgIcon-fontSizeMedium, & .MuiSelect-icon,& .MuiSelect-iconOutlined":
      {
        color: currentMode === "dark" && "white",
      },
    // text color for textfields
    // "& .MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-formControl":
    //   {
    //     color: currentMode === "dark" && "white",
    //   },
    // hover border color of textfield
    // "& .css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
    //   {
    //     borderColor: currentMode === "dark" && "white",
    //   },
    // fixed lable color
    // "& .css-1sumxir-MuiFormLabel-root-MuiInputLabel-root.Mui-focused": {
    //   color: currentMode === "dark" && "#DA1F26",
    // },

    // TABS HEADERS COLOR
    "& .Mui-selected": {
      color: `${primaryColor} !important`,
    },
    "& .MuiTab-root,& .MuiTab-textColorPrimary": {
      color: currentMode === "dark" && "white",
    },
    "& .MuiTabs-indicator": {
      backgroundColor: `${primaryColor} !important`,
    },
  };

  // const setMode = (e) => {
  //   setCurrentMode(e.target.value);
  //   localStorage.setItem("themeMode", e.target.value);
  // };

  // const setColor = (color) => {
  //   setCurrentColor(color);
  //   localStorage.setItem("colorMode", color);
  // };

  function formatTime(dateStr) {
    let date;
    if(dateStr === "now") {
      date = new Date();
    } else {
     date = new Date(dateStr);
    }
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = ((hours % 12) || 12).toString().padStart(2, '0'); // Convert 0 to 12
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
}

  const handleClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: true });

  function formatNum(value) {
    if(value === 0) {
      return 0;
    }else if (value < 10) {
      return "0" + value;
    } else {
      return value;
    }
  }

  const fetchSidebarData = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/sidebar/1`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setSidebarData({
        HotLeadsCount: response.data.data["HOT LEADS"],
        ColdLeadsCount: response.data.data["COLD LEADS"],
        PersonalLeadsCount: response.data.data["PERSONAL LEADS"],
        ThirdPartyLeadsCount: response.data.data["THIRD PARTY LEADS"],
        UnassignedLeadsCount: response.data.data["unassigned"],
        WarmLeadCount: response.data.data["WARM LEADS"],
        UNASSIGNED: {
          fresh: response.data.data["unassigned"]["HOT LEADS"],
          cold: response.data.data["unassigned"]["COLD LEADS"],
          personal: response.data.data["unassigned"]["PERSONAL LEADS"],
          third_party: response.data.data["unassigned"]["THIRD PARTY LEADS"],
          warm: response.data.data["unassigned"]["WARM LEADS"],
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

    const getNotifCounts = async () => {
    try {
     const token = localStorage.getItem("auth-token");
        const response = await axios.get(`${BACKEND_URL}/unreadCount?user_id=${User?.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const notifsCount = response.data?.count || 0;
        setUnreadNotifsCount(notifsCount);
    } catch (error) {
      console.log(error);
        toast.error("Sorry, couldn't fetch notifications count!", {
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
  }

  const isArabic = (text) => {
    const regex = new RegExp(
      "[\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF]+([\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF\\W\\d]+)*",
      "g"
    );

    if (text) {
      return text.match(regex);
    } else {
      return false;
    }
  };

  const isEnglish = (text) => {
    const regex = new RegExp(
      "^[\u0000-\u007F]+$", "g"
    );

    if (text) {
      return text.match(regex);
    } else {
      return false;
    }
  };
  useEffect(() => {
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      // if(primaryColor) {
      //   localStorage.setItem("theme", primaryColor);
      // }
  }, [primaryColor]);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${themeBgImg})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    document.body.style.backgroundBlendMode =  "overlay";

}, [themeBgImg]);

  const withOpacity = (rgb, opacity) => {
    return rgb.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }

  const ReFetchProfile = () => {
    const token = localStorage.getItem("auth-token");
    axios
        .get(`${BACKEND_URL}/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((result) => {

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
          };

          setUser(user);
        })
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider
      value={{
        BACKEND_URL,
        graph_api_token,
        User,
        setUser,
        DashboardData,
        setDashboardData,
        LocationData,
        setLocationData,
        UserLocationData,
        setUserLocationData,
        LastLocationData,
        setLastLocationData,
        DevProData,
        setDevProData,
        ProjectData,
        setProjectData,
        isCollapsed,
        setIsCollapsed,
        currentMode,
        selected,
        isArabic,
        isEnglish,
        formatTime,
        setSelected,
        darkModeColors,
        activeMenu,
        pageState,
        setpageState,
        session,
        setSession,
        DataGridStyles,
        reloadDataGrid,
        setreloadDataGrid,
        openBackDrop,
        setopenBackDrop,
        fetchManagers,
        setfetchManagers,
        Sales_chart_data,
        setSales_chart_data,
        SalesPerson,
        setSalesPerson,
        Managers,
        setManagers,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        initialState,
        setIsClicked,
        setActiveMenu,
        setCurrentMode,
        selectedDevice,
        setSelectedDevice,
        fbToken,
        setFBToken,
        // setMode,
        // setColor,
        themeSettings,
        setThemeSettings,
        formatNum,
        allRoutes,
        setAllRoutes,
        isUserSubscribed,
        withOpacity,
        setIsUserSubscribed,
        permits,
        setPermits,
        appLoading,
        setAppLoading,
        sidebarData,
        fetchSidebarData,
        unreadNotifsCount, 
        notifIconAnimating, 
        setNotifIconAnimating, 
        setUnreadNotifsCount, 
        getNotifCounts, 
        ReFetchProfile,
        userCredits,
        setUserCredits, 
        primaryColor, 
        setPrimaryColor,
        themeBgImg, 
        setThemeBgImg
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
