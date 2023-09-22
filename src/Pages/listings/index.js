import { Button } from "@material-tailwind/react";
import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";

import {
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineTable,
  AiOutlineAppstore,
  AiOutlineFilter,
} from "react-icons/ai";
import SingleUser from "../../Components/Users/SingleUser";
import { useEffect, useState, useRef } from "react";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import UserTable from "../../Components/Users/UserTable";
import AddUserModel from "../../Components/addUser/AddUserModel";
import { FaBan, FaUnlock } from "react-icons/fa";
import DeleteUser from "../../Components/Users/DeleteUser";
import { BsPersonFillLock, BsSearch } from "react-icons/bs";
import UpdateUserPermissions from "../../Components/addUser/UpdateUserPermissions";
import { BiSearch } from "react-icons/bi";
import SecondaryListings from "../../Components/Listings/SecondaryListings";

const Listings = () => {
  const {
    currentMode,
    DataGridStyles,
    BACKEND_URL,
    pageState,
    setpageState,
    User,
    darkModeColors,
  } = useStateContext();
  const { hasPermission } = usePermission();

  const [user, setUser] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [value, setValue] = useState(0);
  const [model, setModel] = useState(false);
  const [userID, setUserId] = useState();
  const [userStatus, setUserStatus] = useState();
  const [username, setUserName] = useState();
  const [role, setUserRole] = useState();
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [openPermissionModel, setOpenPermissionModel] = useState(false);
  const token = localStorage.getItem("auth-token");

  const searchRef = useRef("");

  console.log("User: ", user);
  const handleChange = (event, newValue) => {
    setValue(value === 0 ? 1 : 0);
  };

  const handleKeyUp = (e) => {
    if (searchRef.current.querySelector("input").value) {
      if (e.key === "Enter" || e.keyCode === 13) {
        const token = localStorage.getItem("auth-token");
        // fetchUsers(token, e.target.value);
      }
    }
  };
  const handleSearch = (e) => {
    if (e.target.value === "") {
      setpageState((oldPageState) => ({ ...oldPageState, page: 1 }));
      const token = localStorage.getItem("auth-token");
      //   fetchUsers(token);
    }
  };

  const HandleOpenModel = () => {
    console.log("Model Open:");
    setModel(true);
  };

  const HandleModelClose = () => {
    console.log("Model Close:");

    setModel(false);
  };

  const handleDelete = (id, status, name) => {
    console.log("Delete id: ", id);
    setUserId(id);
    setUserStatus(status);
    setUserName(name);
    setOpenDeleteModel(true);
  };
  const handleDeleteModelClose = () => {
    setOpenDeleteModel(false);
  };

  //   useEffect(() => {
  //     setpageState((oldPageState) => ({ ...oldPageState, page: 1 }));
  //   }, []);

  //   useEffect(() => {
  //     if (searchRef.current.querySelector("input").value) {
  //       fetchUsers(
  //         token,
  //         searchRef.current.querySelector("input").value,
  //         pageState.page
  //       );
  //     } else {
  //       fetchUsers(token);
  //     }
  //   }, [pageState.page]);

  return (
    <>
      <div className="flex min-h-screen  ">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className={`w-full`}>
            <div className="pl-3 ">
              <div className="my-5 mb-10  ">
                {model && (
                  <AddUserModel
                    handleOpenModel={HandleOpenModel}
                    addUserModelClose={HandleModelClose}
                  />
                )}
                <div className="mt-3 flex justify-between items-center ">
                  <div className="flex">
                    <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                    <h1
                      className={`text-lg border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-red-600 font-bold border-red-600"
                      }`}
                    >
                      Secondary Listings{" "}
                      <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                        <span>{pageState?.total}</span>
                      </span>
                    </h1>
                  </div>

                  <div className="flex space-x-3 mr-4 items-center">
                    <AiOutlineFilter
                      color={currentMode == "dark" ? "#ffffff" : "#000000"}
                    />
                    <h2
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-dark"
                      }`}
                    >
                      All Filters (0)
                    </h2>
                  </div>
                </div>
                <div
                  className={`flex items-center justify-between px-5 mt-4 mr-4 ${
                    currentMode === "dark" ? "bg-black" : "bg-white"
                  }`}
                >
                  <Box
                    className={`p-5 border-t-1 overflow-hidden ${
                      currentMode === "dark" ? "bg-black" : "bg-white"
                    } `}
                  >
                    <Box sx={darkModeColors}>
                      {" "}
                      <TextField
                        className="w-[200px] "
                        label="Search"
                        placeholder="City, area, Project, Neighborhood"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BsSearch
                                color={
                                  currentMode == "dark" ? "#ffffff" : "#000000"
                                }
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FormControlLabel
                        control={<Switch />}
                        label="Solid Listings"
                        sx={{
                          marginLeft: "10px",

                          "& .MuiSwitch-track": {
                            backgroundColor:
                              currentMode === "dark" && "#9e9e9e !important",
                          },
                          "& .Mui-checked": {
                            color:
                              currentMode === "dark"
                                ? "green !important"
                                : "#B91C1C !important",
                          },
                          "& .MuiFormControlLabel-label ": {
                            color:
                              currentMode === "dark" && "#ffffff !important",
                            fontWeight: "semi-bold",
                          },
                        }}
                      />
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 150 }}
                      >
                        <TextField
                          id="property-type"
                          // value={PropertyType}
                          label="Baths"
                          // onChange={ChangePropertyType}
                          size="small"
                          className="w-full mb-5"
                          displayEmpty
                          sx={{
                            "&": {
                              marginBottom: "1.25rem !important",
                            },
                          }}
                          select
                        >
                          <MenuItem value="today" selected>
                            Exclude location
                          </MenuItem>
                          <MenuItem value="yesterday">
                            Exclude location
                          </MenuItem>
                        </TextField>
                      </FormControl>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 150 }}
                      >
                        <TextField
                          id="property-type"
                          // value={PropertyType}
                          label="Beds"
                          // onChange={ChangePropertyType}
                          size="small"
                          className="w-full mb-5"
                          displayEmpty
                          sx={{
                            "&": {
                              marginBottom: "1.25rem !important",
                            },
                          }}
                          select
                        >
                          <MenuItem value="today" selected>
                            Exclude location
                          </MenuItem>
                          <MenuItem value="yesterday">
                            Exclude location
                          </MenuItem>
                        </TextField>
                      </FormControl>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 150 }}
                      >
                        <TextField
                          id="property-type"
                          // value={PropertyType}
                          label="Sort By"
                          // onChange={ChangePropertyType}
                          size="small"
                          className="w-full mb-5"
                          displayEmpty
                          sx={{
                            "&": {
                              marginBottom: "1.25rem !important",
                            },
                          }}
                          select
                        >
                          <MenuItem value="today" selected>
                            Exclude location
                          </MenuItem>
                          <MenuItem value="yesterday">
                            Exclude location
                          </MenuItem>
                        </TextField>
                      </FormControl>
                    </Box>
                  </Box>

                  {/* <div className="flex space-x-3">
                    <AiOutlineFilter
                      color={currentMode == "dark" ? "#ffffff" : "#000000"}
                    />
                    <h2
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-dark"
                      }`}
                    >
                      All Filters (0)
                    </h2>
                  </div> */}
                </div>
                <SecondaryListings />

                {/* {openDeleteModel && (
                  <DeleteUser
                    UserModelOpen={handleDelete}
                    handleUserModelClose={handleDeleteModelClose}
                    UserData={userID}
                    UserStatus={userStatus}
                    UserName={username}
                    fetchUser={fetchUsers}
                  />
                )}
                {openPermissionModel && (
                  <UpdateUserPermissions
                    UserModelOpen={HandlePermissionModel}
                    handleUserModelClose={HandlePermissionClose}
                    UserData={userID}
                    UserName={username}
                    userRole={role}
                    fetchUser={fetchUsers}
                  />
                )} */}
              </div>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
};

export default Listings;
