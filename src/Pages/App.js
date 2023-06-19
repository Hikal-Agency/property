import { useEffect } from "react";
import AddLead from "./addlead";
import Signup from "./auth/signup";
import Booked from "./booked";
import ClosedealsPage from "./closedeals";
import TimelinePage from "./timeline";
import ColdLeads from "./coldleads";
import Contacts from "./contacts";
import Dashboard from "./dashboard";
import Error from "./Error";
import Home from "./Home";
import AllHotLeads from "./hotleads";
import AllUnassignedLeads from "./unassigned";
import LeadNotesPage from "./leadnotes";
import SingleLeadNote from "./leadnotes/SingleLeadNote";
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
import { Routes, Route } from "react-router-dom";
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

const libraries = ["places"];

const routes = [
  {
    path: "/",
    element: <Home />,
    pageName: "Home",
  },
  {
    path: "/auth/signup",
    pageName: "Sign Up",
    element: <Signup />,
  },

  // {
  //   path: "/auth/forgot-password",
  //   pageName: "Sign Up",
  //   element: <ForgotPassword />,
  // },
  {
    path: "/change-password",
    element: <ChangePassword />,
    pageName: "Change Password",
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    pageName: "Dashboard",
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
    path: "/reshuffleleads",
    element: <TransferredLeads />,
    pageName: "Transferred Leads",
  },
  {
    path: "/closedeals",
    pageName: "Close Deals",
    element: <ClosedealsPage />,
  },
  {
    path: "/timeline/:id",
    element: <TimelinePage />,
    pageName: "Timeline",
  },
  {
    path: "/leadnotes",
    element: <LeadNotesPage />,
    pageName: "Lead Notes",
  },
  {
    path: "/leadnotes/:id",
    element: <SingleLeadNote />,
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
    path: "/appointments/create",
    element: <CreateAppointment />,
    pageName: "Create Appointment",
  },
  {
    path: "/booked",
    element: <Booked />,
    pageName: "Booked",
  },
  {
    path: "/contacts",
    element: <Contacts />,
    pageName: "Contacts",
  },
  {
    path: "/clients",
    element: <Clients />,
    pageName: "Clients",
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
    path: "/whatsapp-marketing/:page",
    element: <WhatsappMarketing />,
    pageName: "Whatsapp Marketing",
  },
  {
    path: "/location/livelocation",
    pageName: "Live Location",
    element: <Livelocation />,
  },
  {
    path: "/location/userlocation",
    pageName: "User Location",
    element: <Userlocation />,
  },
  {
    path: "/location/useralllocation/:user_id",
    pageName: "User All Location",
    element: <UserAllLocation />,
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
    path: "/qaform",
    pageName: "QAForm",
    element: <QAForm />,
  },
  {
    path: "/allQA",
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
  },
  {
    path: "/statistics",
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
    path: "/settings",
    pageName: "Settings",
    element: <Settings />,
  },
  {
    path: "*",
    element: <Error />,
  },
];

export const socket = io(process.env.REACT_APP_SOCKET_URL);

function App() {
  const { setAllRoutes, socketRef, currentMode } = useStateContext();
  const location = useLocation();

  useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
    libraries,
  });

  useEffect(() => {
    setAllRoutes(routes);
  }, []);

  function hasSidebarOrNavbar() {
    const pathname = location.pathname;
    if (pathname === "/" || pathname === "/auth/signup") {
      return false;
    } else {
      return true;
    }
  }

  return (
    <>
      <div
        style={{
          margin: 0,
          padding: 0,
          background: currentMode === "dark" ? "#000000" : "#ffffff",
        }}
      >
        <ToastContainer />
        {/* {appLoading && hasSidebarOrNavbar() &&
      <div style={{width: "100vw", height: "100vh", zIndex: 10000, position: "fixed", top: 0, left: 0}}>
        <Loader/>
      </div>
        } */}
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
              {routes.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
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
