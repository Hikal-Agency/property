// import React, { createContext, useContext, useState } from "react";
// import axios from "../axoisConfig";
// import { toast } from "react-toastify";
// const FilterContext = createContext();

// const initialState = {
//   chat: false,
//   cart: false,
//   userProfile: false,
//   notification: false,
// };

// export const ContextProvider = ({ children }) => {
// //   const BACKEND_URL = process.env.REACT_APP_API_URL;
// //   const graph_api_token = process.env.REACT_APP_FB_TOKEN;
// //   const [screenSize, setScreenSize] = useState(undefined);
// //   // eslint-disable-next-line
// //   const [DarkIconsColor, setDarkIconsColor] = useState("#15CDCA");
// //   // eslint-disable-next-line

// const [emailFilter,setEmailError] = useState("")

//   return (
//     // eslint-disable-next-line react/jsx-no-constructed-context-values
//     <FilterContext.Provider
//       value={{
//         BACKEND_URL,
//         graph_api_token,
//         User,
//         setUser,
//         DashboardData,
//         setDashboardData,
//         LocationData,
//         setLocationData,
//         UserLocationData,
//         setUserLocationData,
//         LastLocationData,
//         setLastLocationData,
//         DevProData,
//         setDevProData,
//         ProjectData,
//         setProjectData,
//         isCollapsed,
//         setIsCollapsed,
//         DarkIconsColor,
//         LightIconsColor,
//         currentMode,
//         selected,
//         isArabic,
//         formatTime,
//         setSelected,
//         darkModeColors,
//         activeMenu,
//         pageState,
//         setpageState,
//         session,
//         setSession,
//         DataGridStyles,
//         reloadDataGrid,
//         setreloadDataGrid,
//         openBackDrop,
//         setopenBackDrop,
//         fetchManagers,
//         setfetchManagers,
//         Sales_chart_data,
//         setSales_chart_data,
//         SalesPerson,
//         setSalesPerson,
//         Managers,
//         setManagers,
//         screenSize,
//         setScreenSize,
//         handleClick,
//         isClicked,
//         initialState,
//         setIsClicked,
//         setActiveMenu,
//         setCurrentMode,
//         selectedDevice,
//         setSelectedDevice,
//         fbToken,
//         setFBToken,
//         // setMode,
//         // setColor,
//         themeSettings,
//         setThemeSettings,
//         formatNum,
//         allRoutes,
//         setAllRoutes,
//         isUserSubscribed,
//         setIsUserSubscribed,
//         permits,
//         setPermits,
//         appLoading,
//         setAppLoading,
//         sidebarData,
//         fetchSidebarData,
//         unreadNotifsCount,
//         notifIconAnimating,
//         setNotifIconAnimating,
//         setUnreadNotifsCount,
//         getNotifCounts,
//         userCredits,
//         setUserCredits,
//       }}
//     >
//       {children}
//     </FilterContext.Provider>
//   );
// };

// export const useStateContext = () => useContext(FilterContext);
