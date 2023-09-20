import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BookedDeals from "../../Components/Leads/BookedDeals";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import MessagesComponent from "../../Components/whatsapp-marketing/MessageComponent";
import usePermission from "../../utils/usePermission";
import {
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
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { BsFilterLeft, BsSearch } from "react-icons/bs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import moment from "moment";

const MessagesDashboar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setloading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState();
  const [date_filter, setDateFilter] = useState();
  const [date, setDate] = useState();
  const [sender_id_filter, setSenderIDFitler] = useState();
  const { currentMode, setopenBackDrop, BACKEND_URL, pageState, formatNum } =
    useStateContext();
  const { hasPermission } = usePermission();
  const token = localStorage.getItem("auth-token");
  const searchRef = useRef("");
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUSer] = useState(null);
  const [fetch, setFetch] = useState(false);

  const clearFilteration = () => {
    setDateFilter("");
    setDate("");
    setFilter("");
    setSelectedUSer("");
    setShowFilter(false);
    setSenderIDFitler("");
    setFetch(true);
  };

  const handleParentClick = (e) => {
    if (!e.target.closest(".parent_filter")) {
      setShowFilter(false);
    }
  };

  const handleFilter = (e, value) => {
    if (value === 0) {
      setFilter(e.target.value);
    }
  };

  const campaignCount = [
    {
      text: "Sent SMS",
      count: pageState?.sentSMS,
    },
    {
      text: "SMS Campaign",
      count: pageState?.smsCount,
    },
    {
      text: "Sent Whatsapp",
      count: pageState?.sentWhatsapp,
    },
    {
      text: "Whatsapp Campaign",
      count: pageState?.whatsappCount,
    },
    {
      text: "Credits Used",
      count: pageState?.credit_used,
    },
  ];

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

  const toggleFilter = () => {
    setShowFilter(!showFilter);
    fetchUsers();
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

  const senderID = ["AD-HIKAL"];

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
  }, []);

  return (
    <>
      <div className="flex min-h-screen" onClick={handleParentClick}>
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full pl-3 ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="w-full flex items-center justify-between py-1">
              <div className="flex items-center">
                <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Campaigns Dashboard{" "}
                  <span className="bg-main-red-color text-white px-3 py-1 rounded-sm my-auto">
                    {pageState?.total}
                  </span>
                </h1>
              </div>
              <div
                className="parent_filter relative transform -translate-x-2/1"
                style={{ zIndex: 100 }}
              >
                <BsFilterLeft
                  className="mr-3 mt-2 cursor-pointer"
                  size={20}
                  color={currentMode === "dark" ? "#ffffff" : "#000000"}
                  onClick={toggleFilter}
                />
                {showFilter && (
                  <>
                    <div
                      className=" absolute  mt-2  rounded-md "
                      style={{
                        zIndex: 500,
                        transform: "translateX(-95%)",
                        border: "1px solid #ccc",
                        padding: "15px",
                        backgroundColor:
                          currentMode === "dark" ? "#333333" : "#ffffff",
                        width: "300px",
                        color: currentMode === "dark" ? "#ffffff" : "#000000",
                      }}
                    >
                      {userLoading ? (
                        <div className="flex justify-center">
                          {" "}
                          <CircularProgress />
                        </div>
                      ) : (
                        <>
                          <h3 className="font-bold">Messages Type</h3>
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
                                  value="sms"
                                  control={<Radio />}
                                  label="SMS"
                                />
                                <FormControlLabel
                                  value="whatsapp"
                                  control={<Radio />}
                                  label="Whatsapp"
                                />
                              </RadioGroup>
                            </FormControl>
                          </div>

                          <h3 className=" my-4 font-bold">Message Date</h3>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              value={date}
                              views={["year", "month", "day"]}
                              onChange={(newValue) => {
                                const formattedDate = moment(
                                  newValue?.$d
                                ).format("YYYY-MM-DD");
                                setDate(formattedDate);

                                // date range
                                const startDate = moment(newValue?.$d).format(
                                  "YYYY-MM-DD"
                                );
                                const endDate = moment(newValue?.$d)
                                  .add(1, "days")
                                  .format("YYYY-MM-DD");

                                const dateRange = [startDate, endDate].join(
                                  ","
                                );
                                setDateFilter(dateRange);
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

                          <div>
                            <h3 className=" my-4 font-bold">Sender ID</h3>
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
                                value={sender_id_filter || "selected"}
                                label="Filter By User"
                                onChange={(e) => {
                                  setSenderIDFitler(e.target.value);
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
                                  ---Select Sender ID----
                                </MenuItem>

                                {senderID?.length > 0 ? (
                                  senderID?.map((senderID) => (
                                    <MenuItem value={senderID}>
                                      {senderID}
                                    </MenuItem>
                                  ))
                                ) : (
                                  <h2 className="text-center">No ID</h2>
                                )}
                              </Select>
                            </FormControl>
                          </div>

                          {/* {hasPermission("filter_user_notifs") && ( */}
                          <div>
                            <h3 className=" my-4 font-bold">Filter By User</h3>
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
                                  e.stopPropagation();
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
                                  <h2 className="text-center">No Users</h2>
                                )}
                              </Select>
                            </FormControl>
                          </div>
                          {/* )} */}

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

            <div className="w-full my-4 mb-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-6">
              {campaignCount && campaignCount?.length > 0
                ? campaignCount?.map((campaign, index) => (
                    <div
                      className={`p-6  rounded-md ${
                        currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]"
                      }  flex flex-col justify-center items-center w-64`}
                      key={index}
                    >
                      <h2 className="text-2xl text-center font-bold text-[#DA1F26] mb-2 break-words w-full">
                        {campaign?.count}
                      </h2>
                      <p
                        className={`${
                          currentMode === "dark" ? "text-white" : "text-dark"
                        }`}
                      >
                        {campaign?.text}
                      </p>
                    </div>
                  ))
                : null}

              {/* <div>1</div>
              <div>1</div>
              <div>1</div> */}
            </div>

            <MessagesComponent
              filter={filter}
              date_filter={date_filter}
              sender_id_filter={sender_id_filter}
              fetch={fetch}
              selectedUser={selectedUser}
              setFetch={setFetch}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default MessagesDashboar;
