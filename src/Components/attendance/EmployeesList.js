import {
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { GrDownload } from "react-icons/gr";

import axios from "../../axoisConfig";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";

const EmployeesList = ({ user }) => {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    currentMode,
    BACKEND_URL,
    pageState,
    setpageState,
    darkModeColors,
    t,
    primaryColor,
    themeBgImg,
  } = useStateContext();
  const [maxPage, setMaxPage] = useState(0);
  const [userData, setUserData] = useState([]);

  const [selectedDay, setSelectedDay] = useState("today");
  // const [selectedDay, setSelectedDay] = useState("");

  const token = localStorage.getItem("auth-token");

  console.log("employess data:: ", userData);

  console.log("selected day state: ", selectedDay);

  const handlePageChange = (event, value) => {
    setpageState({ ...pageState, page: value });
  };

  const handleDayFilter = (event) => {
    setSelectedDay(event.target.value);

    console.log("date range: ", event.target.value);

    // fetchUsers();
  };

  const handleClick = (e, user_id) => {
    console.log("id: ", user_id);
    e.preventDefault();
    const newWindow = window.open(
      `/attendance/singleEmployee/${user_id}`,
      "_blank"
    );

    if (newWindow) {
      newWindow.opener = null;
    }
  };

  const fetchSalaryCalc = async () => {
    setDownloadLoading(true);

    toast.success("Report will be downloaded in a while.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    try {
      const response = await axios.get(`${BACKEND_URL}/attendance`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("salary Calc: ", response);

      setDownloadLoading(false);
    } catch (error) {
      setDownloadLoading(false);
      toast.error("Unable to download report.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const fetchUsers = async () => {
    setLoading(true);

    console.log("date: ", selectedDay);

    try {
      const params = {
        page: pageState.page,
        // agency_id: User?.agency,
      };

      if (selectedDay) {
        // Check if selectedDay is 'today' or 'yesterday'
        if (selectedDay === "today") {
          const currentDate = moment();
          // const startDate = moment(currentDate)
          //   .subtract(1, "days")
          //   .format("YYYY-MM-DD");
          const startDate = moment(currentDate).format("YYYY-MM-DD");
          const endDate = moment(currentDate)
            .add(1, "days")
            .format("YYYY-MM-DD");
          const dateRange = [startDate, endDate].join(",");
          console.log("date range: ", dateRange);

          params.date_range = dateRange;
        } else if (selectedDay === "yesterday") {
          params.date_range = [
            moment().subtract(1, "days").format("YYYY-MM-DD"),
            moment().format("YYYY-MM-DD"),
            // moment().add(1, "days").format("YYYY-MM-DD"),
          ].join(",");
        }
      }

      const response = await axios.get(`${BACKEND_URL}/attendance`, {
        params,
        // params: {
        //   date_range: "2023-07-01,2023-08-31",
        // },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("attendance: ", response);
      setUserData(response.data?.Record?.data);
      setMaxPage(response.data?.Record?.last_page);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Unable to fetch attendance.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageState.page, selectedDay]);

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 ${
              !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
            }`}
          >
            <Box sx={darkModeColors}>
              <div className="flex justify-end">
                <div className="mr-6">
                  <IconButton
                    className="bg-btn-primary"
                    onClick={fetchSalaryCalc}
                  >
                    {downloadLoading ? (
                      <CircularProgress />
                    ) : (
                      <GrDownload color="#fffff" />
                    )}
                  </IconButton>
                </div>
                <Select
                  id="monthSelect"
                  size="small"
                  className="w-[100px]"
                  displayEmpty
                  value={selectedDay || "Today"}
                  onChange={handleDayFilter}
                >
                  {/* <MenuItem selected value="selected">
                    Select a day
                  </MenuItem> */}
                  <MenuItem selected value="today">
                    {t("today")}
                  </MenuItem>
                  <MenuItem value="yesterday">{t("yesterday")}</MenuItem>
                </Select>
              </div>
            </Box>
            <div className="my-3 md:mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 pb-3">
                {userData?.length > 0 ? (
                  userData.map((item, index) => {
                    let bgColor;
                    if (
                      item?.attendance_type?.toLowerCase() === "out" ||
                      item?.attendance_type?.toLowerCase() === "check-out"
                    ) {
                      bgColor = "bg-red-600";
                    } else if (
                      item?.attendance_type?.toLowerCase() === "in" ||
                      item?.attendance_type?.toLowerCase() === "check-in"
                    ) {
                      bgColor = "bg-green-600";
                    } else {
                      bgColor = "bg-red-600";
                    }
                    return (
                      <div
                        key={index}
                        className={`${
                          !themeBgImg
                            ? currentMode === "dark"
                              ? "bg-[#1c1c1c] text-white"
                              : "bg-gray-200 text-black"
                            : currentMode === "dark"
                            ? "blur-bg-dark text-white"
                            : "blur-bg-light text-black"
                        }  rounded-xl shadow-sm card-hover cursor-pointer gap-y-2`}
                        onClick={(e) => handleClick(e, item?.user_id)}
                      >
                        <div
                          className={`${bgColor} p-1 rounded-t-xl flex justify-between text-sm text-white font-semibold`}
                        ></div>

                        {/* IMAGE  */}
                        <div className="flex justify-center items-center mt-2 p-1">
                          {item?.profile_picture ? (
                            <img
                              src={item?.profile_picture}
                              className="rounded-full cursor-pointer h-16 w-16 object-cover"
                              alt="profile image"
                            />
                          ) : (
                            <Avatar
                              alt="User"
                              variant="circular"
                              style={{ width: "55px", height: "55px" }}
                            />
                          )}
                        </div>

                        {/* USER DETAIL  */}
                        <div className="text-center my-1 p-1">
                          <h4 className="font-bold text-base capitalize">
                            {item?.userName}
                          </h4>
                          {/* <p className="text-sm">{item?.position}</p> */}
                          {/* <p className="text-sm">
                            {item?.department === 1
                              ? "Admin"
                              : item?.department === 3
                              ? "Manager"
                              : item?.department === 7
                              ? "Agent"
                              : "No department"}
                          </p> */}
                        </div>

                        <hr className="my-1" />

                        {/* ATTENDANCE TYPE  */}
                        <div
                          className={`p-2 text-center rounded-t-xl flex flex-col text-sm font-semibold`}
                        >
                          <p className="uppercase">{item?.attendance_type}</p>
                          <p className="my-1">{item?.check_datetime}</p>
                        </div>

                        {/* CHECK DATE TIME  */}
                        {/* <div className={` ${bgColor} rounded-md p-1 text-center`} >
                          <p className="text-xs text-white">
                            {item?.check_datetime || "No Time"}
                          </p>
                        </div> */}
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center">
                    <p
                      className={`text-lg ${
                        currentMode === "dark" ? "text-white" : "text-dark"
                      }`}
                    >
                      {t("no_data_available")}.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {userData?.length > 0 && (
              <Stack spacing={2} marginTop={2}>
                <Pagination
                  count={maxPage}
                  page={pageState.page}
                  // color={currentMode === "dark" ? "primary" : "secondary"}
                  onChange={handlePageChange}
                  style={{ margin: "auto" }}
                  sx={{
                    "& .Mui-selected": {
                      color: "white !important",
                      backgroundColor: `${primaryColor} !important`,
                      "&:hover": {
                        backgroundColor:
                          currentMode === "dark" ? "black" : "white",
                      },
                    },
                    "& .MuiPaginationItem-root": {
                      color: currentMode === "dark" ? "white" : "black",
                    },
                  }}
                />
              </Stack>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeesList;
