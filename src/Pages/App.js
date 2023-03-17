// import { Backdrop, Button, CircularProgress, TextField } from "@mui/material";
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
import Leaderboard from "./leaderboard";

const libraries = ["places"];

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/auth/signup",
      element: <Signup />,
    },
    {
      path: "/change-password",
      element: <ChangePassword />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/addlead",
      element: <AddLead />,
    },
    {
      path: "/unassigned/:lead_type",
      element: <AllUnassignedLeads />,
    },
    {
      path: "/hotleads/:lead_type",
      element: <AllHotLeads />,
    },
    {
      path: "/personalleads/:lead_type",
      element: <PersonaLeads />,
    },
    {
      path: "/thirdpartyleads/:lead_type",
      element: <ThirdPartyLeads />,
    },
    {
      path: "/coldleads/:lead_type",
      element: <ColdLeads />,
    },
    {
      path: "/transfferedleads",
      element: <TransferredLeads />,
    },
    {
      path: "/closedeals",
      element: <ClosedealsPage />,
    },
    { 
      path: "/timeline/:id", 
      element: <TimelinePage /> 
    },
    {
      path: "/leadnotes",
      element: <LeadNotesPage />,
    },
    {
      path: "/leadnotes",
      element: <LeadNotesPage />,
    },
    {
      path: "/leadnotes/:id",
      element: <SingleLeadNote />,
    },
    {
      path: "/meetings",
      element: <Meetings />,
    },
    {
      path: "/booked",
      element: <Booked />,
    },
    {
      path: "/contacts",
      element: <Contacts />,
    },
    {
      path: "/clients",
      element: <Clients />,
    },
    {
      path: "/leaderboard",
      element: <Leaderboard />,
    },
    {
      path: "/profile",
      element: <ProfilePage />,
    },
    { 
      path: "/whatsapp-marketing/:page",
      element: <WhatsappMarketing/>
    },
    { 
      path: "/location/livelocation", 
      element: <Livelocation /> 
    },
    { 
      path: "/users", 
      element: <Users /> 
    },
    { 
      path: "/offers", 
      element: <Offers /> 
    },
    { 
      path: "/reports", 
      element: <Reports /> 
    },
    { 
      path: "/support", 
      element: <Tickets /> 
    },
    { 
      path: "*", 
      element: <Error /> 
    },
  ]);
 useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
      libraries,
    });

  return <RouterProvider router={router} />;
}

export default App;
