import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import Footer from "../../Components/Footer/Footer";

import ADDQA from "../../Components/addQA/ADDQA";
import ListQa from "../../Components/addQA/ListQa";
import FilterQA from "../../Components/addQA/FilterQA";
import { Select, MenuItem } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const QAForm = () => {
  const {
    darkModeColors,
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
  } = useStateContext();
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
      <ToastContainer />
      <div className="flex min-h-screen">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
            <div className={`w-full `}>
              <div className="px-5">
                <Navbar />
                <h4
                  className={`font-semibold p-7 text-center text-2xl ${
                    currentMode === "dark" ? "text-white" : "text-dark"
                  }`}
                >
                  Add Questions And Relative Answers For Customer Support.
                </h4>
                <div
                  className={`${
                    currentMode === "dark"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200 text-black"
                  } p-5 rounded-md my-5 mb-10`}
                >
                  <Box
                    sx={{
                      ...darkModeColors,
                      "& .MuiTabs-indicator": {
                        height: "100%",
                        borderRadius: "5px",
                        backgroundColor: "#da1f26",
                      },
                      "& .Mui-selected": {
                        color: "white !important",
                        zIndex: "1",
                      },
                    }}
                    className={`w-full rounded-md overflow-hidden ${
                      currentMode === "dark" ? "bg-black" : "bg-white"
                    } `}
                  >
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      variant="standard"
                      // centered
                      className="w-full px-1 m-1"
                    >
                      <Tab label="Add QA" />
                      <Tab label="ALL QA" />
                      <Tab label="Filter QA"></Tab>
                    </Tabs>
                  </Box>
                  <div className="mt-3 pb-3">
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
                      <Select
                        id="user"
                        value={selectUserId?.id}
                        label="Select User"
                        onChange={handleUser}
                        size="medium"
                        className="w-full mb-4"
                        displayEmpty
                        required
                      >
                        <MenuItem value="" disabled>
                          Select User
                        </MenuItem>
                        {users && users.length > 0 ? (
                          users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                              {user.userName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="" disabled>
                            No Users
                          </MenuItem>
                        )}
                      </Select>

                      <h3
                        className={`font-semibold  text-center  ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        } mb-5`}
                      >
                        Data of :{" "}
                        <span className="text-main-red-color">
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
          <Footer />
        </div>
      </div>
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default QAForm;
