import { Button, Pagination, Stack, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";

import axios from "../../axoisConfig";
import { FaBan, FaUnlock } from "react-icons/fa";
import { Link } from "react-router-dom";
import SingleUser from "./SingleUser";
import usePermission from "../../utils/usePermission";
import DeleteUser from "./DeleteUser";
import EditUserModal from "./EditUserModal";

import { MdOutlineCall, MdOutlinePermContactCalendar } from "react-icons/md";
import { TfiEmail } from "react-icons/tfi";
import { AiOutlineEdit } from "react-icons/ai";
import { HiOutlineBan } from "react-icons/hi";
import { AiFillUnlock } from "react-icons/ai";

const UserTable = ({}) => {
  const [loading, setLoading] = useState(false);
  const {
    currentMode,
    BACKEND_URL,
    pageState,
    setpageState,
    primaryColor,
    themeBgImg,
    t,
  } = useStateContext();
  const [maxPage, setMaxPage] = useState(0);
  const [userData, setUserData] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [singleUser, setSingleUserData] = useState({});
  const [userID, setUserId] = useState();
  const [status, setUserStatus] = useState();
  const [username, setUserName] = useState();
  const [currentPage, setCurrentPage] = useState();
  const token = localStorage.getItem("auth-token");
  const { hasPermission } = usePermission();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const handleCloseEditModal = () => setEditModalOpen(false);
  const handleEditModal = (id) => {
    setUserId(id);
    setEditModalOpen(true);
    // handleLeadModelClose();
  };

  const handlePageChange = (event, value) => {
    console.log("pagination value: ", value);
    setpageState({ ...pageState, page: value });
    // setCurrentPage();
  };

  const handleModel = (id) => {
    console.log("SU ID: ", id);
    const selectedUser = userData?.find((user) => user.id === id);
    console.log("Selected User: ", selectedUser);
    setSingleUserData(selectedUser);
    setOpenModel(true);
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

  const handleModelClose = () => {
    setOpenModel(false);
  };

  // useEffect(() => {
  //   setpageState((oldPageState) => ({ ...oldPageState, page: 1 }));
  // }, [pageState.page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/users?page=${pageState.page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setUserData(response.data?.managers?.data);
      setMaxPage(response.data?.managers?.last_page);
      setCurrentPage(response.data?.managers?.currentPage);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageState.page]);

  return (
    <>
      <div className="min-h-screen">
        {openModel && (
          <SingleUser
            UserModelOpen={handleModel}
            handleUserModelClose={handleModelClose}
            UserData={singleUser}
          />
        )}
        {openDeleteModel && (
          <DeleteUser
            UserModelOpen={handleDelete}
            handleUserModelClose={handleDeleteModelClose}
            UserData={userID}
            UserStatus={status}
            UserName={username}
            fetchUser={fetchUsers}
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

        {loading ? (
          <Loader />
        ) : (
          <div className={`w-full`}>
            <div className="px-5">
              <div className="mt-5 md:mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 pb-3">
                  {userData?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          !themeBgImg
                            ? currentMode === "dark"
                              ? "bg-[#1c1c1c] text-white"
                              : "bg-[#EEEEEE] text-black"
                            : currentMode === "dark"
                            ? "blur-bg-dark text-white"
                            : "blur-bg-light text-black"
                        } rounded-md relative hover:shadow-lg text-sm`}
                      >
                        <div
                          className={`border-primary grid grid-cols-12 border-t-2 rounded-md`}
                        >
                          <div className="col-span-10 p-2">
                            <div className="flex items-center m-1 mb-4">
                              {/* IMAGE  */}
                              {item?.profile_picture ? (
                                <img
                                  src={item?.profile_picture}
                                  className="rounded-full cursor-pointer h-[50px] w-[50px] object-cover"
                                  alt=""
                                />
                              ) : (
                                <Avatar
                                  alt="User"
                                  variant="circular"
                                  style={{ width: "50px", height: "50px" }}
                                />
                              )}
                              {/* NAME & POSITION  */}
                              <div className="mx-3 space-y-1 overflow-hidden">
                                <h1 className="font-bold text-base">
                                  {item?.userName}
                                </h1>
                                <p className="font-semibold">
                                  {item?.position}
                                </p>
                              </div>
                            </div>
                            {/* <div className={`${currentMode === "dark" ? "bg-[#AAAAAA]" : "bg-[#AAAAAA]"} h-0.5 w-full my-3`}></div> */}
                            <div className="space-y-4 m-1">
                              <div className="flex">
                                <MdOutlineCall size={16} className="mr-3" />
                                <p>{item?.userContact}</p>
                              </div>
                              <div className="flex">
                                <TfiEmail size={16} className="mr-3" />
                                <p>{item?.userEmail}</p>
                              </div>

                              {item?.status !== 1 ? (
                                <p className="text-red-600 text-xs font-semibold">
                                  DEACTIVATED ACCOUNT
                                </p>
                              ) : (
                                <p className="text-green-600 text-xs font-semibold">
                                  ACTIVE ACCOUNT
                                </p>
                              )}
                            </div>
                          </div>

                          <div className={`col-span-2 px-2 rounded-md`}>
                            <div
                              className={`flex flex-col space-y-1 justify-center p-1 pt-3 rounded-b-full`}
                            >
                              {/* VIEW  */}
                              <div className="w-full flex justify-center">
                                <Tooltip title="View User Details" arrow>
                                  <button
                                    onClick={() => handleModel(item?.id)}
                                    className="rounded-full bg-primary p-2"
                                  >
                                    <MdOutlinePermContactCalendar
                                      size={18}
                                      className={`text-white hover:text-black`}
                                    />
                                  </button>
                                </Tooltip>
                              </div>

                              {/* EDIT  */}
                              <div className="w-full flex justify-center items-center">
                                <Tooltip title="Edit User Details" arrow>
                                  <button
                                    onClick={() => handleEditModal(item?.id)}
                                    className="rounded-full bg-primary p-2"
                                  >
                                    <AiOutlineEdit
                                      size={18}
                                      className={`text-white hover:text-black`}
                                    />
                                  </button>
                                </Tooltip>
                              </div>

                              {/* DEACTIVATE & REACTIVATE */}
                              {item?.role !== 1 && (
                                <div className="w-full flex justify-center">
                                  {hasPermission("users_delete") ? (
                                    <>
                                      {item?.status === 1 ? (
                                        <Tooltip title="Deactivate User" arrow>
                                          <button
                                            onClick={() =>
                                              handleDelete(
                                                item?.id,
                                                item?.status,
                                                item?.userName
                                              )
                                            }
                                            className="rounded-full bg-primary p-2"
                                          >
                                            <HiOutlineBan
                                              size={18}
                                              className={`text-white hover:text-black`}
                                            />
                                          </button>
                                        </Tooltip>
                                      ) : (
                                        <></>
                                        // <Tooltip title="Reactivate User" arrow>
                                        //   <button
                                        //     onClick={() =>
                                        //       handleDelete(
                                        //         item?.id,
                                        //         item?.status,
                                        //         item?.userName
                                        //       )
                                        //     }
                                        //     className="rounded-full bg-primary p-2"
                                        //   >
                                        //     <AiFillUnlock size={18} className={`text-white hover:text-black`} />
                                        //   </button>
                                        // </Tooltip>
                                      )}
                                    </>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="absolute items-center right-2 flex flex-col space-y-10"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <Stack spacing={2} marginTop={2}>
              <Pagination
                count={maxPage}
                color={currentMode === "dark" ? "primary" : "secondary"}
                onChange={handlePageChange}
                style={{ margin: "auto" }}
                page={pageState.page}
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
          </div>
        )}
      </div>
    </>
  );
};

export default UserTable;
