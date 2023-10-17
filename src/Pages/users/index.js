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
  Tooltip
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import EditUserModal from "../../Components/Users/EditUserModal";

import {
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineTable,
  AiOutlineAppstore,
} from "react-icons/ai";
import { RiCoinsFill } from "react-icons/ri";
import React, { useEffect, useState, useRef } from "react";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import UserTable from "../../Components/Users/UserTable";
import AddUserModel from "../../Components/addUser/AddUserModel";
import { FaBan, FaUnlock } from "react-icons/fa";
import DeleteUser from "../../Components/Users/DeleteUser";
import { 
  BsPersonFillGear, 
  BsSearch,
  BsPersonFillSlash 
} from "react-icons/bs";
import UpdateUserPermissions from "../../Components/addUser/UpdateUserPermissions";
import ShareCreditsModal from "../../Components/addUser/ShareCreditsModal";

const Users = () => {
  const {
    currentMode,
    DataGridStyles,
    BACKEND_URL,
    pageState,
    setpageState,
    User,
    darkModeColors,
    themeBgImg
  } = useStateContext();
  const { hasPermission } = usePermission();

  const [user, setUser] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [value, setValue] = useState(0);
  const [model, setModel] = useState(false);
  const [userID, setUserId] = useState();
  const [userStatus, setUserStatus] = useState();
  const [username, setUserName] = useState();
  const [shareCreditsModal, setShareCreditsModal] = useState({
    open: false, 
    data: {}
  });
  const [role, setUserRole] = useState();
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [openPermissionModel, setOpenPermissionModel] = useState(false);
  const token = localStorage.getItem("auth-token");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const handleCloseEditModal = () => setEditModalOpen(false);
  const handleEditModal = (id) => {
    setUserId(id);
    setEditModalOpen(true);
    // handleLeadModelClose();
  };

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
        currency: row?.currency,
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
    console.log("useeffect called from users->index::: ");
    if (value === 0) {
      if (searchRef.current.querySelector("input").value) {
        fetchUsers(
          token,
          searchRef.current.querySelector("input").value,
          pageState.page
        );
      } else {
        fetchUsers(token);
      }
    }
  }, [pageState.page]);

  const columns = [
    // NAME + PICTURE
    {
      field: "profile_picture",
      headerName: "User Name",
      headerAlign: "center",
      align: "center",
      editable: false,
      minWidth: 150,
      flex: 1,
      renderCell: (cellValues) => {
        console.log("Image: ", cellValues);
        const imgSrc = cellValues?.formattedValue;
        if (imgSrc) {
          return (
            <>
              <div className="flex my-2 mx-3 items-center justify-start text-left w-full">
                <img
                  src={imgSrc}
                  alt="User"
                  className="mr-3"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                  }}
                />
                <h2 className="">{cellValues.row.userName}</h2>
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className="flex my-2 mx-3 items-center justify-start text-left w-full">
                <Avatar
                  alt="User"
                  className={`${currentMode === "dark" ? "text-dark" : "text-white"} mr-3`}
                  variant="circular"
                  style={{ width: "30px", height: "30px" }}
                />
                <h2 className="">{cellValues.row.userName}</h2>
              </div>
            </>
          );
        }
      },
    },
    // POSITION
    {
      field: "position",
      headerName: "Profession",
      headerAlign: "center",
      editable: false,
      minwidth: 100,
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
    // CONTACT
    {
      field: "userContact",
      headerName: "Contact Number",
      headerAlign: "center",
      editable: false,
      minwidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues?.formattedValue}</p>
          </div>
        );
      },
    },
    // EMAIL ADDRESS
    {
      field: "userEmail",
      headerName: "Email Address",
      headerAlign: "center",
      editable: false,
      minwidth: 200,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className="text-center">{cellValues?.formattedValue}</p>
          </div>
        );
      },
    },
    // SALARY
    {
      field: "salary",
      headerName: "Salary",
      headerAlign: "center",
      editable: false,
      minwidth: 70,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex items-center justify-center">
            {cellValues?.row?.currency} {cellValues?.formattedValue}
          </div>
        );
      },
    },
    // TRAINER
    {
      field: "is_trainer",
      headerName: "Trainer",
      headerAlign: "center",
      editable: false,
      minwidth: 40,
      flex: 1,
      renderCell: (cellValues) => {
        console.log("Trainer: ", cellValues);

        return (
          <div className="w-full flex items-center justify-center">  
            <Switch
              size="small"
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
    // STATUS
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      editable: false,
      minwidth: 50,
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
      field: "notes",
      headerName: "Action",
      minwidth: 100,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div className="space-x-2 w-full flex items-center justify-start mx-2">

            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-blue-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center editUserBtn`}
            >
              <Tooltip title="Edit User" arrow>
                <button className="editUserBtn"
                  onClick={() =>
                    handleEditModal(
                      cellValues?.id
                    )
                  }
                >
                  {/* <Link to={`/updateuser/${cellValues?.id}`}> */}
                    <AiOutlineEdit size={16} />
                  {/* </Link> */}
                </button>
              </Tooltip>
            </p>

            {cellValues?.row?.status === 1 && (
              <>
                {/* SEND CREDIT  */}
                <p
                  style={{ cursor: "pointer" }}
                  className={`${
                    currentMode === "dark"
                      ? "text-[#FFFFFF] bg-[#262626]"
                      : "text-[#1C1C1C] bg-[#EEEEEE]"
                  } hover:bg-yellow-500 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center editUserBtn`}
                >
                  <Tooltip title="Share Credits" arrow>
                    <button onClick={() => setShareCreditsModal({
                        open: true, 
                        data: cellValues?.row
                      })}
                    >
                      {/* <GiTwoCoins size={16} /> */}
                      <RiCoinsFill size={16} />
                    </button>
                  </Tooltip>
                </p>
                
                {/* UPDATE ROLE  */}
                {cellValues.row.role !== 1 && (
                  hasPermission("role_update") ? (
                    <p
                      style={{ cursor: "pointer" }}
                      className={`${
                        currentMode === "dark"
                          ? "text-[#FFFFFF] bg-[#262626]"
                          : "text-[#1C1C1C] bg-[#EEEEEE]"
                      } hover:bg-green-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center editUserBtn`}
                    >
                      <Tooltip title="Update Role" arrow>
                        <button onClick={() =>
                          HandlePermissionModel(
                            cellValues?.id,
                            cellValues.row.status,
                            cellValues?.row?.userName,
                            cellValues?.row?.role
                          )
                        }>
                          <BsPersonFillGear size={16} />
                        </button>
                      </Tooltip>
                    </p>
                  ) : null
                )}

                {/* DELETE USER  */}
                {hasPermission("users_delete") ? (
                  <>
                    <p
                      style={{ cursor: "pointer" }}
                      className={`${
                        currentMode === "dark"
                          ? "text-[#FFFFFF] bg-[#262626]"
                          : "text-[#1C1C1C] bg-[#EEEEEE]"
                      } hover:bg-red-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center editUserBtn`}
                    >
                      <Tooltip title="Deactivate User" arrow>
                        <button onClick={() =>
                          handleDelete(
                            cellValues?.id,
                            cellValues.row.status,
                            cellValues?.row?.userName
                          )
                        }>
                          <BsPersonFillSlash size={16} />
                        </button>
                      </Tooltip>
                    </p>

                    {/* <Button
                      onClick={() =>
                        
                      }
                      className={`editUserBtn ${
                        currentMode === "dark"
                          ? "text-white bg-transparent rounded-md p-1 shadow-none "
                          : "text-black bg-transparent rounded-md p-1 shadow-none "
                      }`}
                    >
                      {currentMode === "dark" ? (
                        <FaUnlock style={{ color: "white" }} size={16} />
                      ) : (
                        <FaUnlock style={{ color: "black" }} size={16} />
                      )}
                    </Button> */}
                  </>
                ) : null}
              </>
            )}
            
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex min-h-screen">
        <div
          className={`w-full p-4 ${
            !themeBgImg & (currentMode === "dark" ? "bg-black" : "bg-white")
          }`}
        >
          <div className="mb-10">
            {model && (
              <AddUserModel
                handleOpenModel={HandleOpenModel}
                addUserModelClose={HandleModelClose}
              />
            )}
            <div className="flex justify-between items-center">
              <div className="flex items-center pb-3">
                <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark"
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  Users {" "}
                  <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                    {pageState?.total}
                  </span>
                </h1>
              </div>
              {hasPermission("users_create") ? (
                <Button
                  className="bg-btn-primary text-white px-4 py-2 rounded-md mr-2 "
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
              {value === 0 && (
                <div className="mx-5 mt-6">
                  <Box sx={darkModeColors} >
                    <TextField
                      placeholder="Search.."
                      ref={searchRef}
                      variant="standard"
                      onKeyUp={handleKeyUp}
                      onInput={handleSearch}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton sx={{ padding: 1 }}>
                              <BsSearch className={`${currentMode === "dark" ? "text-white" : "text-black"}`} size={18} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </div>
              )}
              {value === 1 && <div className="mx-5"></div>}
              <Box
                sx={{
                  ...darkModeColors,
                  "& .MuiTabs-indicator": {
                    // height: "20%",
                    borderRadius: "5px",
                  },
                  "& .Mui-selected": {
                    color: "white !important",
                    zIndex: "1",
                  },
                }}
                className={`rounded-md overflow-hidden`}
              >
                <Tabs
                  value={value}
                  onClick={handleChange}
                  variant="standard"
                >
                  <Tab
                    icon={
                      <AiOutlineTable
                        size={20}
                        style={{
                          color:
                            currentMode === "dark" ? "#ffffff" : "#000000",
                        }}
                      />
                    }
                  />
                  <Tab
                    icon={
                      <AiOutlineAppstore
                        size={20}
                        style={{
                          color:
                            currentMode === "dark" ? "#ffffff" : "#000000",
                        }}
                      />
                    }
                  />
                </Tabs>
              </Box>
            </div>
            <div className="mt-3 pb-3">
              <TabPanel value={value} index={0}>
                <Box
                  className={`${currentMode}-mode-datatable`}
                  // width={"100%"}
                  sx={{ ...DataGridStyles, marginBottom: "5%" }}
                >
                  <DataGrid
                    disableDensitySelector
                    autoHeight
                    disableSelectionOnClick
                    rows={pageState.data}
                    // columns={columns}
                    columns={columns?.filter((c) =>
                      hasPermission("users_col_" + c?.field)
                    )}
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

            {shareCreditsModal && (
              <ShareCreditsModal
                shareCreditsModal={shareCreditsModal}
                handleClose={() => setShareCreditsModal({open: false, data: {}})}
              />
            )}

            {editModalOpen && (
              <EditUserModal
                UserData={userID}
                handleCloseEditModal={handleCloseEditModal}
                setEditModalOpen={setEditModalOpen}
                fetchUser={fetchUsers}
              />
            )}
          </div>
          
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
