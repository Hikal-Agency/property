import React, { createContext, useContext, useState } from "react";
import axios from "../axoisConfig";

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
  // eslint-disable-next-line
  const [DarkIconsColor, setDarkIconsColor] = useState("#15CDCA");
  // eslint-disable-next-line
  const [LightIconsColor, setLightIconsColor] = useState("#DA1F26");
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
  const [UserLocationData, setUserLocationData] = useState();
  const [LastLocationData, setLastLocationData] = useState();
  const [DevProData, setDevProData] = useState();
  const [ProjectData, setProjectData] = useState();
  const [fetchManagers, setfetchManagers] = useState(false);
  const [Sales_chart_data, setSales_chart_data] = useState([]);
  const [SalesPerson, setSalesPerson] = useState([]);
  const [Managers, setManagers] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [isUserSubscribed, setIsUserSubscribed] = useState(null);
  const [appLoading, setAppLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [sidebarData, setSidebarData] = useState({});
  const [fbToken, setFBToken] = useState();
  const [permits, setPermits] = useState("");

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
      color: "white",
    },
    // TOOLBAR COLORS
    "& .MuiDataGrid-toolbarContainer": {
      backgroundColor: currentMode === "dark" ? "#212121" : "#000000",
      // backgroundColor: "#3b3d44",
      paddingTop: "10px",
      paddingBottom: "10px",
      paddingLeft: "20px",
      paddingRight: "20px",
    },
    // TOOLBAR BUTTON
    "& .MuiInputBase-root": {
      color: "white",
    },
    "& .MuiInputBase-root::before": {
      color: "white",
      // borderColor: "white",
    },
    "& .MuiInputBase-root:hover::before": {
      color: "white",
      // borderColor: "white",
    },

    // Background color of header of data grid
    "& .MuiDataGrid-columnHeaders": {
      border: "none",
      backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
      color: currentMode === "dark" ? "white" : "white",
    },
    "& .MuiIconButton-sizeSmall": {
      color: currentMode === "dark" ? "white" : "white",
    },
    // background color of main table content
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: currentMode === "dark" ? "#212121" : "#ffffff",
      color: currentMode === "dark" ? "white" : "black",
    },
    // changing rows hover color
    "& .css-1uhmucx-MuiDataGrid-root,& .MuiDataGrid-row:hover": {
      backgroundColor: currentMode === "dark" && "#000000",
      border: "none",
    },
    // changing row colors
    "& .even": {
      backgroundColor: currentMode === "dark" ? "#212121" : "#ffffff",
    },
    // changing rows right border
    // "& .MuiDataGrid-cell": {
    //   borderRight: "1px solid rgb(240, 240, 240)",
    // },
    // BACKGROUND COLOR OF FOOTER
    "& .MuiDataGrid-footerContainer": {
      border: "none",
      backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
      color: "white",
    },
    "& .MuiTablePagination-selectLabel": {
      color: "white",
    },
    "& .MuiTablePagination-select ": { color: "white" },
    "& .MuiSvgIcon-fontSizeMedium ": { color: "white" },
    "& .MuiTablePagination-displayedRows": { color: "white" },
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
      color: "#DA1F26 !important",
    },
    "& .MuiTab-root,& .MuiTab-textColorPrimary": {
      color: currentMode === "dark" && "white",
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "#DA1F26 !important",
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

  const handleClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: true });

  function formatNum(value) {
    if (value < 10) {
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
      console.log("Sidebar data::", response.data.data);
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

  const isArabic = (text) => {
    const regex = new RegExp("[\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF]+([\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF\\W\\d]+)*","g");

    if(text) {
      return text.match(regex);
    } else {
      return false;
    }
  };

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
        DarkIconsColor,
        LightIconsColor,
        currentMode,
        selected,
        isArabic,
        setSelected,
        darkModeColors,
        activeMenu,
        pageState,
        setpageState,
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
        setIsUserSubscribed,
        permits, 
        setPermits,
        appLoading,
        setAppLoading,
        sidebarData,
        fetchSidebarData,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
