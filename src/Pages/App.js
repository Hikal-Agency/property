import { useEffect } from "react";
import AddLead from "./addlead";
import Booked from "./booked";
import ClosedealsPage from "./closedeals";
import TimelinePage from "./timeline";
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
import Restricted from "./Restricted";
import Role from "./roles";
import usePermission from "../utils/usePermission";

const libraries = ["places"];

const routes = [
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
    path: "/reshuffleleads/:lead_type",
    element: <TransferredLeads />,
    pageName: "Transferred Leads",
  },
  {
    path: "/closedeals",
    pageName: "Close Deals",
    element: <ClosedealsPage />,
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
    restrictedRoles: [2, 3, 7],
  },
  {
    path: "/roles",
    element: <Role />,
    pageName: "Roles",
    // restrictedRoles: [2, 3, 7],
  },
  {
    path: "/clients/agencyUsers/:client_id",
    element: <AgencyUsers />,
    pageName: "Clients",
    restrictedRoles: [2, 3, 7],
  },
  {
    path: "/clients/clientLeads/:client_id",
    element: <ClientLeads />,
    pageName: "Clients",
    restrictedRoles: [2, 3, 7],
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
    element: <WhatsappMarketing pageName={"contacts"}/>,
    pageName: "Marketing",
  },
  {
    path: "/marketing/payments",
    element: <WhatsappMarketing pageName={"payments"}/>,
    pageName: "Marketing",
  },
  {
    path: "/marketing/templates",
    element: <WhatsappMarketing pageName={"templates"}/>,
    pageName: "Marketing",
  },
    {
    path: "/marketing/all",
    element: <WhatsappMarketing pageName={"all"}/>,
    pageName: "Marketing",
  },
  {
    path: "/marketing/chat",
    element: <WhatsappMarketing pageName={"chat"}/>,
    pageName: "Marketing",
  },
  {
    path: "/instances",
    element: <WhatsappMarketing pageName={"instances"}/>,
    pageName: "Marketing",
    restrictedRoles: [2, 3, 7],
  },
  {
    path: "/location/meetinglocation",
    pageName: "Live Location",
    element: <Livelocation />,
    restrictedRoles: [3, 7],
  },
  {
    path: "/location/userlocation",
    pageName: "User Location",
    element: <Userlocation />,
    restrictedRoles: [3, 7],
  },
  {
    path: "/location/useralllocation/:user_id",
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
    path: "/users",
    pageName: "Users",
    element: <Users />,
    restrictedRoles: [7],
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
    restrictedRoles: [3, 2, 7],
  },
  {
    path: "/newsletter",
    pageName: "Newsletter",
    element: <Newsletter />,
    restrictedRoles: [3, 2, 7],
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
    path: "/singleTicket/:id",
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
    restrictedRoles: [3, 7],
  },
  {
    path: "/facebook",
    pageName: "Campaigns Statistics",
    element: <Statistics />,
    restrictedRoles: [3, 7],
  },
  {
    path: "/attendance/officeSettings",
    pageName: "Office Settings",
    element: <OfficeSettings />,
    restrictedRoles: [3, 7],
  },
  {
    path: "/attendance/employeesList",
    pageName: "Employees",
    element: <Employees />,
    restrictedRoles: [3, 7],
  },
  {
    path: "/attendance/singleEmployee/:eid",
    pageName: "Employees",
    element: <SingleEmployee />,
    restrictedRoles: [3, 7],
  },
  {
    path: "/settings",
    pageName: "Settings",
    element: <Settings />,
  },
  {
    path: "/integrations",
    pageName: "Settings",
    element: <Integrations />,
  },
  {
    path: "/search",
    pageName: "Search",
    element: <Search />,
  },
  {
    path: "*",
    element: <Error />,
  },
];

export const socket = io(process.env.REACT_APP_SOCKET_URL);

function App() {
  const { setAllRoutes, currentMode } = useStateContext();
  const location = useLocation();
  const {hasPermission} = usePermission();

  useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
    libraries,
  });

  useEffect(() => {
    setAllRoutes(routes);
  }, []);

  function hasSidebarOrNavbar() {
    const pathname = location.pathname;
    if (
      pathname === "/" ||
      // pathname === "/auth/signup" ||
      pathname === "/callLogs" ||
      pathname === "/attendance" ||
      pathname === "/fresh-logs" ||
      pathname === "/attendanceLogin"
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
          background: currentMode === "dark" ? "#000000" : "#ffffff",
        }}
      >
        <div className="flex" style={{ width: "99vw" }}>
          {hasSidebarOrNavbar() && <Sidebarmui />}
          <div
            className={`w-[99%] overflow-x-hidden ${
              hasSidebarOrNavbar() ? "pt-16" : "pt-0"
            } ${currentMode === "dark" ? "bg-black" : "bg-white"}`}
          >
            {hasSidebarOrNavbar() && (
              <div className={`px-5`}>
                <Navbar />
              </div>
            )}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/attendanceLogin" element={<AttendanceLogin />} />
              <Route path="/fresh-logs" element={<TodayCallLogs />} />
              <Route path="/dashboard" element={<Dashboard/>}/>
              {routes.map((route, index) => {
                
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={hasPermission(route?.path, true, true)?.isPermitted ? route.element : hasPermission(route?.path, true, true)?.element}
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
