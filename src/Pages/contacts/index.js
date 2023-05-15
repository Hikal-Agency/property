import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Loader from "../../Components/Loader";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Contacts = () => {
  const {
    currentMode,
    BACKEND_URL,
    User,
    setUser,
    setopenBackDrop,
    setIsUserSubscribed,
  } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("auth-token");
  const [loading, setloading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState("1");
  const [maxPage, setMaxPage] = useState(0);
  //eslint-disable-next-line
  const ContactData = [
    {
      name: "Mohamed Hikal",
      title: "Founder & CEO",
      phone: "+971568374678",
      email: "email@hikalagency",
    },
    {
      name: "Mohamed Hikal",
      title: "Founder & CEO",
      phone: "+971568374678",
      email: "email@hikalagency",
    },
    {
      name: "Mohamed Hikal",
      title: "Founder & CEO",
      phone: "+971568374678",
      email: "email@hikalagency",
    },
    {
      name: "Mohamed Hikal",
      title: "Founder & CEO",
      phone: "+971568374678",
      email: "email@hikalagency",
    },
    {
      name: "Mohamed Hikal",
      title: "Founder & CEO",
      phone: "+971568374678",
      email: "email@hikalagency",
    },
  ];

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

  const FetchProfile = async (token) => {
    await axios
      .get(`${BACKEND_URL}/dashboard?page=1`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        // console.log("dashboard data is");
        console.log("User data is");
        console.log(result.data);
        setIsUserSubscribed(checkUser(result.data.user));
        setUser(result.data.user);
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Sorry something went wrong. Kindly refresh the page.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // navigate("/", {
        //   state: {
        //     error: "Something Went Wrong! Please Try Again",
        //     continueURL: location.pathname,
        //   },
        // });
      });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    FetchContacts(token);
  };
  const FetchContacts = async (token) => {
    await axios
      .get(`${BACKEND_URL}/users?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("The data has contact", result.data);
        console.log(
          "The data has contact max page",
          result.data.managers.last_page
        );

        setContacts(result.data.managers.data);
        setMaxPage(result.data.managers.last_page);
        setloading(false);
      })
      .catch((err) => {
        toast.error("Sorry something went wrong. Kindly refresh the page.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // navigate("/", {
        //   state: {
        //     error: "Something Went Wrong! Please Try Again",
        //     continueURL: location.pathname,
        //   },
        // });
      });
  };
  useEffect(() => {
    setopenBackDrop(false);
    if (User?.uid && User?.loginId) {
      setloading(false);
      FetchProfile(token);
      FetchContacts(token);
    } else {
      if (token) {
        FetchProfile(token);
        FetchContacts(token);
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
  return (
    <>
      <ToastContainer />
      {/* <Head>
        <title>HIKAL CRM - Leaderboard</title>
        <meta name="description" content="Leaderboard - HIKAL CRM" />
      </Head> */}
      <div className="min-h-screen">
        {loading ? (
          <Loader />
        ) : (
            <div
              className={`w-full  ${
                currentMode === "dark" ? "bg-black" : "bg-white"
              }`}
            >
              <div className="px-5">
                <Navbar />

                <div className="mt-5 md:mt-2">
                  <h1
                    className={`font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    } text-xl ml-2 mb-3 auto-cols-max gap-x-3`}
                  >
                    Contacts
                    {/* <span className="px-5 py-3 rounded-md">Leaderboard</span> */}
                    {/* <span className="px-5 py-3 rounded-md">Call Log Board</span> */}
                  </h1>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
                    {contacts?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={`${
                            currentMode === "dark"
                              ? "bg-gray-900 text-white"
                              : "bg-gray-200 text-black"
                          } p-3 rounded-md `}
                        >
                          <img
                            src="/favicon.png"
                            className="rounded-md cursor-pointer h-[50px] w-[50px] object-cover"
                            alt=""
                          />
                          <div className="mt-2 space-y-1 overflow-hidden">
                            <h1 className="font-bold">{item.userName}</h1>
                            <p className="text-sm">{item.position}</p>
                            <p className="text-sm font-semibold text-red-600">
                              {item.userName}
                            </p>
                            <p className="text-sm">{item.userPhone}</p>
                            <p className="text-sm">{item.userEmail}</p>
                            {item?.status === 1 ? (
                              <p className="text-sm text-red-600">Deactive</p>
                            ) : (
                              <p className="text-sm text-green-600">Active</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Stack spacing={2} marginTop={2}>
                <Pagination
                  count={maxPage}
                  color="error"
                  onChange={handlePageChange}
                  style={{ margin: "auto" }}
                />
              </Stack>
            </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default Contacts;
