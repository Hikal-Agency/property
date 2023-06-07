import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { useNavigate, useLocation, useParams } from "react-router-dom";
// import axios from "axios";
import axios from "../../axoisConfig";
import { toast, ToastContainer } from "react-toastify";

const AgencyUsers = () => {
  const { currentMode, BACKEND_URL, User, setUser, setopenBackDrop } =
    useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("auth-token");
  const [loading, setloading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState("1");
  const [maxPage, setMaxPage] = useState(0);
  const { client_id } = useParams();
  //   const client_id = location.pathname.split("/")[2];

  console.log("id from URL:", client_id);
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

  const FetchClient = async (token) => {
    await axios
      .get(`${BACKEND_URL}/clients?id=1`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("client data is");
        console.log(result.data);
        setUser(result.data.user);
        setloading(false);
      })
      .catch((err) => {
        // console.log(err);
        navigate("/", {
          state: {
            error: "Something Went Wrong! Please Try Again",
            continueURL: location.pathname,
          },
        });
      });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    FetchContacts(token);
  };
  // const FetchContacts = async (token) => {
  //   await axios
  //     .get(`${BACKEND_URL}/agencyusers/${client_id}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token,
  //       },
  //     })
  //     .then((result) => {
  //       console.log("agency users ", result.data);
  //       console.log("agency-users ", result.data["agency-users"].data);
  //       // console.log(
  //       //   "The data has contact max page",
  //       //   result.data.managers.last_page
  //       // );

  //       setContacts(result?.data["agency-users"]?.data);
  //       setMaxPage(result.data.managers?.last_page);
  //       setloading(false);
  //     })
  //     .catch((err) => {
  //       // navigate("/", {
  //       //   state: {
  //       //     error: "Something Went Wrong! Please Try Again",
  //       //     continueURL: location.pathname,
  //       //   },
  //       // });

  //       console.error("Agency User Error: ", err);
  //       toast.error("Sorry something went wrong.", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //     });
  // };
  const FetchContacts = async (token) => {
    const maxRetries = 8;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const result = await axios.get(
          `${BACKEND_URL}/agencyusers/${client_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        console.log("agency users ", result.data);
        console.log("agency-users ", result.data["agency-users"].data);

        setContacts(result?.data["agency-users"]?.data);
        setMaxPage(result.data.managers?.last_page);
        setloading(false);

        return; // exit the function if successful
      } catch (err) {
        if (err.response && err.response.status === 429) {
          // retry after waiting for a certain amount of time
          const waitTime = (retries + 1) * 1000;
          console.warn(`Received 429 error. Retrying after ${waitTime}ms.`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          retries++;
        } else {
          console.error("Agency User Error: ", err);
          toast.error("Sorry something went wrong.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          break; // exit the loop if the error is not a 429 error
        }
      }
    }

    // retries have been exhausted without success
    console.error(`Agency User Error: Failed after ${maxRetries} retries`);
    toast.error("Sorry something went wrong.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    setopenBackDrop(false);
    if (User?.uid && User?.loginId) {
      setloading(true);
      //FetchClient(token);
      FetchContacts(token);
    } else {
      if (token) {
        // FetchClient(token);
        FetchContacts(token);
        console.log("Contacting : ");
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
            <div className="pl-3">
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
                            {item?.userName}
                          </p>
                          <p className="text-sm">{item?.userPhone}</p>
                          <p className="text-sm">{item.userEmail}</p>
                          {item?.status === 1 ? (
                            <p className="text-sm text-green-600">Active</p>
                          ) : (
                            <p className="text-sm text-red-600">Deactive</p>
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
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default AgencyUsers;
