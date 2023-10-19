import { Box, InputLabel } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";

import ADDQA from "../../Components/addQA/ADDQA";
import ListQa from "../../Components/addQA/ListQa";
import FilterQA from "../../Components/addQA/FilterQA";
import { Select, MenuItem } from "@mui/material";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";

const QAForm = () => {
  const { darkModeColors, currentMode, themeBgImg, setopenBackDrop, BACKEND_URL, t} =
    useStateContext();

  const [value, setValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectUserId, setSelectedUserId] = useState({});
  const handleChange = (event, newValue) => {
    console.log("Tab: ", newValue);
    setValue(newValue);
  };

  const [tabValue, setTabValue] = useState(0);
  const [loading, setloading] = useState(false);

  const handleUser = (event) => {
    const selected_user = users.find((user) => user.id === event.target.value);
    setSelectedUserId(selected_user);
    console.log("Selected User: ", selected_user);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Users: ", response);
      setUsers(response?.data?.managers?.data);
    } catch (error) {
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

  useEffect(() => {
    if (value === 2) {
      console.log("Tab 2");
      fetchUsers();
    }
  }, [value]);

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      
      <div className="flex min-h-screen">
        <div
          className={`w-full p-4 ${
            !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
          }`}
        >
          <div className="w-full flex items-center pb-3">
            <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
            <h1
              className={`text-lg font-semibold ${
                currentMode === "dark"
                  ? "text-white"
                  : "text-black"
              }`}
            >
              {t("qa_page_headline")}
            </h1>
          </div>

          <div
            className={`${
              !themeBgImg ? (currentMode === "dark"
                ? "bg-[#1c1c1c] text-white"
                : "bg-[#EEEEEE] text-black")
                : (currentMode === "dark"
                ? "blur-bg-dark text-white"
                : "blur-bg-light text-black")
            } p-4 rounded-xl shadow-sm my-5`}
          >
            <Box
              sx={{
                ...darkModeColors,
                "& .MuiTabs-indicator": {
                  height: "100%",
                  borderRadius: "5px",
                },
                "& .Mui-selected": {
                  color: "white !important",
                  zIndex: "1",
                },
              }}
              className={`w-full rounded-xl overflow-hidden `}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="standard"
                // centered
                className="w-full m-1"
              >
                <Tab label={t("add_qa")} />
                <Tab label={t("all_qa")} />
                <Tab label={t("filter_qa")}></Tab>
              </Tabs>
            </Box>
            <div className="mt-3 px-1 pb-3">
              <TabPanel value={value} index={0}>
                <ADDQA
                  isLoading={loading}
                  tabValue={tabValue}
                  setTabValue={setTabValue}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <ListQa
                  isLoading={loading}
                  tabValue={tabValue}
                  setTabValue={setTabValue}
                />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Box sx={darkModeColors}>
                  <InputLabel>Select User</InputLabel>
                  <Select
                    id="user"
                    value={selectUserId?.id}
                    label={t("select_user")}
                    onChange={handleUser}
                    size="medium"
                    className="w-full mb-4"
                    displayEmpty
                    required
                  >
                    <MenuItem value="" disabled>
                      {t("select_user")}
                    </MenuItem>
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.userName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        {t("no_users")}
                      </MenuItem>
                    )}
                  </Select>
                </Box>

                <h3
                  className={`font-semibold  text-center  ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  } mb-5`}
                >
                  {t("data_of")} :{" "}
                  <span className="text-primary">
                    {" "}
                    {selectUserId?.userName || "No User"}
                  </span>
                </h3>

                <FilterQA
                  isLoading={loading}
                  tabValue={tabValue}
                  setTabValue={setTabValue}
                  user={selectUserId?.id}
                />
              </TabPanel>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default QAForm;
