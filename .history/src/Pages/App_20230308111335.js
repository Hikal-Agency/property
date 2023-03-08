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
import Leaderboard from "./leaderboard";
import WhatsappDashboard from "./whatsapp-marketing/Dashboard";
import Device from "./whatsapp-marketing/Device";
import Messages from "./whatsapp-marketing/messages";
import Payments from "./whatsapp-marketing/payments";
import Transactions from "./whatsapp-marketing/transactions";
import Livelocation from "./location/livelocation";
import ChangePassword from "./auth/ChangePassword";
import Users from "./users";

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

    { path: "/timeline/:id", element: <TimelinePage /> },
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
      path: "/profile",
      element: <ProfilePage />,
    },
    {
      path: "/leaderboard",
      element: <Leaderboard />,
    },
    { 
      path: "/whatsapp-marketing/dashboard",
      element: <WhatsappDashboard /> 
    },
    { 
      path: "/whatsapp-marketing/device",
      element: <Device /> 
    },
    { 
      path: "/whatsapp-marketing/messages", 
      element: <Messages /> 
    },
    { 
      path: "/whatsapp-marketing/payments", 
      element: <Payments /> 
    },
    { 
      path: "/whatsapp-marketing/transactions", 
      element: <Transactions /> 
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
      path: "*", 
      element: <Error /> 
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
