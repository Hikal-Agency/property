// import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";

import NotificationsListComponent from "../../Components/notificationsUi/NotificationsListComponent";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "../../axoisConfig";

import { BsCheck2All, BsFilterLeft, BsSearch } from "react-icons/bs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import usePermission from "../../utils/usePermission";

const NotificationsList = () => {
  const [loading, setloading] = useState(false);
  const { hasPermission } = usePermission();

  const [value, setValue] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [displayMarkBtn, setdisplayMarkBtn] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [filter, setFilter] = useState();
  const [filter_notifyAbout, setfilter_notifyType] = useState();
  const [filter_notifyDate, setfilter_notifyDate] = useState();
  const [filter_notifyDateValue, setfilter_notifyDateValue] = useState();
  console.log("filte_date: ", filter_notifyDate);
  const searchRef = useRef("");

  const {
    currentMode,
    BACKEND_URL,
    User,
    darkModeColors,
    formatNum,
    setUnreadNotifsCount,
    getNotifCounts,
    unreadNotifsCount,
  } = useStateContext();
  console.log("unread count ::: ", unreadNotifsCount);
  const token = localStorage.getItem("auth-token");
  const [userLoading, setUserLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUSer] = useState(null);

  const handleKeyUp = (e) => {
    console.log("handle key: ", e.target.value);
    e.preventDefault();
    // e.stopPropagation();
    if (searchRef.current.querySelector("input").value) {
      // if (e.key === "Enter" || e.keyCode === 13) {
      fetchUsers(e.target.value);
      // }
    }
  };
  const handleSearch = (e) => {
    console.log("handle search: ", e.target.value);

    // e.preventDefault();
    // e.stopPropagation();
    if (e.target.value === "") {
      fetchUsers();
    }
  };

  const fetchUsers = async (keyword = "", pageNo = 1) => {
    console.log("keyword: ", keyword);
    if (!keyword) {
      setUserLoading(true);
    }
    try {
      let url = "";
      if (keyword) {
        url = `${BACKEND_URL}/users?title=${keyword}`;
      } else {
        url = `${BACKEND_URL}/users?page=${pageNo}`;
      }
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Users: ", response);

      setUser(response?.data?.managers?.data);
      setUserLoading(false);
    } catch (error) {
      setUserLoading(false);
      console.log(error);
      toast.error("Unable to fetch users.", {
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

  const handleChange = (event, newValue) => {
    setValue(value === 0 ? 1 : 0);
  };

  const clearFilteration = () => {
    setfilter_notifyType("");
    setfilter_notifyDate("");
    setFilter("");
    setSelectedUSer("");

    setShowFilter(false);
    setFetch(true);
  };

  const handleFilter = (e, value) => {
    console.log("value: ", value);
    console.log("e: ", e.target.value);

    if (value === 0) {
      if (e.target.value === "0") {
        setFilter(null);
      } else {
        setFilter(e.target.value);
      }
    } else if (value === 1) {
      setfilter_notifyType(e.target.value);
    }

    // setShowFilter(false);
    setFetch(true);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
    fetchUsers();
  };

  const handleParentClick = (e) => {
    // e.target.closest("parent_filter");
    // console.log(e.target.closest("parent_filter") ? "something" : null);

    if (!e.target.closest(".parent_filter")) {
      setShowFilter(false);
    }
    // toggleFilter();
  };

  const UpdateReadStatus = async (e, id) => {
    e.preventDefault();
    const updated_data = new FormData();

    updated_data.append("user_id", User?.id);
    updated_data.append("isRead", 1);

    try {
      const UpdateReadStatus = await axios.post(
        `${BACKEND_URL}/bulknotification`,
        updated_data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("status updated::: ", UpdateReadStatus);
      getNotifCounts();
      toast.success("All notifications marked as read.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setUnreadNotifsCount(0);

      setFetch(true);
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Unable to update notification read status.", {
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

  return (
    <>
      <div className=" flex min-h-screen" onClick={handleParentClick}>
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full pl-3 ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            {showFilter && (
              <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-40 "></div>
            )}
              <div className="w-full flex items-center py-1">
                <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark"
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  Notification History
                </h1>
              </div>

              <div className="flex items-center justify-between">
                <Box
                  sx={{
                    ...darkModeColors,
                    "& .MuiTabs-indicator": {
                      // height: "100%",
                      backgroundColor: "#da1f26",
                    },
                    "& .Mui-selected": {
                      color:
                        currentMode === "dark" ? "white !important" : "black",
                      zIndex: "1",
                    },
                  }}
                  className={` rounded-md overflow-hidden ${
                    currentMode === "dark" ? "bg-black" : "bg-white"
                  } `}
                >
                  <Tabs
                    value={value}
                    onClick={handleChange}
                    variant="standard"
                  >
                    {/* <Tab
                      icon={
                        value === 0 ? (
                          <AiOutlineAppstore
                            size={22}
                            style={{
                              color:
                                currentMode === "dark"
                                  ? "#ffffff"
                                  : "#000000",
                            }}
                          />
                        ) : (
                          <AiOutlineTable
                            size={22}
                            style={{
                              color:
                                currentMode === "dark"
                                  ? "#ffffff"
                                  : "#000000",
                            }}
                          />
                        )
                      }
                    /> */}
                    <Tab
                      style={{
                        color: currentMode === "dark" ? "#ffffff" : "#000000",
                      }}
                      label="All"
                    />
                  </Tabs>
                </Box>

                <div className="flex items-center space-x-5 mr-5">
                  {displayMarkBtn ? (
                    <Tooltip
                      title="Mark All As Read"
                      arrow
                      placement="bottom"
                    >
                      <IconButton>
                        <BsCheck2All
                          size={20}
                          color={
                            currentMode === "dark" ? "#ffffff" : "#000000"
                          }
                          onClick={UpdateReadStatus}
                        />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {/* <TextField
                    placeholder="Search.."
                    sx={{
                      "& input": {
                        borderBottom: "2px solid #ffffff6e",
                      },
                    }}
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton sx={{ padding: 0 }}>
                            <BiSearch
                              size={17}
                              color={
                                currentMode === "dark" ? "#ffffff" : "#000000"
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  /> */}
                  <div className="parent_filter relative transform -translate-x-2/1">
                    <BsFilterLeft
                      className="mr-3 mt-2 cursor-pointer"
                      size={20}
                      color={currentMode === "dark" ? "#ffffff" : "#000000"}
                      onClick={toggleFilter}
                    />
                    {showFilter && (
                      <>
                        <div
                          className=" absolute  mt-2 "
                          style={{
                            zIndex: 5000,
                            transform: "translateX(-90%)",
                            border: "1px solid #ccc",
                            padding: "15px",
                            backgroundColor:
                              currentMode === "dark" ? "#333333" : "#ffffff",
                            width: "300px",
                            color:
                              currentMode === "dark" ? "#ffffff" : "#000000",
                          }}
                        >
                          {userLoading ? (
                            <div className="flex justify-center">
                              {" "}
                              <CircularProgress />
                            </div>
                          ) : (
                            <>
                              <h3 className="font-bold">Notification Type</h3>
                              <div>
                                <FormControl>
                                  <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="all"
                                    name="radio-buttons-group"
                                    value={filter}
                                    onChange={(e) => handleFilter(e, 0)}
                                  >
                                    <FormControlLabel
                                      value="all"
                                      control={<Radio />}
                                      label="All"
                                    />
                                    <FormControlLabel
                                      value="1"
                                      control={<Radio />}
                                      label="Read"
                                    />
                                    <FormControlLabel
                                      value="0"
                                      control={<Radio />}
                                      label="Unread"
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </div>

                              <h3 className="mt-5 font-bold">
                                Notifications About
                              </h3>
                              <div className="">
                                <FormControl>
                                  <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    // defaultValue="female"
                                    name="radio-buttons-group"
                                    value={filter_notifyAbout}
                                    onChange={(e) => handleFilter(e, 1)}
                                  >
                                    <FormControlLabel
                                      value="Lead"
                                      control={<Radio />}
                                      label="Lead Assignment"
                                    />
                                    <FormControlLabel
                                      value="Feedback"
                                      control={<Radio />}
                                      label="Feedback Updation"
                                    />
                                    <FormControlLabel
                                      value="Priority"
                                      control={<Radio />}
                                      label="Priority Updation"
                                    />
                                    <FormControlLabel
                                      value="Reminder"
                                      control={<Radio />}
                                      label="Follow-up Reminder"
                                    />
                                    <FormControlLabel
                                      value="Meeting"
                                      control={<Radio />}
                                      label="Schedule Meetings"
                                    />
                                    <FormControlLabel
                                      value="Billings"
                                      control={<Radio />}
                                      label="Billings And Payments"
                                    />
                                    <FormControlLabel
                                      value="Support"
                                      control={<Radio />}
                                      label="Support"
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </div>

                              <h3 className=" my-4 font-bold">
                                Notification Date
                              </h3>
                              <LocalizationProvider
                                dateAdapter={AdapterDayjs}
                              >
                                <DatePicker
                                  value={filter_notifyDateValue}
                                  views={["year", "month", "day"]}
                                  onChange={(newValue) => {
                                    setfilter_notifyDateValue(newValue);
                                    setfilter_notifyDate(
                                      formatNum(
                                        newValue?.$d?.getUTCFullYear()
                                      ) +
                                        "-" +
                                        formatNum(
                                          newValue?.$d?.getUTCMonth() + 1
                                        ) +
                                        "-" +
                                        formatNum(newValue?.$d?.getUTCDate())
                                    );
                                  }}
                                  format="yyyy-MM-dd"
                                  renderInput={(params) => (
                                    <TextField
                                      sx={{
                                        "& input": {
                                          color:
                                            currentMode === "dark"
                                              ? "white"
                                              : "black",
                                        },
                                        "&": {
                                          borderRadius: "4px",
                                          border:
                                            currentMode === "dark"
                                              ? "1px solid white"
                                              : "1px solid black",
                                        },
                                        "& .MuiSvgIcon-root": {
                                          color:
                                            currentMode === "dark"
                                              ? "white"
                                              : "black",
                                        },
                                      }}
                                      size="small"
                                      fullWidth
                                      label="Filter By Date"
                                      {...params}
                                      onKeyDown={(e) => e.preventDefault()}
                                      readOnly={true}
                                    />
                                  )}
                                  // minDate={dayjs().startOf("day").toDate()}
                                />
                              </LocalizationProvider>

                              {hasPermission("filter_user_notifs") && (
                                <div>
                                  <h3 className=" my-4 font-bold">
                                    Filter By User
                                  </h3>
                                  <FormControl
                                    className={`${
                                      currentMode === "dark"
                                        ? "text-white"
                                        : "text-black"
                                    }`}
                                    sx={{
                                      minWidth: "100%",
                                      // border: 1,
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Select
                                      id="feedback"
                                      value={selectedUser || "selected"}
                                      label="Filter By User"
                                      // onChange={(e) => handleFilter(e, 2)}
                                      onChange={(e) => {
                                        setSelectedUSer(e.target.value);
                                        setFetch(true);
                                      }}
                                      size="medium"
                                      className="w-full border border-gray-300 rounded "
                                      displayEmpty
                                      required
                                      sx={{
                                        border: "1px solid #000000",
                                        height: "40px",

                                        "& .MuiSelect-select": {
                                          fontSize: 11,
                                        },
                                      }}
                                    >
                                      <MenuItem selected value="selected">
                                        ---Select User----
                                      </MenuItem>
                                      <MenuItem
                                        onKeyDown={(e) => {
                                          e.stopPropagation();
                                          // e.preventDefault();
                                        }}
                                      >
                                        {/* <Box sx={darkModeColors}> */}
                                        <TextField
                                          placeholder="Search users"
                                          ref={searchRef}
                                          sx={{
                                            "& input": {
                                              border: "0",
                                            },
                                          }}
                                          variant="standard"
                                          // onKeyUp={handleKeyUp}
                                          // onInput={handleSearch}
                                          // onChange={handleSearch}
                                          InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <IconButton
                                                  sx={{ padding: 1 }}
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    const inputValue =
                                                      searchRef.current.querySelector(
                                                        "input"
                                                      ).value;
                                                    if (inputValue) {
                                                      fetchUsers(inputValue);
                                                    }
                                                  }}
                                                >
                                                  <BsSearch
                                                    className={`text-[#AAAAAA]`}
                                                    size={18}
                                                  />
                                                </IconButton>
                                              </InputAdornment>
                                            ),
                                          }}
                                          onClick={(event) => {
                                            event.stopPropagation();
                                          }}
                                        />
                                        {/* </Box> */}
                                      </MenuItem>

                                      {user?.length > 0 ? (
                                        user?.map((user) => (
                                          <MenuItem value={user?.id}>
                                            {user?.userName}
                                          </MenuItem>
                                        ))
                                      ) : (
                                        <h2 className="text-center">
                                          No Users
                                        </h2>
                                      )}
                                    </Select>
                                  </FormControl>
                                </div>
                              )}

                              <Button
                                // disabled={loading ? true : false}
                                type="submit"
                                className="disabled:opacity-50 disabled:cursor-not-allowed group   w-max  rounded-md border border-transparent  py-3 px-4 text-white text-md font-bold uppercase mt-3 bg-[#DA1F26]"
                                style={{
                                  marginTop: "20px",
                                  background: "#DA1F26",
                                  color: "#ffffff",
                                }}
                                onClick={clearFilteration}
                              >
                                <span>Clear All</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <NotificationsListComponent
                displayMarkBtn={displayMarkBtn}
                setdisplayMarkBtn={setdisplayMarkBtn}
                fetch={fetch}
                setFetch={setFetch}
                filter={filter}
                setFilter={setFilter}
                filter_notifyAbout={filter_notifyAbout}
                filter_notifyDate={filter_notifyDate}
                selectedUser={selectedUser}
              />
              
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationsList;
