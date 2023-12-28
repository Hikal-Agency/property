import { useEffect } from "react";
import AddLead from "./addlead";
import Booked from "./booked";
import ClosedealsPage from "./closedeals";
import ColdLeads from "./coldleads";
import Dashboard from "./dashboard";
import Error from "./Error";
import Home from "./Home";
import BlockedIPs from "./blocked";
import AllHotLeads from "./hotleads";
import AllUnassignedLeads from "./unassigned";
import LeadNotesPage from "./leadnotes";
import Meetings from "./appointments/meetings";
import CreateAppointment from "./appointments/createAppointment";
import PersonaLeads from "./personalleads";
import ProfilePage from "./profile";
import ThirdPartyLeads from "./thirdpartyleads";
import TransferredLeads from "./transfferedleads";
import WhatsappMarketing from "./whatsapp-marketing/WhatsappMarketing";
import Livelocation from "./location/livelocation";
import ChangePassword from "./auth/ChangePassword";
import { useJsApiLoader } from "@react-google-maps/api";
import Users from "./users";
import Offers from "./offers";
import Reports from "./reports";
import Tickets from "./support";
import Clients from "./clients";
import AgencyUsers from "./clients/agencyUser";
import Leaderboard from "./leaderboard";
import { useStateContext } from "../context/ContextProvider";

import Tour360 from "./propertyPortfolio/tour360";
import PropertyPortfolio from "./propertyPortfolio";
import ActivityLog from "./activity";
import ClientLeads from "./clients/clientLeads";
import Userlocation from "./location/userlocation";
import UserAllLocation from "./location/useralllocation";
import QAForm from "./qaform";
import Newsletter from "./newsletter";
import AddNewsLetters from "./newsletter/addNewsletter";
import Campaigns from "./SocialMedia/campaigns";
import SingleTicket from "./support/SingleTicket";
import UpdateUser from "./users/updateUser";
import { io } from "socket.io-client";
import Sidebarmui from "../Components/Sidebar/Sidebarmui";
import { Routes, Route, useNavigate } from "react-router-dom";
import Statistics from "./SocialMedia/statistics";
import AllQA from "./qaform/allQA";
import SingleLeadPage from "./singlelead";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import OfficeSettings from "./attendanceModule/officeSettings";
import Settings from "./settings";
import Employees from "./attendanceModule/employeesList";
import AllWarmLeads from "./warmleads";
import SingleEmployee from "../Components/attendance/SingleEmployee";
import CallLogsNoHeadFoot from "./leaderboard/callLogsNoHeadFoot";
import Integrations from "./integrations";
import RegisterAttendance from "./attendanceModule/RegisterAttendance";
import TodayCallLogs from "./leaderboard/TodayCallLogs";
import AttendanceLogin from "./auth/attendanceLogin";
import Search from "./search/Search";
import ChatPage from "./chat";
import Role from "./roles";
import usePermission from "../utils/usePermission";
import Notifications from "./notifications";
import NotificationsList from "./notifications/notificationsList";
import Listings from "./listings";
import SingleListingsPage from "./listings/SingleListingsPage";
import ListingUsers from "./listingsUsers";
import Buyers from "./listingsUsers/buyers";
import AllLiveLeads from "./liveleads";
import MeetInvite from "./MeetInvite";
import Snapchat from "./SocialMedia/snapchat";
import TransferRequest from "./transfferedleads/TransferRequest";
import OnBoarding from "./OnBoarding";
import ClientsList from "./OnBoarding/ClientsList";
import Twillio from "./twillio";

const libraries = ["places"];

const routes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    pageName: "Chat",
  },
  {
    path: "/chat",
    element: <ChatPage />,
    pageName: "Chat",
  },
  {
    path: "/callLogs",
    element: <CallLogsNoHeadFoot />,
    pageName: "Call logs Full View",
  },
  {
    path: "/attendance",
    element: <RegisterAttendance />,
    pageName: "Register Attendance",
  },
  // {
  //   path: "/fresh-logs",
  //   element: <TodayCallLogs />,
  //   pageName: "Fresh CallLogs",
  // },
  // {
  //   path: "/attendanceLogin",
  //   element: <AttendanceLogin />,
  //   pageName: "Attendance Login",
  // },
  // {
  //   path: "/",
  //   element: <Home />,
  //   pageName: "Home",
  // },
  // {
  //   path: "/auth/signup",
  //   pageName: "Sign Up",
  //   element: <Signup />,
  // },

  // {
  //   path: "/auth/forgot-password",
  //   pageName: "Sign Up",
  //   element: <ForgotPassword />,
  // },
  {
    path: "/changepassword",
    element: <ChangePassword />,
    pageName: "Change Password",
  },
  {
    path: "/addlead",
    element: <AddLead />,
    pageName: "Add Lead",
  },
  {
    path: "/unassigned/:lead_type",
    element: <AllUnassignedLeads />,
    pageName: "Unassigned Leads",
  },
  {
    path: "/archive/:lead_type",
    element: <AllWarmLeads />,
    pageName: "Warm Leads",
  },
  {
    path: "/freshleads/:lead_type",
    element: <AllHotLeads />,
    pageName: "Hot Leads",
  },
  {
    path: "/liveleads/:lead_type",
    element: <AllLiveLeads />,
    pageName: "Live Call Leads",
  },
  {
    path: "/personalleads/:lead_type",
    element: <PersonaLeads />,
    pageName: "Personal Leads",
  },
  {
    path: "/thirdpartyleads/:lead_type",
    element: <ThirdPartyLeads />,
    pageName: "Third-party Leads",
  },
  {
    path: "/coldleads/:lead_type",
    element: <ColdLeads />,
    pageName: "Cold Leads",
  },
  {
    path: "/blocked",
    element: <BlockedIPs />,
    pageName: "Blocked IPs",
  },
  {
    path: "/reshuffleleads",
    element: <TransferredLeads />,
    pageName: "Transferred Leads",
  },
  {
    path: "/reshuffleRequest",
    element: <TransferRequest />,
    pageName: "Transferred Leads Request",
  },
  {
    path: "/closedeals",
    pageName: "Close Deals",
    element: <ClosedealsPage />,
  },
  {
    path: "/onboarding",
    pageName: "OnBoarding",
    element: <OnBoarding />,
  },
  {
    path: "/onboarding/clientsList",
    pageName: "CRM Clients",
    element: <ClientsList />,
  },
  // {
  //   path: "/timeline/:id",
  //   element: <TimelinePage />,
  //   pageName: "Timeline",
  // },
  {
    path: "/leadnotes",
    element: <LeadNotesPage />,
    pageName: "Lead Notes",
  },
  {
    path: "/leadnotes/:lid",
    // element: <SingleLeadNote />,
    element: <SingleLeadPage />,
    pageName: "Lead Notes",
  },
  {
    path: "/lead/:lid",
    element: <SingleLeadPage />,
    page: "Lead",
  },
  {
    path: "/meetings",
    element: <Meetings />,
    pageName: "Meetings",
  },
  {
    path: "/appointments",
    element: <CreateAppointment />,
    pageName: "Create Appointment",
  },
  {
    path: "/booked",
    element: <Booked />,
    pageName: "Booked",
  },
  // {
  //   path: "/contacts",
  //   element: <Contacts />,
  //   pageName: "Contacts",
  // },
  {
    path: "/clients",
    element: <Clients />,
    pageName: "Clients",
  },
  {
    path: "/roles",
    element: <Role />,
    pageName: "Roles",
  },
  {
    path: "/clients/agencyUsers/:client_id",
    element: <AgencyUsers />,
    pageName: "Clients",
  },
  {
    path: "/clients/clientLeads/:client_id",
    element: <ClientLeads />,
    pageName: "Clients",
  },
  {
    path: "/leaderboard",
    element: <Leaderboard />,
    pageName: "Leaderboard",
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    pageName: "Profile",
  },
  {
    path: "/marketing/contacts",
    element: <WhatsappMarketing pageName={"contacts"} />,
    pageName: "Marketing",
  },
  {
    path: "/marketing/payments",
    element: <WhatsappMarketing pageName={"payments"} />,
    pageName: "Marketing",
  },
  {
    path: "/marketing/templates",
    element: <WhatsappMarketing pageName={"templates"} />,
    pageName: "Marketing",
  },
  {
    path: "/marketing/all",
    element: <WhatsappMarketing pageName={"all"} />,
    pageName: "Marketing",
  },
  {
    path: "/marketing/messages",
    element: <WhatsappMarketing pageName={"messages"} />,
    pageName: "Messages",
  },
  {
    path: "/marketing/chat",
    element: <WhatsappMarketing pageName={"chat"} />,
    pageName: "Marketing",
  },
  {
    path: "/instances",
    element: <WhatsappMarketing pageName={"instances"} />,
    pageName: "Marketing",
  },
  {
    path: "/location/meetinglocation",
    pageName: "Live Location",
    element: <Livelocation />,
  },
  {
    path: "/location/userlocation",
    pageName: "User Location",
    element: <Userlocation />,
    restrictedRoles: [3, 7],
  },
  {
    path: "/location/useralllocation/:user_id/:date",
    pageName: "User All Location",
    element: <UserAllLocation />,
    restrictedRoles: [3, 7],
  },
  {
    path: "/updateuser/:id",
    pageName: "Users",
    element: <UpdateUser />,
  },
  {
    path: "/snapchat",
    pageName: "Snapchat",
    element: <Snapchat />,
  },
  {
    path: "/users",
    pageName: "Users",
    element: <Users />,
  },

  {
    path: "/offers",
    pageName: "Offers",
    element: <Offers />,
  },
  {
    path: "/reports",
    pageName: "Reports",
    element: <Reports />,
  },
  {
    path: "/newsletter/addnewsletter",
    pageName: "Newsletter",
    element: <AddNewsLetters />,
  },
  {
    path: "/newsletter",
    pageName: "Newsletter",
    element: <Newsletter />,
  },
  {
    path: "/trainer",
    pageName: "QAForm",
    element: <QAForm />,
  },
  {
    path: "/qa",
    pageName: "All QA",
    element: <AllQA />,
  },
  {
    path: "/support",
    pageName: "Support",
    element: <Tickets />,
  },
  {
    path: "/support/singleTicket/:id",
    pageName: "SingleTicket",
    element: <SingleTicket />,
  },
  {
    path: "/activity",
    pageName: "Activity",
    element: <ActivityLog />,
  },
  {
    path: "/propertyPortfolio",
    pageName: "Property Portfolio",
    element: <PropertyPortfolio />,
  },
  {
    path: "/propertyPortfolio/tour360/:proId",
    pageName: "360 Tour",
    element: <Tour360 />,
  },
  {
    path: "/campaigns",
    pageName: "Facebook Campaigns",
    element: <Campaigns />,
  },
  {
    path: "/facebook",
    pageName: "Campaigns Statistics",
    element: <Statistics />,
  },
  {
    path: "/attendance/officeSettings",
    pageName: "Office Settings",
    element: <OfficeSettings />,
  },
  {
    path: "/attendance/employeesList",
    pageName: "Employees",
    element: <Employees />,
  },
  {
    path: "/attendance/singleEmployee/:eid",
    pageName: "Employees",
    element: <SingleEmployee />,
  },
  {
    path: "/attendance_self",
    pageName: "My Attendance",
    element: <SingleEmployee />,
  },
  {
    path: "/settings",
    pageName: "Settings",
    element: <Settings />,
  },
  // {
  //   path: "/integrations",
  //   pageName: "Integrations",
  //   element: <Integrations />,
  // },
  {
    path: "/notifications",
    pageName: "Settings",
    element: <Notifications />,
  },
  {
    path: "/notificationsList",
    pageName: "Settings",
    element: <NotificationsList />,
  },
  {
    path: "/search",
    pageName: "Search",
    element: <Search />,
  },
  {
    path: "/secondaryListings",
    pageName: "Secondary Listings",
    element: <Listings />,
  },
  {
    path: "/secondaryListings/:lid",
    element: <SingleListingsPage />,
    page: "Single Listing",
  },
  {
    path: "/sellers",
    element: <ListingUsers />,
    page: "Single Listing",
  },
  {
    path: "/buyers/:lead_type",
    element: <Buyers />,
    pageName: "Buyers",
  },
  {
    path: "/twillioSetting",
    element: <Twillio />,
    pageName: "Twillio",
  },
  {
    path: "*",
    element: <Error />,
  },
];

export const socket = io(process.env.REACT_APP_SOCKET_URL);

export let load = null;

function App() {
  const { setAllRoutes, currentMode, themeBgImg } = useStateContext();
  const location = useLocation();
  const { hasPermission } = usePermission();

  const loadMaps = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
    libraries,
  });

  load = loadMaps;

  useEffect(() => {
    setAllRoutes(routes);
  }, []);

  // useEffect(() => {
  //   const handleMessage = (event) => {
  //     console.log("event msg:==============> ");
  //     if (event.data && event.data.type === "userLoggedIn") {
  //       // Update auth token in the state
  //       localStorage.getItem(event.data.data);
  //       window.location.reload();
  //     }
  //   };

  //   // Listen for messages from other tabs
  //   window.addEventListener("message", handleMessage);

  //   // Cleanup the event listener on component unmount
  //   return () => {
  //     window.removeEventListener("message", handleMessage);
  //   };
  // }, []);

  function hasSidebarOrNavbar() {
    const pathname = location.pathname;
    if (
      pathname === "/" ||
      // pathname === "/auth/signup" ||
      pathname === "/callLogs" ||
      pathname === "/attendance" ||
      pathname === "/fresh-logs" ||
      pathname === "/attendanceLogin" ||
      pathname.startsWith("/invite")
    ) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <>
      <ToastContainer />
      <div
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        <div className="flex" id="body-div " style={{ width: "100vw" }}>
          {hasSidebarOrNavbar() && <Sidebarmui />}
          <div
            className={`w-[100%] overflow-x-hidden ${
              hasSidebarOrNavbar() ? "pt-16" : "pt-0"
            } ${
              !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
            }`}
          >
            {hasSidebarOrNavbar() && (
              <div className={`px-0`}>
                <Navbar />
              </div>
            )}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/attendance" element={<RegisterAttendance />} />
              <Route path="/attendanceLogin" element={<AttendanceLogin />} />
              <Route path="/fresh-logs" element={<TodayCallLogs />} />
              <Route path="/invite/:meetingID" element={<MeetInvite />} />
              {routes.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      hasPermission(route?.path, true, true)?.isPermitted
                        ? route.element
                        : hasPermission(route?.path, true, true)?.element
                    }
                  />
                );
              })}
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
