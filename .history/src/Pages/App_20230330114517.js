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
// import Tickets from "./support";
import Clients from "./clients";
import Leaderboard from "./leaderboard";
import { useStateContext } from "../context/ContextProvider";
import ActivityLog from "./activity";

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
      element: <WhatsappMarketing/>,
      pageName: "Whatsapp Marketing",
    },
    { 
      path: "/location/livelocation", 
      pageName: "Live Location",
      element: <Livelocation /> 
    },
    { 
      path: "/users", 
      pageName: "Users",
      element: <ActivityLog /> 
    },
    { 
      path: "/activity", 
      pageName: "Activity Log",
      element: <Users /> 
    },
    { 
      path: "/offers", 
      pageName: "Offers",
      element: <Offers /> 
    },
    { 
      path: "/reports", 
      pageName: "Reports",
      element: <Reports /> 
    },
    // { 
    //   path: "/support", 
    //   element: <Tickets /> 
    // },
    { 
      path: "*", 
      element: <Error /> 
    },
  ];

function App() {
  const {setAllRoutes} = useStateContext();

  const router = createBrowserRouter(routes);
 useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
      libraries,
    });

    useEffect(() => {
      setAllRoutes(routes);
    }, []);

  return <RouterProvider router={router} />;
}

export default App;