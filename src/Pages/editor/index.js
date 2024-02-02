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
  Tooltip,
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
import { BsPersonFillGear, BsSearch, BsPersonFillSlash } from "react-icons/bs";
import UpdateUserPermissions from "../../Components/addUser/UpdateUserPermissions";
import ShareCreditsModal from "../../Components/addUser/ShareCreditsModal";
import GrapesJSEditor from "../../Components/editorComp/GrapesJSEditor";

const Editor = () => {
  const {
    currentMode,
    DataGridStyles,
    BACKEND_URL,
    pageState,
    setpageState,
    User,
    darkModeColors,
    themeBgImg,
    t,
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
    data: {},
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

  return (
    <>
      <div className="flex min-h-screen">
        <div
          className={`w-full p-4 ${
            !themeBgImg & (currentMode === "dark" ? "bg-black" : "bg-white")
          }`}
        >
          <div className="mb-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center pb-3">
                <div className="bg-primary h-10 w-1 rounded-full"></div>
                <h1
                  className={`text-lg font-semibold mx-2 uppercase ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {t("page_builder")}{" "}
                </h1>
              </div>
            </div>
            <GrapesJSEditor />
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

export default Editor;
