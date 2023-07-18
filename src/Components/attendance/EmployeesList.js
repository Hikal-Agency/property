import { Box, MenuItem, Pagination, Select, Stack } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
// import axios from "axios";
import axios from "../../axoisConfig";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const EmployeesList = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const { currentMode, BACKEND_URL, pageState, setpageState, darkModeColors } =
    useStateContext();
  const [maxPage, setMaxPage] = useState(0);
  const [userData, setUserData] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const token = localStorage.getItem("auth-token");
  const navigate = useNavigate();

  console.log("selected day state: ", selectedDay);

  const handlePageChange = (event, value) => {
    setpageState({ ...pageState, page: value });
  };

  const handleDayFilter = (event) => {
    setSelectedDay(event.target.value);

    console.log("date range: ", event.target.value);

    // fetchUsers();
  };

  // const handleClick = (e, user_id) => {
  //   e.preventDefault();

  //   navigate(`/attendance/singleEmployee/${user_id}`);
  // };
  const handleClick = (e, user_id) => {
    e.preventDefault();
    const newWindow = window.open(
      `/attendance/singleEmployee/${user_id}`,
      "_blank"
    );

    if (newWindow) {
      newWindow.opener = null;
    }
  };

  // const fetchUsers = async () => {
  //   setLoading(true);

  //   if(selectedDay)

  //   try {
  //     const response = await axios.get(
  //       `${BACKEND_URL}/attendance?page=${pageState.page}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     );

  //     console.log("attendance: ", response);
  //     setUserData(response.data?.Record?.data);
  //     setMaxPage(response.data?.Record?.last_page);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchUsers = async () => {
    setLoading(true);

    console.log("date: ", selectedDay);

    try {
      const params = {
        page: pageState.page,
      };

      if (selectedDay) {
        // Check if selectedDay is 'today' or 'yesterday'
        if (selectedDay === "today") {
          params.date_range = [
            moment().subtract(1, "days").format("YYYY-MM-DD"),
            moment().add(1, "days").format("YYYY-MM-DD"),
          ].join(",");
        } else if (selectedDay === "yesterday") {
          params.date_range = [
            moment().subtract(2, "days").format("YYYY-MM-DD"),
            moment().format("YYYY-MM-DD"),
          ].join(",");
        }
      }

      const response = await axios.get(`${BACKEND_URL}/attendance`, {
        params,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageState.page, selectedDay]);

  return (
    <>
      <div className="min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="px-5">
              <Box sx={darkModeColors}>
                <div className="flex justify-end">
                  <Select
                    id="monthSelect"
                    size="small"
                    className="w-[100px]"
                    displayEmpty
                    value={selectedDay || "selected"}
                    onChange={handleDayFilter}
                  >
                    <MenuItem selected value="selected">
                      Select a day
                    </MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="yesterday">Yesterday</MenuItem>
                  </Select>
                </div>
              </Box>
              <div className="mt-5 md:mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-3">
                  {userData?.length > 0 ? (
                    userData.map((item, index) => {
                      let bgColor;
                      if (
                        item?.attendance_type?.toLowerCase() === "checkout" ||
                        item?.attendance_type?.toLowerCase() === "check-out"
                      ) {
                        bgColor = "bg-blue-500";
                      } else if (
                        item?.attendance_type?.toLowerCase() === "checkin" ||
                        item?.attendance_type?.toLowerCase() === "check in"
                      ) {
                        bgColor = "bg-green-500";
                      } else {
                        bgColor = "bg-red-500";
                      }
                      return (
                        <div
                          key={index}
                          className={`${
                            currentMode === "dark"
                              ? "bg-gray-900 text-white"
                              : "bg-gray-200 text-black"
                          }  rounded-md cursor-pointer`}
                          onClick={(e) => handleClick(e, item?.user_id)}
                        >
                          <div
                            className={`${bgColor}  py-2 px-4 rounded-md mb-3`}
                          >
                            <p className="text-sm text-white text-center">
                              {bgColor === "bg-blue-500"
                                ? "Checked-Out"
                                : bgColor === "bg-green-500"
                                ? "Checked-In"
                                : "Absent"}
                            </p>
                          </div>
                          <div className="flex justify-center items-center">
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
                                style={{ width: "64px", height: "64px" }}
                              />
                            )}
                          </div>
                          <div className="text-center mt-3">
                            <h4 className="font-bold text-lg capitalize">
                              {item?.userName}
                            </h4>
                            <p className="text-sm">{item?.position}</p>
                            <p className="text-sm">
                              {item?.department === 1
                                ? "Admin"
                                : item?.department === 3
                                ? "Manager"
                                : item?.department === 7
                                ? "Agent"
                                : "No department"}
                            </p>
                          </div>
                          <div
                            className={` ${bgColor} rounded-md p-2 mt-3 text-center`}
                          >
                            <p className="text-xs text-white">
                              {item?.check_datetime || "No Time"}
                            </p>
                          </div>
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
                        No data available.
                      </p>
                    </div>
                  )}
                </div>
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
                      backgroundColor: "red !important",
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
