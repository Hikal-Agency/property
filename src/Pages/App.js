import { useEffect, useState } from "react";
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
import AdminSignup from "./auth/adminSignup";
import Loader from "../Components/Loader";
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";

import axios from 'axios';

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
    path: "/adminAuth/signup",
    pageName: "Admin Sign Up",
    element: <AdminSignup />,
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
    path: "/lead/:lid",
    element: <SingleLeadPage />,
    page: "Lead",
  },
  {
    path: "/appointments/meetings",
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
  const { setAllRoutes, setSocket, currentMode, setUser, setopenBackDrop, setIsUserSubscribed,  appLoading, User, setAppLoading, setSalesPerson, setManagers, BACKEND_URL  } = useStateContext();
  const location = useLocation();

  const navigate = useNavigate();

  useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
    libraries,
  });

   async function setSalesPersons(urls) {
    const token = localStorage.getItem("auth-token");
    const requests = urls.map((url) =>
      axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
    );
    const responses = await Promise.all(requests);
    const data = {};
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      if (response.data?.team[0]?.isParent) {
        const name = `manager-${response.data.team[0].isParent}`;
        data[name] = response.data.team;
      }
    }
    setSalesPerson(data);
    setAppLoading(false);
  }

  const getAllLeadsMembers = (user) => {
    const token = localStorage.getItem("auth-token");
    if (user?.position !== "Founder & CEO") {
      axios
        .get(`${BACKEND_URL}/teamMembers/${user?.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((result) => {
          const agents = result.data?.team;
          setSalesPerson({ [`manager-${user?.id}`]: agents });
        });
    } else {
      axios.get(`${BACKEND_URL}/managers`).then((result) => {
        console.log("manager response is");
        console.log(result);
        const managers = result?.data?.managers;
        setManagers(managers || []);

        const urls = managers?.map((manager) => {
          return `${BACKEND_URL}/teamMembers/${manager?.id}`;
        });

        setSalesPersons(urls || []);
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (User?.id && User?.loginId) {
      FetchProfile(token);
    } else {
      if (token) {
        FetchProfile(token);
      } else {
        navigate("/", {
          state: {
            error: "Please login to proceed.",
            continueURL: location.pathname,
          },
        });
      }
    }

    // eslint-disable-next-line
  }, []);

   const checkUser = (user) => {
    const expiry = new Date(user?.expiry_date).getTime();
    const now = new Date().getTime();

    const isExpired = now > expiry;

    if (user?.role === 1) {
      return true;
    } else {
      return (
        isExpired === false &&
        user?.package_name?.length > 0 &&
        user?.package_name !== "unsubscribed"
      );
    }
  };

  useEffect(() => {
    if (!(User?.uid && User?.loginId)) {
      const token = localStorage.getItem("auth-token");
      if (token) {
        const user = localStorage.getItem("user");
        setUser(JSON.parse(user));
        setIsUserSubscribed(checkUser(JSON.parse(user)));
      } else {
        navigate("/", {
          state: {
            error: "Something Went Wrong! Please Try Again",
            continueURL: location.pathname,
          },
        });
      }
    }
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    setAllRoutes(routes);

    const socketURL = process.env.REACT_APP_SOCKET_URL;
    const socket = io(socketURL);
    setSocket(socket);

  }, []);

    const FetchProfile = async (token) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      // If user data is stored in local storage, parse and set it in state
      setUser(JSON.parse(storedUser));
      setIsUserSubscribed(JSON.parse(storedUser));
      console.log("User from navbar", User);
    } else {
      await axios
        .get(`${BACKEND_URL}/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((result) => {
          console.log("User data is");
          console.log(result.data);

          // Create a new object with only the specific fields you want to store
          const user = {
            addedBy: result.data.user[0].addedBy,
            addedFor: result.data.user[0].addedFor,
            agency: result.data.user[0].agency,
            created_at: result.data.user[0].created_at,
            creationDate: result.data.user[0].creationDate,
            displayImg: result.data.user[0].profile_picture,
            expiry_date: result.data.user[0].expiry_date,
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
            userName: result.data.user[0].userName,
            userType: result.data.user[0].userType,
          };

          setUser(user);
          setIsUserSubscribed(user);

          console.log("Localstorage: ", user);

          // Save user data to local storage
          localStorage.setItem("user", JSON.stringify(user));
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) {
            setopenBackDrop(false);
            // setloading(false);

            localStorage.removeItem("auth-token");
            localStorage.removeItem("user");
            localStorage.removeItem("leadsData");
            navigate("/", {
              state: {
                error: "Please login to proceed.",
                continueURL: location.pathname,
              },
            });
            return;
          }
          toast.error("Sorry something went wrong. Kindly refresh the page.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    }
  };

  useEffect(() => {
    if(User?.id) {
      getAllLeadsMembers(User);
    }
  }, [User]);

  function hasSidebarOrNavbar() {
    const pathname = location.pathname;
    if (pathname === "/" || pathname === "/auth/signup") {
      return false;
    } else {
      return true;
    }
  }

  if(appLoading && hasSidebarOrNavbar()) {
    return <Loader/>;
  } else {

  return (
    <>
      <div className="flex" style={{ width: "99vw" }}>
        {hasSidebarOrNavbar() && <Sidebarmui />}
        <div
          className={`w-[99%] overflow-x-hidden ${
            hasSidebarOrNavbar() ? "pt-20" : "pt-0"
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
                <Route key={index} path={route.path} element={route.element} />
              );
            })}
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  );
          }
}

export default App;
