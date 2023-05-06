// import { Backdrop, Button, CircularProgress, TextField } from "@mui/material";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import Meetings from "./meetings";
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
import { io } from "socket.io-client";

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
    path: "/hotleads/:lead_type",
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
    path: "/transfferedleads",
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
    path: "/meetings",
    element: <Meetings />,
    pageName: "Meetings",
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
    path: "/support",
    pageName: "Support",
    element: <Tickets />,
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
    path: "*",
    element: <Error />,
  },
];
// =======
//     {
//       path: "/",
//       element: <Home />,
//       pageName: "Home",
//     },
//     {
//       path: "/auth/signup",
//       pageName: "Sign Up",
//       element: <Signup />,
//     },
//     {
//       path: "/change-password",
//       element: <ChangePassword />,
//       pageName: "Change Password",
//     },
//     {
//       path: "/dashboard",
//       element: <Dashboard />,
//       pageName: "Dashboard",
//     },
//     {
//       path: "/addlead",
//       element: <AddLead />,
//       pageName: "Add Lead",
//     },
//     {
//       path: "/unassigned/:lead_type",
//       element: <AllUnassignedLeads />,
//       pageName: "Unassigned Leads",
//     },
//     {
//       path: "/hotleads/:lead_type",
//       element: <AllHotLeads />,
//       pageName: "Hot Leads",
//     },
//     {
//       path: "/personalleads/:lead_type",
//       element: <PersonaLeads />,
//       pageName: "Personal Leads",
//     },
//     {
//       path: "/thirdpartyleads/:lead_type",
//       element: <ThirdPartyLeads />,
//       pageName: "Third-party Leads",
//     },
//     {
//       path: "/coldleads/:lead_type",
//       element: <ColdLeads />,
//       pageName: "Cold Leads",
//     },
//     {
//       path: "/transfferedleads",
//       element: <TransferredLeads />,
//       pageName: "Transferred Leads",
//     },
//     {
//       path: "/closedeals",
//       pageName: "Close Deals",
//       element: <ClosedealsPage />,
//     },

//     {
//       path: "/timeline/:id",
//       element: <TimelinePage />,
//       pageName: "Timeline",
//     },
//     {
//       path: "/leadnotes",
//       element: <LeadNotesPage />,
//       pageName: "Lead Notes",
//     },
//     {
//       path: "/leadnotes/:id",
//       element: <SingleLeadNote />,
//       pageName: "Lead Notes",
//     },
//     {
//       path: "/meetings",
//       element: <Meetings />,
//       pageName: "Meetings",
//     },
//     {
//       path: "/booked",
//       element: <Booked />,
//       pageName: "Booked",
//     },
//     {
//       path: "/contacts",
//       element: <Contacts />,
//       pageName: "Contacts",
//     },
//     {
//       path: "/clients",
//       element: <Clients />,
//       pageName: "Clients",
//     },
//     {
//       path: "/leaderboard",
//       element: <Leaderboard />,
//       pageName: "Leaderboard",
//     },
//     {
//       path: "/profile",
//       element: <ProfilePage />,
//       pageName: "Profile",
//     },
//     {
//       path: "/whatsapp-marketing/:page",
//       element: <WhatsappMarketing/>,
//       pageName: "Whatsapp Marketing",
//     },
//     {
//       path: "/location/livelocation",
//       pageName: "Live Location",
//       element: <Livelocation />
//     },
//     {
//       path: "/users",
//       pageName: "Users",
//       element: <Users />
//     },
//     {
//       path: "/activity",
//       pageName: "Activity Log",
//       element: <ActivityLog />
//     },
//     {
//       path: "/offers",
//       pageName: "Offers",
//       element: <Offers />
//     },
//     {
//       path: "/reports",
//       pageName: "Reports",
//       element: <Reports />
//     },
//     // {
//     //   path: "/support",
//     //   element: <Tickets />
//     // },
//     {
//       path: "*",
//       element: <Error />
//     },
//   ];
// >>>>>>> Stashed changes

function App() {
  const { setAllRoutes } = useStateContext();
  const router = createBrowserRouter(routes);
  const { setSocket } = useStateContext();

  useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
    libraries,
  });

  useEffect(() => {
    setAllRoutes(routes);

    const socketURL = "http://localhost:5000";
    const socket = io(socketURL);
    setSocket(socket);
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
