import { Button } from "@material-tailwind/react";
import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";

import {
  Box,
  IconButton,
  InputAdornment,
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
} from "react-icons/ai";
import SingleUser from "../../Components/Users/SingleUser";
import { useEffect, useState, useRef } from "react";
// import axios from "axios";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import UserTable from "../../Components/Users/UserTable";
import AddUserModel from "../../Components/addUser/AddUserModel";
import { FaBan, FaUnlock } from "react-icons/fa";
import DeleteUser from "../../Components/Users/DeleteUser";
import { BsPersonFillLock } from "react-icons/bs";
import UpdateUserPermissions from "../../Components/addUser/UpdateUserPermissions";
import { BiSearch } from "react-icons/bi";

const Users = () => {
  const {
    currentMode,
    DataGridStyles,
    BACKEND_URL,
    pageState,
    setpageState,
    User,
    darkModeColors,
  } = useStateContext();
  const {hasPermission} = usePermission();

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
        fetchUsers(token, e.target.value);
      }
    }
  };
  const handleSearch = (e) => {
    if (e.target.value === "") {
      setpageState((oldPageState) => ({ ...oldPageState, page: 1 }));
      const token = localStorage.getItem("auth-token");
      fetchUsers(token);
    }
  };

  const HandleOpenModel = () => {
    console.log("Model Open:");
    setModel(true);
  };

  const HandlePermissionModel = (id, status, name, role) => {
    console.log("Permission Model Open:", id, status, name, role);
    setUserId(id);
    setUserName(name);
    setUserRole(role);
    setOpenPermissionModel(true);
  };

  const HandlePermissionClose = () => {
    console.log("Permission Model close:");
    setOpenPermissionModel(false);
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

  const fetchUsers = async (token, keyword = "", pageNo = 1) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));
    try {
      let url = "";
      if (keyword) {
        url = `${BACKEND_URL}/users?page=${pageNo}&title=${keyword}`;
      } else {
        url = `${BACKEND_URL}/users?page=${pageState.page}`;
      }
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Users: ", response);

      let rowsDataArray = "";
      if (response?.data?.managers?.current_page > 1) {
        const theme_values = Object.values(response?.data?.managers?.data);
        rowsDataArray = theme_values;
      } else {
        rowsDataArray = response?.data?.managers?.data;
      }

      let rowsdata = rowsDataArray?.map((row, index) => ({
        id: row?.id,
        userName: row?.userName || "No Name",
        position: row?.position || "No Position",
        userContact: row?.userContact || "No Contact",
        userEmail: row?.userEmail || "No Email",
        status: row?.status,
        is_trainer: row?.is_trainer,
        role: row?.role,
        salary: row?.salary,
        profile_picture: row?.profile_picture,
        edit: "edit",
      }));

      console.log("Rows Data: ", rowsdata);

      setpageState((old) => ({
        ...old,
        isLoading: false,
        data: rowsdata,
        pageSize: response?.data?.managers?.per_page,
        total: response?.data?.managers?.total,
      }));

      setUser(response?.data);
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

  const handleTrainerSwitchChange = async (cellValues) => {
    console.log("Id: ", cellValues?.id);
    const token = localStorage.getItem("auth-token");

    const make_trainer = cellValues?.formattedValue === 1 ? 2 : 1;

    console.log("Make trainer: ", make_trainer);

    const Update_trainer = new FormData();

    Update_trainer.append("is_trainer", make_trainer);

    try {
      const is_trainer = await axios.post(
        `${BACKEND_URL}/updateuser/${cellValues?.id}`,
        Update_trainer,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("User trainer permission updated.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      fetchUsers(token);

      console.log("Response: ", is_trainer);
    } catch (error) {
      toast.error("Unable to update user.", {
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
    setpageState((oldPageState) => ({ ...oldPageState, page: 1 }));
  }, []);

  useEffect(() => {
    if (searchRef.current.querySelector("input").value) {
      fetchUsers(
        token,
        searchRef.current.querySelector("input").value,
        pageState.page
      );
    } else {
      fetchUsers(token);
    }
  }, [pageState.page]);

  const columns = [
    {
      field: "profile_picture",
      headerName: "User",
      headerAlign: "center",
      align: "center",
      editable: false,
      minWidth: 180,
      flex: 1,
      renderCell: (cellValues) => {
        console.log("Image: ", cellValues);
        const imgSrc = cellValues?.formattedValue;
        if (imgSrc) {
          return (
            <>
              <div className="flex flex-col items-center my-2">
                <img
                  src={imgSrc}
                  alt="User"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />
                <h2 className="mt-2">{cellValues.row.userName}</h2>
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className="flex flex-col items-center my-2">
                <Avatar
                  alt="User"
                  variant="circular"
                  style={{ width: "30px", height: "30px" }}
                />
                <h2 className="mt-2">{cellValues.row.userName}</h2>
              </div>
            </>
          );
        }
      },
    },

    // {
    //   field: "userName",
    //   headerName: "User Name",
    //   headerAlign: "center",
    //   editable: false,
    //   minWidth: 180,
    //   flex: 1,
    // },
    {
      field: "userContact",
      headerName: "Contact Number",
      headerAlign: "center",
      editable: false,
      minwidth: 130,
      flex: 1,
    },
    {
      field: "position",
      headerName: "Position",
      headerAlign: "center",
      editable: false,
      minwidth: 150,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center ">
            <p className="text-center capitalize">
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    {
      field: "userEmail",
      headerName: "Email Address",
      headerAlign: "center",
      editable: false,
      minwidth: 250,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues?.formattedValue}</p>
          </div>
        );
      },
    },
    {
      field: "salary",
      headerName: "Salary",
      headerAlign: "center",
      editable: false,
      minwidth: 80,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex items-center justify-center">
            {cellValues?.formattedValue} AED
          </div>
        );
      },
    },
    {
      field: "is_trainer",
      headerName: "Trainer",
      headerAlign: "center",
      editable: false,
      minwidth: 60,
      flex: 1,
      renderCell: (cellValues) => {
        console.log("Trainer: ", cellValues);

        return (
          <div className="w-full flex items-center justify-center capitalize">
            {/* <Switch
              defaultChecked={cellValues?.formattedValue === 1}
              onChange={() => handleTrainerSwitchChange(cellValues)}
              color={"default"}
              sx={{
                "&.Mui-checked": {
                  color: "#fff",
                },
              }}
            /> */}
            <Switch
              defaultChecked={cellValues?.formattedValue === 1}
              onChange={() => handleTrainerSwitchChange(cellValues)}
              sx={{
                color: "green !important",
                "& .MuiSwitch-thumb": {
                  color:
                    cellValues?.formattedValue === 1
                      ? "green !important"
                      : "#B91C1C !important",
                },
                "& .Mui-checked": {
                  color:
                    cellValues?.formattedValue === 1
                      ? "green !important"
                      : "#B91C1C !important",
                },
                "& .MuiSwitch-track": {
                  backgroundColor:
                    cellValues?.formattedValue === 1
                      ? "green !important"
                      : "#B91C1C !important",
                },
                "& .css-1q0bjt2-MuiSwitch-root .MuiSwitch-thumb": {
                  backgroundColor:
                    cellValues?.formattedValue === 1
                      ? "green !important"
                      : "#B91C1C !important",
                },
              }}
            />
          </div>
        );
      },
    },

    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      editable: false,
      minwidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues?.formattedValue === 1 ? (
              <div className="w-full h-full flex justify-center items-center text-[#0f9d58] px-5 text-xs font-semibold">
                ACTIVE
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center text-[#ff0000] px-5 text-xs font-semibold">
                DEACTIVE
              </div>
            )}
            {/* 
            {cellValues?.formattedValue === 0 && (
              <div className="w-full h-full flex justify-center items-center text-[#ff0000] px-5 text-xs font-semibold">
                DEACTIVE
              </div>
            )} */}
          </>
        );
      },
    },
    {
      field: "",
      headerName: "Action",
      minwidth: 90,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div className=" space-x-2 w-full flex items-center justify-center ">
            {hasPermission("users_delete") ? (
              <>
                {cellValues.row.status === 1 ? (
                  <Button
                    onClick={() =>
                      handleDelete(
                        cellValues?.id,
                        cellValues.row.status,
                        cellValues?.row?.userName
                      )
                    }
                    className={`editUserBtn ${
                      currentMode === "dark"
                        ? "text-white bg-transparent rounded-md p-1 shadow-none "
                        : "text-black bg-transparent rounded-md p-1 shadow-none "
                    }`}
                  >
                    {currentMode === "dark" ? (
                      <FaBan style={{ color: "white" }} size={18} />
                    ) : (
                      <FaBan style={{ color: "black" }} size={18} />
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      handleDelete(
                        cellValues?.id,
                        cellValues.row.status,
                        cellValues?.row?.userName
                      )
                    }
                    className={`editUserBtn ${
                      currentMode === "dark"
                        ? "text-white bg-transparent rounded-md p-1 shadow-none "
                        : "text-black bg-transparent rounded-md p-1 shadow-none "
                    }`}
                  >
                    {currentMode === "dark" ? (
                      <FaUnlock style={{ color: "white" }} size={18} />
                    ) : (
                      <FaUnlock style={{ color: "black" }} size={18} />
                    )}
                  </Button>
                )}
              </>
            ) : null}
            <Button
              title="Edit User"
              className={`editUserBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <Link to={`/updateuser/${cellValues?.id}`}>
                {" "}
                <AiOutlineEdit size={20} />
              </Link>
            </Button>

            {hasPermission("role_update") ? (
              <Button
                onClick={() =>
                  HandlePermissionModel(
                    cellValues?.id,
                    cellValues.row.status,
                    cellValues?.row?.userName,
                    cellValues?.row?.role
                  )
                }
                className={`editUserBtn ${
                  currentMode === "dark"
                    ? "text-white bg-transparent rounded-md p-1 shadow-none "
                    : "text-black bg-transparent rounded-md p-1 shadow-none "
                }`}
              >
                <BsPersonFillLock
                  style={{ color: currentMode === "dark" ? "white" : "black" }}
                  size={20}
                />
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex min-h-screen">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className={`w-full `}>
            <div className="pl-3">
              <div className="my-5 mb-10">
                {model && (
                  <AddUserModel
                    handleOpenModel={HandleOpenModel}
                    addUserModelClose={HandleModelClose}
                  />
                )}
                <div className="mt-3 flex justify-between items-center">
                  <h1
                    className={`text-lg border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-red-600 font-bold border-red-600"
                    }`}
                  >
                    ● Users{" "}
                    <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                      <span>{pageState?.total}</span>
                    </span>
                  </h1>
                  {hasPermission("users_create") ? (
                    <Button
                      className="bg-main-red-color hover:bg-red-700 text-white px-4 py-2 rounded-md mr-2 "
                      onClick={HandleOpenModel}
                    >
                      <span className="flex justify-between items-center ">
                        <AiOutlinePlus style={{ marginRight: "0.5em" }} />
                        Add User
                      </span>
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Box
                    sx={{
                      ...darkModeColors,
                      "& .MuiTabs-indicator": {
                        // height: "100%",
                        borderRadius: "5px",
                        backgroundColor: "#da1f26",
                      },
                      "& .Mui-selected": {
                        color: "white !important",
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
                      <Tab
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
                      />
                    </Tabs>
                  </Box>
                  {value === 0 && (
                    <div>
                      <TextField
                        placeholder="Search.."
                        ref={searchRef}
                        sx={{
                          "& input": {
                            borderBottom: "2px solid #ffffff6e",
                          },
                        }}
                        variant="standard"
                        onKeyUp={handleKeyUp}
                        onInput={handleSearch}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton sx={{ padding: 0 }}>
                                <BiSearch size={17} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-3 pb-3">
                  <TabPanel value={value} index={0}>
                    <Box
                      className={`${currentMode}-mode-datatable`}
                      // width={"100%"}
                      sx={{ ...DataGridStyles, marginBottom: "5%" }}
                    >
                      <DataGrid
                        autoHeight
                        disableSelectionOnClick
                        rows={pageState.data}
                        columns={columns}
                        rowCount={pageState.total}
                        loading={pageState.isLoading}
                        rowsPerPageOptions={[30, 50, 75, 100]}
                        pagination
                        // width="auto"
                        getRowHeight={() => "auto"}
                        paginationMode="server"
                        page={pageState.page - 1}
                        pageSize={pageState.pageSize}
                        componentsProps={{
                          toolbar: {
                            printOptions: {
                              disableToolbarButton: User?.role !== 1,
                            },
                            csvOptions: {
                              disableToolbarButton: User?.role !== 1,
                            },
                            showQuickFilter: true,
                          },
                        }}
                        onPageChange={(newPage) => {
                          setpageState((old) => ({
                            ...old,
                            page: newPage + 1,
                          }));
                        }}
                        onPageSizeChange={(newPageSize) =>
                          setpageState((old) => ({
                            ...old,
                            pageSize: newPageSize,
                          }))
                        }
                        sx={{
                          boxShadow: 2,
                          "& .MuiDataGrid-cell:hover": {
                            cursor: "pointer",
                          },
                          "& .MuiDataGrid-cell[data-field='edit'] svg": {
                            color:
                              currentMode === "dark"
                                ? "white !important"
                                : "black !important",
                          },
                        }}
                        getRowClassName={(params) =>
                          params.indexRelativeToCurrentPage % 2 === 0
                            ? "even"
                            : "odd"
                        }
                      />
                    </Box>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <UserTable
                      tabValue={tabValue}
                      setTabValue={setTabValue}
                      user={user}
                    />
                  </TabPanel>
                </div>
                {openDeleteModel && (
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
                )}
              </div>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Users;
